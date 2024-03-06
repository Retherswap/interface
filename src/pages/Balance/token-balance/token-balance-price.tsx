import React, { useEffect, useState } from 'react';
import Column from 'components/Column';
import { useNativeToken } from 'hooks/useNativeToken';
import { Fonts, HideExtraSmall } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import AccountBalanceChart from '../account-balance/account-balance-chart';
import Row from 'components/Row';
import styled from 'styled-components';
import { ArrowDown, ArrowUp, Download, Repeat, Shuffle } from 'react-feather';
import { transparentize } from 'polished';
import useTheme from 'hooks/useTheme';
import CurrencyLogo from 'components/CurrencyLogo';
import { useDefaultTokens } from 'hooks/Tokens';
import { HideUltraSmall } from 'components/Hide/hide-ultra-small';
import { ShowUltraSmall } from 'components/Hide/show-ultra-small';
import AverageChartIcon from '../../../assets/svg/average-chart-icon.svg';
import AverageChartIconWhite from '../../../assets/svg/average-chart-icon-white.svg';
import { Balance, TokenPrice } from 'models/schema';
import { useIsDarkMode } from 'state/user/hooks';
import Skeleton from 'react-loading-skeleton';
import { apiUrl } from 'configs/server';

const TokenBalancePriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 10px;
  width: 100%;
  text-wrap: nowrap;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;
  justify-content: space-between;
`;

const AveragePriceContainer = styled.div`
  align-items: center;
  display: flex;
  padding: 1em;
  justify-content: space-between;
`;

const PriceChangeContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Border = styled.div`
  border: 1px solid ${({ theme }) => transparentize(0.5, theme.text4)};
  width: 100%;
`;

export default function TokenBalancePrice({ balance }: { balance?: Balance }) {
  const { nativeToken } = useNativeToken();
  const [price, setPrice] = useState<TokenPrice | undefined>(undefined);
  useEffect(() => {
    if (!balance?.token.address) return;
    const fetchInfo = () => {
      return fetch(
        `${apiUrl}/tokens/${balance.token.address}/price_at/${new Date(
          new Date().getTime() - 1000 * 60 * 60 * 24
        ).toISOString()}`
      )
        .then((res) => res.json())
        .then((d) => setPrice(d))
        .catch((e) => {
          console.error(e);
        });
    };
    fetchInfo();
  }, [balance?.token.address]);
  const tokenPrice = Number(balance?.token?.nativeQuote ?? 0) * Number(nativeToken?.usdPrice ?? 0);
  const change = price ? (tokenPrice / Number(price?.closeUsd ?? 0)) * 100 - 100 : undefined;
  const avgChange = (tokenPrice / Number(balance?.averagePrice?.usdQuote ?? 0)) * 100 - 100;
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const defaultTokens = useDefaultTokens();
  return (
    <TokenBalancePriceContainer>
      <>
        <PriceContainer>
          <Row style={{ gap: '5px' }}>
            <HideUltraSmall style={{ height: '25px' }}>
              <CurrencyLogo currency={defaultTokens[balance?.token.address ?? '']} size="25px"></CurrencyLogo>
            </HideUltraSmall>
            {balance ? (
              <>
                <Fonts.black fontWeight={800} fontSize={15}>
                  <Row style={{ gap: '3px' }}>
                    <HideUltraSmall>{balance.token.symbol}</HideUltraSmall> Price:
                  </Row>
                </Fonts.black>
                <Fonts.black fontSize={14}>$ {formatNumber(tokenPrice, { reduce: false })}</Fonts.black>
              </>
            ) : (
              <Skeleton width="200px"></Skeleton>
            )}
          </Row>
          {balance && change !== undefined ? (
            <PriceChangeContainer>
              {change > 0 ? (
                <>
                  <ArrowUp color={theme.green1} size={13} strokeWidth={3}></ArrowUp>
                  <Fonts.green fontSize={13} fontWeight={600}>
                    {formatNumber(change)}%
                  </Fonts.green>
                </>
              ) : (
                <>
                  <ArrowDown color={theme.red1} size={13} strokeWidth={3}></ArrowDown>
                  <Fonts.red fontSize={13} fontWeight={600}>
                    {formatNumber(Math.abs(change))}%
                  </Fonts.red>
                </>
              )}
            </PriceChangeContainer>
          ) : (
            <Skeleton width="50px"></Skeleton>
          )}
        </PriceContainer>
        <Border></Border>
        <AveragePriceContainer>
          <Row style={{ gap: '5px' }}>
            <HideUltraSmall style={{ height: '25px' }}>
              <img
                src={isDarkMode ? AverageChartIconWhite : AverageChartIcon}
                style={{ width: '25px', height: '25px' }}
              ></img>
            </HideUltraSmall>
            {balance ? (
              <>
                <Fonts.black fontWeight={800} fontSize={15}>
                  <Row style={{ gap: '3px' }}>
                    <ShowUltraSmall>Avg</ShowUltraSmall>
                    <HideUltraSmall>Average buy</HideUltraSmall> price:
                  </Row>
                </Fonts.black>
                <Fonts.black fontSize={14}>
                  $ {formatNumber(balance?.averagePrice?.usdQuote, { reduce: false })}
                </Fonts.black>
              </>
            ) : (
              <Skeleton width="200px"></Skeleton>
            )}
          </Row>
          {balance ? (
            <PriceChangeContainer>
              {avgChange > 0 ? (
                <>
                  <ArrowUp color={theme.green1} size={13} strokeWidth={3}></ArrowUp>
                  <Fonts.green fontSize={13} fontWeight={600}>
                    {formatNumber(avgChange)}%
                  </Fonts.green>
                </>
              ) : (
                <>
                  <ArrowDown color={theme.red1} size={13} strokeWidth={3}></ArrowDown>
                  <Fonts.red fontSize={13} fontWeight={600}>
                    {formatNumber(Math.abs(avgChange))}%
                  </Fonts.red>
                </>
              )}
            </PriceChangeContainer>
          ) : (
            <Skeleton width="50px"></Skeleton>
          )}
        </AveragePriceContainer>
      </>
    </TokenBalancePriceContainer>
  );
}
