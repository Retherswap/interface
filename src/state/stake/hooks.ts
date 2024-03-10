import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WETH, Pair } from '@retherswap/sdk';
import { useMemo } from 'react';
import { HINU, RETHER, STAKE, STAKE1 } from '../../constants';
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards';
import { useActiveWeb3React } from '../../hooks';
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks';
import { tryParseAmount } from '../swap/hooks';
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp';

export const STAKING_GENESIS = 1706814000;

export const REWARDS_DURATION_DAYS = 172;

// TODO add staking rewards addresses here
export const STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: {
    tokens: [Token, Token];
    stakingRewardAddress: string;
    reward: Token;
  }[];
} = {
  [ChainId.HYPRA]: [
    {
      tokens: [WETH[ChainId.HYPRA], STAKE1],
      stakingRewardAddress: '0xe1a9de49CAc8648332735FEFE7D88C91EdEDfe91',
      reward: RETHER[ChainId.HYPRA],
    },
    {
      tokens: [WETH[ChainId.HYPRA], HINU],
      stakingRewardAddress: '0x79b976B7942B2Ed81997006fbe93c99e83F3535A',
      reward: HINU,
    },
  ],
};

export interface StakingInfo {
  // the address of the reward contract
  stakingRewardAddress: string;
  // the tokens involved in this pair
  tokens: [Token, Token];
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount;
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount;
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount;
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: TokenAmount;
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount;
  rewardToken: Token;
  // the duration of the rewards
  rewardsDuration: number;
  // when the period ends
  periodFinish: Date | undefined;
  // when the last update was
  lastTimeRewardApplicable: Date | undefined;
  // if pool is active
  active: boolean;
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate: TokenAmount
  ) => TokenAmount;
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(pairToFilterBy?: Pair | null): StakingInfo[] {
  const { chainId, account } = useActiveWeb3React();

  // detect if staking is ended
  const currentBlockTimestamp = useCurrentBlockTimestamp();

  const info = useMemo(
    () =>
      chainId
        ? STAKING_REWARDS_INFO[chainId]?.filter((stakingRewardInfo) =>
            pairToFilterBy === undefined
              ? true
              : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
                pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1])
          ) ?? []
        : [],
    [chainId, pairToFilterBy]
  );

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info]);

  const accountArg = useMemo(() => [account ?? undefined], [account]);

  // get all the info from the staking rewards contracts
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg);
  const earnedAmounts = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'earned',
    accountArg
  );
  const totalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply');
  const lastTimeRewardApplicable = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'lastTimeRewardApplicable'
  );

  const rewardsDuration = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'rewardsDuration');

  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'rewardRate',
    undefined,
    NEVER_RELOAD
  );
  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'periodFinish',
    undefined,
    NEVER_RELOAD
  );

  return useMemo(() => {
    if (!chainId) return [];

    return rewardsAddresses.reduce<StakingInfo[]>((memo, rewardsAddress, index) => {
      // these two are dependent on account
      const balanceState = balances[index];
      const earnedAmountState = earnedAmounts[index];

      // these get fetched regardless of account
      const totalSupplyState = totalSupplies[index];
      const rewardRateState = rewardRates[index];
      const periodFinishState = periodFinishes[index];
      const lastTimeRewardApplicableState = lastTimeRewardApplicable[index];
      const rewardsDurationState = rewardsDuration[index];

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        totalSupplyState &&
        !totalSupplyState.loading &&
        rewardRateState &&
        !rewardRateState.loading &&
        periodFinishState &&
        !periodFinishState.loading &&
        lastTimeRewardApplicableState &&
        !lastTimeRewardApplicableState.loading &&
        rewardsDurationState &&
        !rewardsDurationState.loading
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          totalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error ||
          lastTimeRewardApplicableState.error ||
          rewardsDurationState.error
        ) {
          console.error('Failed to load staking rewards info');
          return memo;
        }

        // get the LP token
        const tokens = info[index].tokens;
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'));

        // check for account, if no account set to 0

        const stakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(balanceState?.result?.[0] ?? 0));
        const totalStakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(totalSupplyState.result?.[0]));
        const totalRewardRate = new TokenAmount(info[index].reward, JSBI.BigInt(rewardRateState.result?.[0]));

        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            info[index].reward,
            JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
              : JSBI.BigInt(0)
          );
        };

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate);

        const periodFinishSeconds = periodFinishState.result?.[0]?.toNumber();
        const periodFinishMs = periodFinishSeconds * 1000;

        const lastTimeRewardApplicableSeconds = lastTimeRewardApplicableState.result?.[0]?.toNumber();
        const lastTimeRewardApplicableMs = lastTimeRewardApplicableSeconds * 1000;

        // compare period end timestamp vs current block timestamp (in seconds)
        const active =
          periodFinishSeconds && currentBlockTimestamp ? periodFinishSeconds > currentBlockTimestamp.toNumber() : true;

        memo.push({
          stakingRewardAddress: rewardsAddress,
          tokens: info[index].tokens,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          lastTimeRewardApplicable: lastTimeRewardApplicableMs > 0 ? new Date(lastTimeRewardApplicableMs) : undefined,
          rewardsDuration: rewardsDurationState.result?.[0]?.toNumber(),
          rewardToken: info[index].reward,
          earnedAmount: new TokenAmount(info[index].reward, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          rewardRate: individualRewardRate,
          totalRewardRate: totalRewardRate,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          getHypotheticalRewardRate,
          active,
        });
      }
      return memo;
    }, []);
  }, [
    balances,
    chainId,
    currentBlockTimestamp,
    earnedAmounts,
    info,
    periodFinishes,
    rewardRates,
    rewardsAddresses,
    totalSupplies,
    rewardsDuration,
    lastTimeRewardApplicable,
  ]);
}

export function useTotalRethersEarned(): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React();
  const stake = chainId ? STAKE[chainId] : undefined;
  const stakingInfos = useStakingInfo();

  return useMemo(() => {
    if (!stake) return undefined;
    return (
      stakingInfos?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(stake, '0')
      ) ?? new TokenAmount(stake, '0')
    );
  }, [stakingInfos, stake]);
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token,
  userLiquidityUnstaked: TokenAmount | undefined
): {
  parsedAmount?: CurrencyAmount;
  error?: string;
} {
  const { account } = useActiveWeb3React();

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken);

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
      ? parsedInput
      : undefined;

  let error: string | undefined;
  if (!account) {
    error = 'Connect Wallet';
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount';
  }

  return {
    parsedAmount,
    error,
  };
}

// based on typed value
export function useDerivedUnstakeInfo(
  typedValue: string,
  stakingAmount: TokenAmount
): {
  parsedAmount?: CurrencyAmount;
  error?: string;
} {
  const { account } = useActiveWeb3React();

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingAmount.token);

  const parsedAmount =
    parsedInput && JSBI.lessThanOrEqual(parsedInput.raw, stakingAmount.raw) ? parsedInput : undefined;

  let error: string | undefined;
  if (!account) {
    error = 'Connect Wallet';
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount';
  }

  return {
    parsedAmount,
    error,
  };
}
