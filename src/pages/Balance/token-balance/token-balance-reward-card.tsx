import React, { useMemo } from 'react';
import { useNativeToken } from 'hooks/useNativeToken';
import { Fonts } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import Row, { RowBetween } from 'components/Row';
import styled from 'styled-components';
import { HideUltraSmall } from 'components/Hide/hide-ultra-small';
import { Balance } from 'models/schema';
import Skeleton from 'react-loading-skeleton';
import Gift from '../../../assets/images/gift.png';

const TokenBalanceRewardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 10px;
  width: 100%;
  text-wrap: nowrap;
  padding: 1em;
`;

export default function TokenBalanceRewardCard({ balance }: { balance?: Balance }) {
  const { nativeToken } = useNativeToken();
  const tokenReward = useMemo(() => {
    if (balance && balance.token.rewards) {
      let rewards = 0;
      for (const reward of balance.token.rewards) {
        if (reward.idRewardToken === balance.token.id) {
          rewards += Number(reward.reward);
        }
      }
      return rewards;
    }
    return undefined;
  }, [balance]);
  const tokenRewardUsd = useMemo(() => {
    if (!tokenReward || !balance || !nativeToken) {
      return 0;
    }
    return tokenReward * (Number(balance.token.nativeQuote) * Number(nativeToken.usdPrice));
  }, [balance, tokenReward, nativeToken]);
  const rewardUsd = useMemo(() => {
    if (!balance || !nativeToken || !balance.token.rewards) {
      return 0;
    }
    let rewards = 0;
    for (const reward of balance.token.rewards) {
      if (reward.idRewardToken !== balance.token.id) {
        rewards += Number(reward.reward) * (Number(reward.rewardToken.nativeQuote) * Number(nativeToken?.usdPrice));
      }
    }
    return rewards;
  }, [balance, nativeToken]);
  return (
    <TokenBalanceRewardContainer>
      <RowBetween style={{ width: '100%' }}>
        <Row style={{ gap: '5px' }}>
          <HideUltraSmall style={{ height: '25px' }}>
            <img src={Gift} alt="cash" style={{ width: '20px', height: '20px' }}></img>
          </HideUltraSmall>
          {balance && tokenRewardUsd ? (
            <>
              <Fonts.black fontWeight={800} fontSize={15}>
                Rewards:
              </Fonts.black>
              <Fonts.green fontSize={14}>$ {formatNumber(tokenRewardUsd, { reduce: false })}</Fonts.green>
            </>
          ) : (
            <Skeleton width="200px"></Skeleton>
          )}
        </Row>
        <Row style={{ width: '100%', justifyContent: 'end' }}>
          <Fonts.black fontSize={14}>
            {balance && tokenReward ? (
              formatNumber(tokenReward) +
              ' ' +
              balance.token.symbol +
              (rewardUsd - tokenRewardUsd > 0 ? ' + $' + formatNumber(rewardUsd - tokenRewardUsd) : '')
            ) : (
              <Skeleton width="200px"></Skeleton>
            )}
          </Fonts.black>
        </Row>
      </RowBetween>
    </TokenBalanceRewardContainer>
  );
}
