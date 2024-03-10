import { JSBI, Token, TokenAmount } from '@retherswap/sdk';
import { usePair } from 'data/Reserves';
import { useTotalSupply } from 'data/TotalSupply';
import { useMemo } from 'react';
import { useStakingInfo } from 'state/stake/hooks';

export default function usePoolAPR(tokenA: Token | undefined, tokenB: Token | undefined) {
  const [, stakingTokenPair] = usePair(tokenA, tokenB);
  const stakingInfo = useStakingInfo(stakingTokenPair)?.[0];
  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo?.stakedAmount?.token);
  return useMemo(() => {
    if (
      totalSupplyOfStakingToken &&
      totalSupplyOfStakingToken.greaterThan(JSBI.BigInt(0)) &&
      stakingInfo &&
      stakingInfo.rewardsDuration &&
      stakingTokenPair &&
      stakingInfo.totalStakedAmount.greaterThan(JSBI.BigInt(0))
    ) {
      return (
        // Annual reward rate
        stakingInfo.totalRewardRate
          .multiply(JSBI.BigInt(365 * 24 * 60 * 60))
          // Get the total locked value of the LP token in terms of the token1 and divide the total annual reward by it to get the APR
          .divide(
            new TokenAmount(
              stakingTokenPair.token1,
              JSBI.divide(
                JSBI.multiply(
                  JSBI.multiply(
                    stakingInfo.totalStakedAmount.raw,
                    stakingTokenPair.reserveOf(stakingTokenPair.token1).raw
                  ),
                  JSBI.BigInt(2)
                ),
                totalSupplyOfStakingToken.raw
              )
            ).toFixed(0)
          )
          // Convert to percentage
          .multiply(JSBI.BigInt(100))
          .toFixed(0)
      );
    }
    return '-';
  }, [stakingInfo, totalSupplyOfStakingToken, stakingTokenPair]);
}
