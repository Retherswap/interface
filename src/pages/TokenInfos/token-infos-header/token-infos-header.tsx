import { TokenModel } from 'models/TokenModel';
import React, { useEffect, useState } from 'react';
import { useDefaultTokens } from 'hooks/Tokens';
import { Button, TYPE } from 'theme';
import Column from 'components/Column';
import Row from 'components/Row';
import CurrencyLogo from 'components/CurrencyLogo';
import { BaseButton, ButtonPrimary } from 'components/Button';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp } from 'react-feather';
import { useNativeToken } from 'hooks/useNativeToken';
import { useTokenBalance } from 'state/wallet/hooks';
import { Token } from '@retherswap/sdk';
import { useActiveWeb3React } from 'hooks';
import { formatNumber } from 'utils/formatNumber';

export const AddLiquidityButton = styled(BaseButton)`
  width: 200px;
  height: 50px;
  border: 3px solid ${({ theme }) => theme.primary1};
  background-color: transparent;
  color: ${({ theme }) => theme.text1};

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export const TradeButton = styled(ButtonPrimary)`
  width: 100px;
  height: 50px;
`;

export default function TokenInfosHeader({ token }: { token: TokenModel }) {
  const { nativeToken } = useNativeToken();
  const lastPrice =
    token.price.filter((price) => new Date(price.date).getTime() > new Date().getTime() - 24 * 60 * 60 * 1000)?.[0]
      ?.usdPrice ?? 0;
  const price = Number(token.nativeQuote) * Number(nativeToken?.usdPrice);
  let formattedPrice = price.toString();
  let index = formattedPrice.indexOf('.') + 1;
  while (index < formattedPrice.length && (formattedPrice[index] === '0' || index < formattedPrice.indexOf('.') + 1)) {
    ++index;
  }
  formattedPrice = formattedPrice.slice(0, index + 2);
  const priceChange = lastPrice ? (price / lastPrice) * 100 - 100 : 0;
  const defaultTokens = useDefaultTokens();
  const { account } = useActiveWeb3React();
  const tokenBalance = useTokenBalance(account ?? undefined, new Token(token.idChain, token.address, token.decimals));
  return (
    <Row style={{ justifyContent: 'space-between' }}>
      <Row style={{ alignItems: 'baseline', gap: '1em' }}>
        <Column style={{ gap: '10px' }}>
          <Row style={{ alignItems: 'center', gap: '10px' }}>
            <CurrencyLogo currency={defaultTokens[token.address]} size="40px"></CurrencyLogo>
            <TYPE.black fontWeight={800} fontSize={40}>
              {token.name}
            </TYPE.black>
            <TYPE.darkGray fontWeight={500}>({token.symbol})</TYPE.darkGray>
          </Row>
          <Row style={{ marginLeft: '50px', gap: '10px' }}>
            <Row>
              <TYPE.black fontWeight={600} fontSize={25}>
                ${formattedPrice}{' '}
              </TYPE.black>
            </Row>
            {priceChange > 0 ? (
              <Row>
                <TYPE.green fontSize={25}>{priceChange.toFixed(2)}%</TYPE.green>
                <ArrowUp color="green"></ArrowUp>
              </Row>
            ) : (
              <Row>
                <TYPE.red fontSize={25}>{priceChange.toFixed(2)}%</TYPE.red>
                <ArrowDown color="red"></ArrowDown>
              </Row>
            )}
          </Row>
          <Row style={{ marginLeft: '50px' }}>
            {tokenBalance && (
              <TYPE.black fontWeight={400} fontSize={14}>
                Balance : ${formatNumber(Number(tokenBalance.toExact()) * price)}
              </TYPE.black>
            )}
          </Row>
        </Column>
      </Row>
      <Row style={{ justifyContent: 'end', gap: '10px' }}>
        <StyledLink to={`/add/${token.address}`}>
          <AddLiquidityButton>Add liquidity</AddLiquidityButton>
        </StyledLink>
        <StyledLink to={`/swap?outputCurrency=${token.address}`}>
          <TradeButton>Trade</TradeButton>
        </StyledLink>
      </Row>
    </Row>
  );
}
