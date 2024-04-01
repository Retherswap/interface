import React, { useMemo } from 'react';
import { useNativeToken } from 'hooks/useNativeToken';
import { Fonts } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import Row, { RowBetween } from 'components/Row';
import styled from 'styled-components';
import { transparentize } from 'polished';
import { HideUltraSmall } from 'components/Hide/hide-ultra-small';
import { Balance } from 'models/schema';
import Skeleton from 'react-loading-skeleton';
import NoStyleLink from 'components/Link/no-style-link';
import Gift from '../../../assets/images/gift.png';

const TokenBalancePriceContainer = styled(NoStyleLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 10px;
  width: 100%;
  text-wrap: nowrap;
  padding: 1em;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => transparentize(0.1, theme.bg2)};
  }
`;

export default function TokenBalanceRewardCard({ balance }: { balance?: Balance }) {
  const { nativeToken } = useNativeToken();
  const reward = useMemo(() => {
    if (balance && balance.token.rewards) {
      let rewards = 0;
      for (const reward of balance.token.rewards) {
        rewards += Number(reward.reward);
      }
      return rewards;
    }
    return undefined;
  }, [balance]);
  const rewardUsd = useMemo(() => {
    if (!reward || !balance || !nativeToken) {
      return 0;
    }
    return reward * (Number(balance?.token.nativeQuote) * Number(nativeToken?.usdPrice));
  }, [reward, balance, nativeToken]);
  return (
    <TokenBalancePriceContainer to={`/balance/${balance?.token.address.address}/profit`}>
      <RowBetween style={{ width: '100%' }}>
        <Row style={{ gap: '5px' }}>
          <HideUltraSmall style={{ height: '25px' }}>
            <img src={Gift} alt="cash" style={{ width: '20px', height: '20px' }}></img>
          </HideUltraSmall>
          {balance && rewardUsd ? (
            <>
              <Fonts.black fontWeight={800} fontSize={15}>
                Rewards:
              </Fonts.black>
              <Fonts.green fontSize={14}>$ {formatNumber(rewardUsd, { reduce: false })}</Fonts.green>
            </>
          ) : (
            <Skeleton width="200px"></Skeleton>
          )}
        </Row>
        <Row style={{ width: '100%', justifyContent: 'end' }}>
          <Fonts.black fontSize={14}>
            {balance && rewardUsd ? (
              formatNumber(reward) + ' ' + balance.token.symbol
            ) : (
              <Skeleton width="200px"></Skeleton>
            )}
          </Fonts.black>
        </Row>
      </RowBetween>
    </TokenBalancePriceContainer>
  );
}
