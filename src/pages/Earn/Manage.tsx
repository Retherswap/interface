import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { AutoColumn } from '../../components/Column';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { JSBI, TokenAmount, ETHER } from '@retherswap/sdk';
import { RouteComponentProps } from 'react-router-dom';
import DoubleCurrencyLogo from '../../components/DoubleLogo';
import { useCurrency } from '../../hooks/Tokens';
import { useWalletModalToggle } from '../../state/application/hooks';
import { Fonts } from '../../theme';

import CurrencyLogo from '../../components/CurrencyLogo';
import { RowBetween } from '../../components/Row';
import { CardSection, DataCard, CardNoise } from '../../components/earn/styled';
import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import StakingModal from '../../components/earn/StakingModal';
import { StakingInfo, useStakingInfo } from '../../state/stake/hooks';
import UnstakingModal from '../../components/earn/UnstakingModal';
import ClaimRewardModal from '../../components/earn/ClaimRewardModal';
import { useTokenBalance } from '../../state/wallet/hooks';
import { useActiveWeb3React } from '../../hooks';
import { useColor } from '../../hooks/useColor';
import { CountUp } from 'use-count-up';

import { wrappedCurrency } from '../../utils/wrappedCurrency';
import { currencyId } from '../../utils/currencyId';
import { useTotalSupply } from '../../data/TotalSupply';
import { usePair } from '../../data/Reserves';
import usePrevious from '../../hooks/usePrevious';
import useUSDCPrice from '../../utils/useUSDCPrice';
import { BIG_INT_ZERO, BIG_INT_SECONDS_IN_WEEK } from '../../constants';
import usePoolAPR from 'hooks/usePoolAPR';

const PageWrapper = styled(AutoColumn)`
  position: relative;
  max-width: 550px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 90%;
    max-width: 400px;
  `}
`;

const PositionInfo = styled(AutoColumn)<{ dim: any }>`
  position: relative;
  max-width: 640px;
  width: 100%;
  opacity: ${({ dim }) => (dim ? 0.6 : 1)};
`;

const BottomSection = styled(AutoColumn)`
  border-radius: 12px;
  width: 100%;
  position: relative;
`;

const StyledDataCard = styled(DataCard)<{ bgColor?: any; showBackground?: any }>`
  background-color: ${({ theme }) => theme.blue2};
  z-index: 2;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledBottomCard = styled(DataCard)<{ dim: any }>`
  background: ${({ theme }) => theme.bg3};
  opacity: ${({ dim }) => (dim ? 0.4 : 1)};
  margin-top: -40px;
  padding: 0 1.25rem 1rem 1.25rem;
  padding-top: 32px;
  z-index: 1;
`;

const PoolData = styled(DataCard)`
  background-color: ${({ theme }) => theme.blue2};
  border: 1px solid ${({ theme }) => theme.bg4};
  padding: 1rem;
  z-index: 1;
`;

const VoteCard = styled(DataCard)`
  background-color: ${({ theme }) => theme.blue2};
  overflow: hidden;
`;

const DataRow = styled(RowBetween)`
  justify-content: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    gap: 12px;
  `};
