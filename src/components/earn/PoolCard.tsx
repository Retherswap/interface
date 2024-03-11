import React from 'react';
import { AutoColumn } from '../Column';
import { RowBetween } from '../Row';
import styled from 'styled-components';
import { Fonts, StyledInternalLink } from '../../theme';
import DoubleCurrencyLogo from '../DoubleLogo';
import { ETHER, JSBI, TokenAmount } from '@retherswap/sdk';
import { ButtonPrimary } from '../Button';
import { StakingInfo } from '../../state/stake/hooks';
import { useColor } from '../../hooks/useColor';
import { currencyId } from '../../utils/currencyId';
import { Break, CardNoise } from './styled';
import { unwrappedToken } from '../../utils/wrappedCurrency';
import { useTotalSupply } from '../../data/TotalSupply';
import { usePair } from '../../data/Reserves';
import useUSDCPrice from '../../utils/useUSDCPrice';
import { BIG_INT_SECONDS_IN_WEEK } from '../../constants';
import usePoolAPR from 'hooks/usePoolAPR';

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: none;
`};
`;

const Wrapper = styled(AutoColumn)<{ showBackground: boolean; bgColor: any }>`
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  position: relative;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '1')};
  background-color: ${({ theme }) => theme.blue1};
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  grid-gap: 0px;
  align-items: center;
  padding: 1rem;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 48px 1fr 96px;
  `};
`;

const BottomSection = styled.div<{ showBackground: boolean }>`
  padding: 12px 16px;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '0.4')};
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  z-index: 1;
`;

export default function PoolCard({ stakingInfo }: { stakingInfo: StakingInfo }) {
  console.log('PoolCard', stakingInfo);
  const token0 = stakingInfo.tokens[0];
  const token1 = stakingInfo.tokens[1];

  const currency0 = unwrappedToken(token0);
  const currency1 = unwrappedToken(token1);
  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'));

  // get the color of the token
  const token = currency0 === ETHER ? token1 : token0;
  const WETH = currency0 === ETHER ? token0 : token1;
  const backgroundColor = useColor(token);

  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo.stakedAmount.token);
  const [, stakingTokenPair] = usePair(...stakingInfo.tokens);

  // let returnOverMonth: Percent = new Percent('0')
  let valueOfTotalStakedAmountInWETH: TokenAmount | undefined;
  if (totalSupplyOfStakingToken?.greaterThan(JSBI.BigInt(0)) && isStaking && stakingTokenPair) {
    // take the total amount of LP tokens staked, multiply by ETH value of all LP tokens, divide by all LP tokens
    valueOfTotalStakedAmountInWETH = new TokenAmount(
      WETH,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    );
  }
  const poolAPR = usePoolAPR(token0, token1);

  // get the USD value of staked WETH
  const USDPrice = useUSDCPrice(WETH);
  const valueOfTotalStakedAmountInUSDC =
    valueOfTotalStakedAmountInWETH &&
    USDPrice &&
    USDPrice.greaterThan('0') &&
    USDPrice.quote(valueOfTotalStakedAmountInWETH);

  return (
    <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
      <CardNoise />

      <TopSection>
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
        <Fonts.white fontWeight={600} fontSize={24} style={{ marginLeft: '10px' }}>
          {currency0.symbol}-{currency1.symbol}
        </Fonts.white>

        <StyledInternalLink to={`/farm/${currencyId(currency0)}/${currencyId(currency1)}`} style={{ width: '100%' }}>
          <ButtonPrimary padding="8px" borderRadius="8px">
            {isStaking ? 'Manage' : 'Deposit'}
          </ButtonPrimary>
        </StyledInternalLink>
      </TopSection>

      <StatContainer>
        <RowBetween>
          <Fonts.white> Total deposited</Fonts.white>
          <Fonts.white>
            {valueOfTotalStakedAmountInUSDC
              ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
              : `${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? '-'} HYP`}
          </Fonts.white>
        </RowBetween>
        <RowBetween>
          <Fonts.white> Pool rate </Fonts.white>
          <Fonts.white>
            {stakingInfo
              ? stakingInfo.active
                ? `${stakingInfo.totalRewardRate
                    ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                    ?.toFixed(0, { groupSeparator: ',' })} / week`
                : '0 / week'
              : '-'}
          </Fonts.white>
        </RowBetween>
      </StatContainer>

      <Break />
      <BottomSection showBackground={true}>
        <AutoColumn style={{ width: '100%' }}>
          <RowBetween style={{ width: '100%', justifyContent: 'space-between' }}>
            <Fonts.black color={'white'} fontWeight={500}>
              <span>APR</span>
            </Fonts.black>

            <Fonts.black style={{ textAlign: 'right' }} color={'white'} fontWeight={500}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                🚀
              </span>
              {poolAPR}%
            </Fonts.black>
          </RowBetween>
          {isStaking && (
            <>
              <RowBetween style={{ width: '100%', justifyContent: 'space-between' }}>
                <Fonts.black color={'white'} fontWeight={500}>
                  <span>Your rate</span>
                </Fonts.black>

                <Fonts.black style={{ textAlign: 'right' }} color={'white'} fontWeight={500}>
                  <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                    ⚡
                  </span>
                  {stakingInfo
                    ? stakingInfo.active
                      ? `${stakingInfo.rewardRate
                          ?.multiply(BIG_INT_SECONDS_IN_WEEK)
                          ?.toSignificant(4, { groupSeparator: ',' })} ${stakingInfo.rewardToken.symbol} / week`
                      : `0 ${stakingInfo.rewardToken.symbol} / week`
                    : '-'}
                </Fonts.black>
              </RowBetween>
            </>
          )}
        </AutoColumn>
      </BottomSection>
    </Wrapper>
  );
}
