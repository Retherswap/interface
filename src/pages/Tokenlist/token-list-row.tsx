import React, { useMemo } from 'react';
import CurrencyLogo from 'components/CurrencyLogo';
import Row from 'components/Row';
import styled from 'styled-components';
import { TokenListGrid } from './token-list-grid';
import { HideSmall, Fonts } from 'theme';
import { Link } from 'react-router-dom';
import { formatNumber } from 'utils/formatNumber';
import { useNativeToken } from 'hooks/useNativeToken';
import { HideMedium } from 'components/Hide/hide-medium';
import { HideExtraSmall } from 'components/Hide/hide-extra-small';
import { useCurrency } from 'hooks/useCurrency';
import FullWidthSkeleton from 'components/Skeleton/full-width-skeleton';
import { Token } from 'models/schema';
import { useWindowSize } from 'hooks/useWindowSize';
export const StyledLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;

  :hover {
    opacity: 0.7;
    text-decoration: none;
  }

  :focus {
    outline: none;
    text-decoration: none;
  }

  :active {
    text-decoration: none;
  }
`;

export default function TokenListRow({ index, token }: { index: number; token?: Token }) {
  const volume = useMemo(() => {
    return token?.volume?.reduce((acc, volume) => acc + Number(volume.usdVolume), 0);
  }, [token]);
  const { nativeToken } = useNativeToken();
  const price = Number(token?.nativeQuote) * Number(nativeToken?.usdPrice);
  let formattedPrice = price.toString();
  let priceIndex = formattedPrice.indexOf('.') + 1;
  while (
    priceIndex < formattedPrice.length &&
    (formattedPrice[priceIndex] === '0' || priceIndex < formattedPrice.indexOf('.') + 1)
  ) {
    ++priceIndex;
  }
  formattedPrice = formattedPrice.slice(0, priceIndex + 2);
  const lastPrice = Number(token?.price?.[0]?.usdQuote ?? 0);
  const priceChange = lastPrice ? (price / lastPrice) * 100 - 100 : 0;
  const currency = useCurrency(token?.address?.address);
  const windowSize = useWindowSize();
  const fontSize = useMemo(() => {
    return (windowSize.width ?? 0) < 768 ? 12 : 16;
  }, [windowSize.width]);
  return (
    <StyledLink to={`/token/${token?.address?.address}`}>
      <TokenListGrid>
        <HideExtraSmall>
          <Fonts.black fontWeight={500} fontSize={fontSize}>
            {index}
          </Fonts.black>
        </HideExtraSmall>
        <Row style={{ gap: '10px' }}>
          <CurrencyLogo currency={currency} size="30px" />
          <Row style={{ gap: '5px' }}>
            {token ? (
              <>
                <HideExtraSmall>
                  <Fonts.black fontWeight={500} fontSize={fontSize}>
                    {token.name}
                  </Fonts.black>
                </HideExtraSmall>
                <Fonts.black fontWeight={500} fontSize={fontSize}>
                  <Row>
                    <HideExtraSmall>(</HideExtraSmall>
                    {token.symbol}
                    <HideExtraSmall>)</HideExtraSmall>
                  </Row>
                </Fonts.black>
              </>
            ) : (
              <FullWidthSkeleton width="75%"></FullWidthSkeleton>
            )}
          </Row>
        </Row>
        <Row style={{ gap: '5px' }}>
          {token ? (
            <Fonts.black fontWeight={500} fontSize={fontSize}>
              ${formattedPrice}
            </Fonts.black>
          ) : (
            <FullWidthSkeleton width="75%"></FullWidthSkeleton>
          )}
        </Row>
        <Row style={{ gap: '5px' }}>
          {token ? (
            priceChange > 0 ? (
              <Fonts.green fontWeight={500} fontSize={fontSize}>
                {priceChange.toFixed(2)}%
              </Fonts.green>
            ) : (
              <Fonts.red fontWeight={500} fontSize={fontSize}>
                {priceChange.toFixed(2)}%
              </Fonts.red>
            )
          ) : (
            <FullWidthSkeleton width="75%"></FullWidthSkeleton>
          )}
        </Row>
        <HideMedium>
          <Row style={{ gap: '5px' }}>
            {token ? (
              <Fonts.black fontWeight={500} fontSize={fontSize}>
                ${formatNumber(volume)}
              </Fonts.black>
            ) : (
              <FullWidthSkeleton width="75%"></FullWidthSkeleton>
            )}
          </Row>
        </HideMedium>
        <HideSmall>
          <Row style={{ gap: '5px' }}>
            {token ? (
              <Fonts.black fontWeight={500} fontSize={fontSize}>
                ${formatNumber(Number(token.circulatingSupply) * price)}
              </Fonts.black>
            ) : (
              <FullWidthSkeleton width="75%"></FullWidthSkeleton>
            )}
          </Row>
        </HideSmall>
      </TokenListGrid>
    </StyledLink>
  );
}
