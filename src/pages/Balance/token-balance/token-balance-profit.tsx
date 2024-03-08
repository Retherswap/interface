import React, { useMemo, useState } from 'react';
import { useNativeToken } from 'hooks/useNativeToken';
import { Fonts } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import Row from 'components/Row';
import styled from 'styled-components';
import { Balance, BalanceChange, TokenPrice } from 'models/schema';
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

export default function TokenBalanceProfit({ balance }: { balance?: Balance }) {
  const { nativeToken } = useNativeToken();
  const [price24h, setPrice24h] = useState<TokenPrice | undefined>(undefined);
  useMemo(() => {
    if (balance?.token.price) {
      let lastPrice: TokenPrice | undefined = undefined;
      for (const price of balance.token.price) {
        if (new Date(price.date).getTime() > Date.now() - 1000 * 60 * 60 * 24) {
          if (!lastPrice || new Date(lastPrice.date).getTime() > new Date(price.date).getTime()) {
            lastPrice = price;
          }
        }
      }
      setPrice24h(lastPrice);
    }
  }, [balance]);
  const [balance24h, setBalance24h] = useState<BalanceChange | undefined>(undefined);
  useMemo(() => {
    if (balance?.balanceChanges) {
      let lastChange: BalanceChange | undefined = undefined;
      for (const change of balance.balanceChanges) {
        if (new Date(change.date).getTime() > Date.now() - 1000 * 60 * 60 * 24) {
          if (!lastChange || new Date(lastChange.date).getTime() > new Date(change.date).getTime()) {
            lastChange = change;
          }
        }
      }
      setBalance24h(lastChange);
    }
  }, [balance]);
  const [change24h, setChange24h] = useState<number | undefined>(undefined);
  useMemo(() => {
    if (price24h) {
      setChange24h(
        Number(balance?.token.nativeQuote) * Number(nativeToken?.usdPrice) * Number(balance?.balance) -
          Number(price24h?.closeUsd) * Number(balance24h?.amount ?? balance?.balance)
      );
    }
  }, [balance24h, price24h, balance, nativeToken]);
  const [profit, setProfit] = useState<number | undefined>(undefined);
  useMemo(() => {
    if (balance) {
      const averageUsdCost = Number(balance?.balance) * Number(balance.averagePrice?.usdQuote);
      const usdBalance = Number(balance?.balance) * Number(balance?.token.nativeQuote) * Number(nativeToken?.usdPrice);
      const profit = Number(balance?.profit?.usdAmount ?? 0) - Number(balance?.spent?.usdAmount ?? 0);
      setProfit(profit + (usdBalance - averageUsdCost));
    }
  }, [balance, nativeToken]);
  return (
    <TokenBalancePriceContainer>
      <>
        <Row style={{ gap: '5px' }}>
          <HideUltraSmall style={{ height: '25px' }}>
            <img src={Cash} alt="cash" style={{ width: '25px', height: '25px' }}></img>{' '}
          </HideUltraSmall>
          {balance && profit ? (
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
        {balance && change24h !== undefined ? (
          change24h > 0 ? (
            <Fonts.green fontSize={13} fontWeight={600} width="100%" textAlign="end">
              {formatNumber(change24h)} $ (24h)
            </Fonts.green>
          ) : (
            <Fonts.red fontSize={13} fontWeight={600} width="100%" textAlign="end">
              {formatNumber(change24h)} $ (24h)
            </Fonts.red>
          )
        ) : (
          <Skeleton width="50px"></Skeleton>
        )}
      </>
    </TokenBalancePriceContainer>
  );
}
