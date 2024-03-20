import React, { useMemo } from 'react';
import { CustomLightSpinner, HideExtraSmall, Fonts } from 'theme';
import Column from 'components/Column';
import Row from 'components/Row';
import CurrencyLogo from 'components/CurrencyLogo';
import { BaseButton, ButtonPrimary } from 'components/Button';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, ChevronRight, Copy } from 'react-feather';
import { useNativeToken } from 'hooks/useNativeToken';
import { useTokenBalance } from 'state/wallet/hooks';
import { useActiveWeb3React } from 'hooks';
import { formatNumber } from 'utils/formatNumber';
import Circle from '../../../assets/images/blue-loader.svg';
import { formatAddress } from 'utils/formatAddress';
import useTheme from 'hooks/useTheme';
import { HideSmall } from 'components/Hide/hide-small';
import { useCurrency } from 'hooks/useCurrency';
import FullWidthSkeleton from 'components/Skeleton/full-width-skeleton';
import { Token } from 'models/schema';
import { Token as SDKToken } from '@retherswap/sdk';

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

const TitleContainer = styled(Row)`
  gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
    align-items: start;
  `};
`;

const PriceContainer = styled(Row)`
  margin-left: 50px;
  gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
  `};
`;

export default function TokenInfosHeader({ token }: { token?: Token }) {
  const { nativeToken } = useNativeToken();
  const lastPrice = useMemo(() => {
    if (!token || !token.price) {
      return undefined;
    }
    return Number(
      [...token.price]
        .sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
        .filter((price) => new Date(price.date).getTime() < new Date().getTime() - 24 * 60 * 60 * 1000)?.[0]
        ?.usdQuote ?? 0
    );
  }, [token]);
  const price = Number(token?.nativeQuote) * Number(nativeToken?.usdPrice);
  let formattedPrice = price.toString();
  let index = formattedPrice.indexOf('.') + 1;
  while (index < formattedPrice.length && (formattedPrice[index] === '0' || index < formattedPrice.indexOf('.') + 1)) {
    ++index;
  }
  formattedPrice = formattedPrice.slice(0, index + 2);
  const priceChange = lastPrice ? (price / lastPrice) * 100 - 100 : 0;
  const currency = useCurrency(token?.address?.address);
  const { account } = useActiveWeb3React();
  const tokenBalance = useTokenBalance(
    account ?? undefined,
    token ? new SDKToken(token.idChain, token.address?.address, token.decimals) : undefined
  );
  const theme = useTheme();
  const copyAddress = () => {
    navigator.clipboard.writeText(token?.address?.address ?? 'Error');
  };
  return (
    <Column style={{ gap: '3em', width: '100%' }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Row style={{ gap: '10px' }}>
          <Link to="/tokens" style={{ textDecoration: 'none' }}>
            <Fonts.blue fontWeight={500} fontSize={14}>
              Info
            </Fonts.blue>
          </Link>
          <ChevronRight color="darkgray" size={15}></ChevronRight>
          <Link to="/tokens" style={{ textDecoration: 'none' }}>
            <Fonts.blue fontWeight={500} fontSize={14}>
              Tokens
            </Fonts.blue>
          </Link>
          <ChevronRight color="darkgray" size={15}></ChevronRight>
          {token ? (
            <Fonts.black fontWeight={500} fontSize={14} style={{ textOverflow: 'ellipsis', textWrap: 'nowrap' }}>
              {token.symbol} <HideExtraSmall>({formatAddress(token.address?.address, 4, 4)})</HideExtraSmall>
            </Fonts.black>
          ) : (
            <FullWidthSkeleton width="75%"></FullWidthSkeleton>
          )}
        </Row>
        <Row style={{ justifyContent: 'end', gap: '10px' }}>
          <HideExtraSmall>
            <a
              href={`https://explorer.hypra.network/address/${token?.address?.address}`}
              target="_blank"
              rel="noreferrer noopener"
              style={{ textDecoration: 'none' }}
            >
              <Fonts.blue fontWeight={800} fontSize={14}>
                View on explorer
              </Fonts.blue>
            </a>
          </HideExtraSmall>
          <Copy
            style={{ cursor: 'pointer' }}
            color={theme.blue2}
            onClick={() => {
              copyAddress();
            }}
          ></Copy>
        </Row>
      </Row>
      <Row style={{ justifyContent: 'space-between' }}>
        <Row style={{ alignItems: 'baseline', gap: '1em' }}>
          <Column style={{ gap: '10px' }}>
            <Row style={{ gap: '10px' }}>
              <CurrencyLogo currency={currency} size="40px"></CurrencyLogo>
              {token ? (
                <TitleContainer>
                  <Fonts.black fontWeight={800} fontSize={36}>
                    {token.name}
                  </Fonts.black>
                  <HideExtraSmall>
                    <Fonts.darkGray fontWeight={500}>({token.symbol})</Fonts.darkGray>
                  </HideExtraSmall>
                </TitleContainer>
              ) : (
                <FullWidthSkeleton width="75%"></FullWidthSkeleton>
              )}
            </Row>
            <PriceContainer style={{ marginLeft: '50px', gap: '10px' }}>
              {token ? (
                <>
                  <Row>
                    <Fonts.black fontWeight={600} fontSize={25}>
                      ${formattedPrice}
                    </Fonts.black>
                  </Row>
                  {priceChange > 0 ? (
                    <Row>
                      <Fonts.green fontSize={25}>{priceChange.toFixed(2)}%</Fonts.green>
                      <ArrowUp color="green"></ArrowUp>
                    </Row>
                  ) : (
                    <Row>
                      <Fonts.red fontSize={25}>{priceChange.toFixed(2)}%</Fonts.red>
                      <ArrowDown color="red"></ArrowDown>
                    </Row>
                  )}{' '}
                </>
              ) : (
                <FullWidthSkeleton width="75%"></FullWidthSkeleton>
              )}
            </PriceContainer>
            <Row style={{ marginLeft: '50px' }}>
              <Row style={{ gap: '10px' }}>
                <Fonts.black>Balance :</Fonts.black>
                {tokenBalance ? (
                  <Fonts.black>${formatNumber(Number(tokenBalance.toExact()) * price)}</Fonts.black>
                ) : (
                  <CustomLightSpinner src={Circle} alt="loader" size={'18px'} />
                )}
              </Row>
            </Row>
          </Column>
        </Row>
        <HideSmall>
          <Row style={{ justifyContent: 'end', gap: '10px' }}>
            <StyledLink to={`/add/${token?.address?.address}`}>
              <AddLiquidityButton>Add liquidity</AddLiquidityButton>
            </StyledLink>
            <StyledLink to={`/swap?outputCurrency=${token?.address?.address}`}>
              <TradeButton>Trade</TradeButton>
            </StyledLink>
          </Row>
        </HideSmall>
      </Row>
    </Column>
  );
}
