import React, { useEffect, useMemo, useState } from 'react';
import { useNativeToken } from 'hooks/useNativeToken';
import { Fonts } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import Row from 'components/Row';
import styled from 'styled-components';
import { ArrowDown, ArrowUp } from 'react-feather';
import { transparentize } from 'polished';
import useTheme from 'hooks/useTheme';
import CurrencyLogo from 'components/CurrencyLogo';
import { HideUltraSmall } from 'components/Hide/hide-ultra-small';
import { ShowUltraSmall } from 'components/Hide/show-ultra-small';
import AverageChartIcon from '../../../assets/svg/average-chart-icon.svg';
import AverageChartIconWhite from '../../../assets/svg/average-chart-icon-white.svg';
import { Balance, TokenPrice } from 'models/schema';
import { useIsDarkMode } from 'state/user/hooks';
import Skeleton from 'react-loading-skeleton';
import { apiUrl } from 'configs/server';
import { useTokenSymbol } from 'hooks/useTokenSymbol';
import { useCurrency } from 'hooks/useCurrency';
import DoubleCurrencyLogo from 'components/DoubleLogo';
import NoStyleLink from 'components/Link/no-style-link';

const TokenBalancePriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 10px;
  width: 100%;
  text-wrap: nowrap;
  overflow: hidden;
`;

const PriceContainer = styled(NoStyleLink)`
  display: flex;
  align-items: center;
  padding: 1em;
  justify-content: space-between;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => transparentize(0.1, theme.bg2)};
  }
`;

const AveragePriceContainer = styled(NoStyleLink)`
  align-items: center;
  display: flex;
  padding: 1em;
  justify-content: space-between;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => transparentize(0.1, theme.bg2)};
  }
`;

const PriceChangeContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Border = styled.div`
  border: 1px solid ${({ theme }) => transparentize(0.5, theme.text4)};
  width: 100%;
`;

export default function TokenBalancePriceCard({ balance }: { balance?: Balance }) {
  const { nativeToken } = useNativeToken();
  const [price, setPrice] = useState<TokenPrice | undefined>(undefined);
  useEffect(() => {
    if (!balance?.token.address) return;
    const fetchInfo = () => {
      return fetch(
        `${apiUrl}/tokens/${balance.token.address.address}/price_at/${new Date(
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
  }, [balance]);
  const tokenPrice = useMemo(() => {
    if (!balance?.token?.nativeQuote || !nativeToken?.usdPrice) {
      return;
    }
    return Number(balance.token.nativeQuote) * Number(nativeToken.usdPrice);
  }, [balance, nativeToken]);
  const change = useMemo(() => {
    if (!tokenPrice || !price) {
      return;
    }
    return (tokenPrice / Number(price.usdQuote ?? 0)) * 100 - 100;
  }, [price, tokenPrice]);
  const avgChange = useMemo(() => {
    if (!balance || !tokenPrice) {
      return;
    }
    return (tokenPrice / Number(balance.averagePrice?.usdQuote ?? 0)) * 100 - 100;
  }, [balance, tokenPrice]);
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const currency = useCurrency(balance?.token?.address?.address);
  const currency0 = useCurrency(balance?.token?.lpPair?.token0?.address?.address);
  const currency1 = useCurrency(balance?.token?.lpPair?.token1?.address?.address);
  const symbol = useTokenSymbol(balance?.token);
  return (
    <TokenBalancePriceContainer>
      <PriceContainer to={`/token/${balance?.token?.address?.address}`}>
        <Row style={{ gap: '5px' }}>
          <HideUltraSmall style={{ height: '25px' }}>
            {balance?.token?.isLP ? (
              <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={25}></DoubleCurrencyLogo>
            ) : (
              <CurrencyLogo currency={currency} size="25px"></CurrencyLogo>
            )}
          </HideUltraSmall>
          {balance ? (
            <>
              <Fonts.black fontWeight={800} fontSize={15}>
                <Row style={{ gap: '3px' }}>
                  <HideUltraSmall>{symbol}</HideUltraSmall> Price:
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
      <AveragePriceContainer to={`/balance/${balance?.token.address.address}/transactions`}>
        <Row style={{ gap: '5px' }}>
          <HideUltraSmall style={{ height: '25px' }}>
            <img
              alt="average-chart-icon"
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
        {balance && avgChange ? (
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
    </TokenBalancePriceContainer>
  );
}
