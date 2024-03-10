import CurrencyLogo from 'components/CurrencyLogo';
import Row from 'components/Row';
import { TokenModel } from 'models/TokenModel';
import React from 'react';
import styled from 'styled-components';
import { TokenListGrid } from './token-list-grid';
import { HideSmall, Fonts } from 'theme';
import { useDefaultTokens } from 'hooks/Tokens';
import { Link } from 'react-router-dom';
import { formatNumber } from 'utils/formatNumber';
import { useNativeToken } from 'hooks/useNativeToken';
import { HideMedium } from 'components/Hide/hide-medium';
import { HideExtraSmall } from 'components/Hide/hide-extra-small';
import { useCurrency } from 'hooks/useCurrency';

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

export default function TokenListRow({ index, token }: { index: number; token: TokenModel }) {
  const defaultTokens = useDefaultTokens();
  const volume = token.volume.reduce((acc, volume) => acc + Number(volume.usdVolume), 0);
  const { nativeToken } = useNativeToken();
  const price = Number(token.nativeQuote) * Number(nativeToken?.usdPrice);
  let formattedPrice = price.toString();
  let priceIndex = formattedPrice.indexOf('.') + 1;
  while (
    priceIndex < formattedPrice.length &&
    (formattedPrice[priceIndex] === '0' || priceIndex < formattedPrice.indexOf('.') + 1)
  ) {
    ++priceIndex;
  }
  formattedPrice = formattedPrice.slice(0, priceIndex + 2);
  const lastPrice = Number(token.price?.[0]?.closeUsd ?? 0);
  const priceChange = lastPrice ? (price / lastPrice) * 100 - 100 : 0;
  const currency = useCurrency(token.address);
  return (
    <StyledLink to={`/token/${token.address}`}>
      <TokenListGrid>
        <HideExtraSmall>
          <Fonts.black fontWeight={500}>{index}</Fonts.black>
        </HideExtraSmall>
        <Row style={{ gap: '10px' }}>
          <CurrencyLogo currency={currency} size="35px" />
          <Row style={{ gap: '5px' }}>
            <HideExtraSmall>
              <Fonts.black fontWeight={500}>{token.name}</Fonts.black>
            </HideExtraSmall>
            <Fonts.black fontWeight={500}>
              <Row>
                <HideExtraSmall>(</HideExtraSmall>
                {token.symbol}
                <HideExtraSmall>)</HideExtraSmall>
              </Row>
            </Fonts.black>
          </Row>
        </Row>
        <Row style={{ gap: '5px' }}>
          <Fonts.black fontWeight={500}>${formattedPrice}</Fonts.black>
        </Row>
        <HideMedium>
          <Row style={{ gap: '5px' }}>
            {priceChange > 0 ? (
              <Fonts.green fontWeight={500}>{priceChange.toFixed(2)}%</Fonts.green>
            ) : (
              <Fonts.red fontWeight={500}>{priceChange.toFixed(2)}%</Fonts.red>
            )}
          </Row>
        </HideMedium>
        <HideMedium>
          <Row style={{ gap: '5px' }}>
            <Fonts.black fontWeight={500}>${formatNumber(volume)}</Fonts.black>
          </Row>
        </HideMedium>
        <HideSmall>
          <Row style={{ gap: '5px' }}>
            <Fonts.black fontWeight={500}>${formatNumber(token.lastTvl?.reserveUsd)}</Fonts.black>
          </Row>
        </HideSmall>
      </TokenListGrid>
    </StyledLink>
  );
}