`;

export default function Manage({
  match: {
    params: { currencyIdA, currencyIdB },
  },
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const { account, chainId } = useActiveWeb3React();

  // get currencies and pair
  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);
  const tokenA = useMemo(() => wrappedCurrency(currencyA ?? undefined, chainId), [currencyA, chainId]);
  const tokenB = useMemo(() => wrappedCurrency(currencyB ?? undefined, chainId), [currencyB, chainId]);

  const [, stakingTokenPair] = usePair(tokenA, tokenB);
  const stakingInfos = useStakingInfo(stakingTokenPair);
  const [stakingInfo, setStakingInfo] = useState<StakingInfo>();
  useEffect(() => {
    setStakingInfo(stakingInfos?.[0]);
  }, [stakingInfos]);

  // detect existing unstaked LP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token);
  const showAddLiquidityButton = useMemo(
    () => Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0')),
    [stakingInfo, userLiquidityUnstaked]
  );

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [showUnstakingModal, setShowUnstakingModal] = useState(false);
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false);

  // fade cards if nothing staked or nothing earned yet
  const disableTop = useMemo(() => {
    return !stakingInfo?.stakedAmount || stakingInfo.stakedAmount.equalTo(JSBI.BigInt(0));
  }, [stakingInfo]);

  const token = useMemo(() => (currencyA === ETHER ? tokenB : tokenA), [currencyA, tokenA, tokenB]);
  const WETH = useMemo(() => (currencyA === ETHER ? tokenA : tokenB), [currencyA, tokenA, tokenB]);
  const backgroundColor = useColor(token);

  // get WETH value of staked LP tokens
  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo?.stakedAmount?.token);
  let [valueOfTotalStakedAmountInWETH, setValueOfTotalStakedAmountInWETH] = useState<TokenAmount | undefined>();
  useEffect(() => {
    if (totalSupplyOfStakingToken && !disableTop && stakingTokenPair && stakingInfo && WETH) {
      // take the total amount of LP tokens staked, multiply by ETH value of all LP tokens, divide by all LP tokens
      setValueOfTotalStakedAmountInWETH(
        new TokenAmount(
          WETH,
          JSBI.divide(
            JSBI.multiply(
              JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
              JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
            ),
            totalSupplyOfStakingToken.raw
          )
        )
      );
    }
  }, [totalSupplyOfStakingToken, disableTop, stakingInfo, stakingTokenPair, WETH]);

  const [countUpAmount, setCountUpAmount] = useState('0');
  useEffect(() => {
    const interval = setInterval(() => {
      if (stakingInfo && totalSupplyOfStakingToken) {
        setCountUpAmount(
          new TokenAmount(
            stakingInfo.stakedAmount.token,
            // Add the amount of token user has earned since last claim to the amount of token since last block reward
            JSBI.add(
              stakingInfo.earnedAmount.raw,
              JSBI.divide(
                // Multiply the reward rate by the time since the last reward was paid
                JSBI.multiply(
                  stakingInfo.rewardRate.raw,
                  JSBI.BigInt(Math.round(new Date().getTime() - (stakingInfo.lastTimeRewardApplicable?.getTime() ?? 0)))
                ),
                // Convert it from milliseconds to seconds
                JSBI.BigInt(1000)
              )
            )
          ).toFixed(6)
        );
      }
      return undefined;
    }, 100);
    return () => clearInterval(interval);
  }, [stakingInfo, totalSupplyOfStakingToken]);
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0';

  const poolAPR = usePoolAPR(tokenA, tokenB);

  // Get the count of each tokens in LP
  const tokensCount = useMemo(() => {
    if (stakingTokenPair && stakingInfo && totalSupplyOfStakingToken) {
      return [
        stakingTokenPair
          .getLiquidityValue(stakingTokenPair.token0, totalSupplyOfStakingToken, stakingInfo.stakedAmount, false)
          .toFixed(0, { groupSeparator: ',' }),
        stakingTokenPair
          .getLiquidityValue(stakingTokenPair.token1, totalSupplyOfStakingToken, stakingInfo.stakedAmount, false)
          .toFixed(0, { groupSeparator: ',' }),
      ];
    }
    return ['-', '-'];
  }, [stakingInfo, stakingTokenPair, totalSupplyOfStakingToken]);

  // get the USD value of staked WETH
  const USDPrice = useUSDCPrice(WETH);
  const valueOfTotalStakedAmountInUSDC = useMemo(
    () =>
      valueOfTotalStakedAmountInWETH &&
      USDPrice &&
      USDPrice.greaterThan('0') &&
      USDPrice.quote(valueOfTotalStakedAmountInWETH),
    [USDPrice, valueOfTotalStakedAmountInWETH]
  );

  const toggleWalletModal = useWalletModalToggle();

  const handleDepositClick = useCallback(() => {
    if (account) {
      setShowStakingModal(true);
    } else {
      toggleWalletModal();
    }
  }, [account, toggleWalletModal]);
  return (
    <PageWrapper gap="lg" justify="center">
      <RowBetween style={{ gap: '24px' }}>
        <Fonts.mediumHeader style={{ margin: 0 }}>
          {currencyA?.symbol}-{currencyB?.symbol} Liquidity Staking
        </Fonts.mediumHeader>
        <DoubleCurrencyLogo currency0={currencyA ?? undefined} currency1={currencyB ?? undefined} size={24} />
      </RowBetween>

      <DataRow style={{ gap: '24px' }}>
        <PoolData>
          <AutoColumn gap="sm">
            <Fonts.body style={{ margin: 0 }}>Total deposits</Fonts.body>
            <Fonts.body fontSize={24} fontWeight={500}>
              {valueOfTotalStakedAmountInUSDC
                ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
                : `${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} HYP`}
            </Fonts.body>
          </AutoColumn>
        </PoolData>
        <PoolData>
          <AutoColumn gap="sm">
            <Fonts.body style={{ margin: 0 }}>Pool Rate</Fonts.body>
            <Fonts.body fontSize={24} fontWeight={500}>
              {stakingInfo?.active
                ? stakingInfo?.totalRewardRate
                    ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                    ?.toFixed(0, { groupSeparator: ',' }) ?? '-'
                : '0'}
              {' / week'}
            </Fonts.body>
          </AutoColumn>
        </PoolData>
      </DataRow>

      {showAddLiquidityButton && (
        <VoteCard>
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <Fonts.white fontWeight={600}>Step 1. Get liquidity tokens</Fonts.white>
              </RowBetween>
              <RowBetween style={{ marginBottom: '1rem' }}>
                <Fonts.white fontSize={14}>
                  {`${currencyA?.symbol}-${currencyB?.symbol} LP tokens are required. Once you've added liquidity to the ${currencyA?.symbol}-${currencyB?.symbol} pool you can stake your liquidity tokens on this page.`}
                </Fonts.white>
              </RowBetween>
              <ButtonPrimary
                padding="8px"
                borderRadius="8px"
                width={'fit-content'}
                as={Link}
                to={`/add/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`}
              >
                {`Add ${currencyA?.symbol}-${currencyB?.symbol} liquidity`}
              </ButtonPrimary>
            </AutoColumn>
          </CardSection>
          <CardNoise />
        </VoteCard>
      )}

      {stakingInfo && (
        <>
          <StakingModal
            isOpen={showStakingModal}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo}
            userLiquidityUnstaked={userLiquidityUnstaked}
          />
          <UnstakingModal
            isOpen={showUnstakingModal}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo}
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo}
          />
        </>
      )}

      <PositionInfo gap="lg" justify="center" dim={showAddLiquidityButton}>
        <BottomSection gap="lg" justify="center">
          <StyledDataCard disabled={disableTop} bgColor={backgroundColor} showBackground={!showAddLiquidityButton}>
            <CardSection>
              <CardNoise />
              <AutoColumn gap="md">
                <RowBetween>
                  <Fonts.white fontWeight={600}>Your liquidity deposits</Fonts.white>
                </RowBetween>
                <RowBetween style={{ alignItems: 'top' }}>
                  <Fonts.white fontSize={36} fontWeight={600}>
                    {stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'}
                  </Fonts.white>
                  <AutoColumn style={{ gap: '3px' }}>
                    <Fonts.white fontSize={15}>
                      LP: {currencyA?.symbol}-{currencyB?.symbol}
                    </Fonts.white>
                    <RowBetween style={{ justifyContent: 'end', gap: '5px' }}>
                      <Fonts.white fontSize={15}>{tokensCount[0]}</Fonts.white>
                      <CurrencyLogo currency={currencyA ?? undefined} size={'24px'} />
                    </RowBetween>
                    <RowBetween style={{ justifyContent: 'end', gap: '5px' }}>
                      <Fonts.white fontSize={15}>{tokensCount[1]}</Fonts.white>{' '}
                      <CurrencyLogo currency={currencyB ?? undefined} size={'24px'} />
                    </RowBetween>
                  </AutoColumn>
                </RowBetween>
              </AutoColumn>
            </CardSection>
          </StyledDataCard>
          <StyledBottomCard dim={stakingInfo?.stakedAmount?.equalTo(JSBI.BigInt(0))}>
            <CardNoise />
            <AutoColumn gap="sm">
              <RowBetween>
                <div>
                  <Fonts.black>Your unclaimed {stakingInfo?.rewardToken.symbol}</Fonts.black>
                </div>
                {stakingInfo?.earnedAmount && JSBI.notEqual(BIG_INT_ZERO, stakingInfo?.earnedAmount?.raw) && (
                  <ButtonSecondary
                    padding="8px"
                    borderRadius="8px"
                    width="fit-content"
                    onClick={() => setShowClaimRewardModal(true)}
                  >
                    Claim
                  </ButtonSecondary>
                )}
              </RowBetween>
              <RowBetween style={{ alignItems: 'baseline' }}>
                <Fonts.largeHeader fontSize={36} fontWeight={600}>
                  <CountUp
                    key={countUpAmount}
                    isCounting
                    decimalPlaces={4}
                    start={parseFloat(countUpAmountPrevious)}
                    end={parseFloat(countUpAmount)}
                    thousandsSeparator={','}
                    duration={1}
                  />
                </Fonts.largeHeader>
              </RowBetween>
              <RowBetween style={{ alignItems: 'baseline' }}>
                <Fonts.black fontSize={16} fontWeight={500}>
                  <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px ' }}>
                    ⚡
                  </span>
                  {stakingInfo?.active
                    ? stakingInfo?.rewardRate
                        ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                        ?.toSignificant(4, { groupSeparator: ',' }) ?? '-'
                    : '0'}
                  {` ${stakingInfo?.rewardToken.symbol} / week`}
                </Fonts.black>
                <Fonts.black fontSize={16} fontWeight={500}>
                  {poolAPR}% APR
                  <span role="img" aria-label="rocket-icon" style={{ marginLeft: '8px ' }}>
                    🚀
                  </span>
                </Fonts.black>
              </RowBetween>
            </AutoColumn>
          </StyledBottomCard>
        </BottomSection>
        <Fonts.main style={{ textAlign: 'center' }} fontSize={14}>
          <span role="img" aria-label="star-icon" style={{ marginRight: '8px' }}>
            ⭐️
          </span>
          When you withdraw, the contract will automagically claim {stakingInfo?.rewardToken.symbol} on your behalf!
        </Fonts.main>

        {!showAddLiquidityButton && (
          <DataRow style={{ marginBottom: '1rem' }}>
            {stakingInfo && stakingInfo.active && (
              <ButtonPrimary padding="8px" borderRadius="8px" width="160px" onClick={handleDepositClick}>
                {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) ? 'Deposit' : 'Deposit LP'}
              </ButtonPrimary>
            )}

            {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) && (
              <>
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  width="160px"
                  onClick={() => setShowUnstakingModal(true)}
                >
                  Withdraw
                </ButtonPrimary>
              </>
            )}
          </DataRow>
        )}
        {!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : !stakingInfo?.active ? null : (
          <Fonts.main>
            {userLiquidityUnstaked.toSignificant(6)} {currencyA?.symbol}-{currencyB?.symbol} LP tokens available
          </Fonts.main>
        )}
      </PositionInfo>
    </PageWrapper>
  );
}
