import React from 'react';
import Column from 'components/Column';
import { useNativeToken } from 'hooks/useNativeToken';
import { Fonts } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import AccountBalanceChart from '../account-balance/account-balance-chart';
import Row from 'components/Row';
import styled from 'styled-components';
import { ArrowDown, Download, Repeat, Shuffle } from 'react-feather';
import { transparentize } from 'polished';
import useTheme from 'hooks/useTheme';
import CurrencyLogo from 'components/CurrencyLogo';
import { useDefaultTokens } from 'hooks/Tokens';
import { Balance, BalanceChange, TokenPrice } from 'models/schema';
import TokenBalanceChart from './token-balance-chart';
import NoStyleLink from 'components/Link/no-style-link';
import Skeleton from 'react-loading-skeleton';
import { HideUltraSmall } from 'components/Hide/hide-ultra-small';
import Cash from '../../../assets/images/cash.png';

const TokenBalancePriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 10px;
  width: 100%;
  text-wrap: nowrap;
  padding: 1em;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;
  justify-content: space-between;
`;

export default function TokenBalanceProfit({ balance }: { balance?: Balance }) {
  const { nativeToken } = useNativeToken();
  let price24h: TokenPrice | undefined = undefined;
  if (balance?.token.price) {
    for (const price of balance.token.price) {
      if (new Date(price.date).getTime() > Date.now() - 1000 * 60 * 60 * 24) {
        if (!price24h || new Date(price24h.date).getTime() > new Date(price.date).getTime()) {
          price24h = price;
        }
      }
    }
  }
  let balance24h: BalanceChange | undefined = undefined;
  if (balance?.balanceChanges) {
    for (const change of balance.balanceChanges) {
      if (new Date(change.date).getTime() > Date.now() - 1000 * 60 * 60 * 24) {
        if (!balance24h || new Date(balance24h.date).getTime() > new Date(change.date).getTime()) {
          balance24h = change;
        }
      }
    }
  }
  const profit =
    Number(balance?.profit?.usdAmount ?? 0) -
    Number(balance?.spent?.usdAmount ?? 0) +
    Number(balance?.balance) * Number(balance?.token.nativeQuote) * Number(nativeToken?.usdPrice);
  return (
    <TokenBalancePriceContainer>
      <>
        <Row style={{ gap: '5px' }}>
          <HideUltraSmall style={{ height: '25px' }}>
            <img src={Cash} style={{ width: '25px', height: '25px' }}></img>{' '}
          </HideUltraSmall>
          {balance ? (
            <>
              <Fonts.black fontWeight={800} fontSize={15}>
                {profit < 0 ? 'Loss' : 'Profits'}:
              </Fonts.black>
              {profit < 0 ? (
                <Fonts.red fontSize={14} fontWeight={600}>
                  {formatNumber(Math.abs(profit), { reduce: false })} ${' '}
                </Fonts.red>
              ) : (
                <Fonts.green fontSize={14}>$ {formatNumber(profit, { reduce: false })}</Fonts.green>
              )}
            </>
          ) : (
            <Skeleton width="200px"></Skeleton>
          )}
        </Row>
        {balance ? (
          <Fonts.green fontSize={13} fontWeight={600} width="100%" textAlign="end">
            + ${' '}
            {formatNumber(
              Number(balance.token.nativeQuote) * Number(nativeToken?.usdPrice) * Number(balance24h?.amount) -
                Number(price24h?.closeUsd) * Number(balance.balance)
            )}{' '}
            (24h)
          </Fonts.green>
        ) : (
          <Skeleton width="50px"></Skeleton>
        )}
      </>
    </TokenBalancePriceContainer>
  );
}
