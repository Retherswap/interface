import CurrencyLogo from 'components/CurrencyLogo';
import Row from 'components/Row';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Fonts } from 'theme';
import Column from 'components/Column';
import { useNativeToken } from 'hooks/useNativeToken';
import { formatNumber } from 'utils/formatNumber';
import { useWindowSize } from 'hooks/useWindowSize';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { ShowUltraSmall } from 'components/Hide/show-ultra-small';
import { HideUltraSmall } from 'components/Hide/hide-ultra-small';
import { Balance } from 'models/schema';
import DoubleCurrencyLogo from 'components/DoubleLogo';
import { useCurrency } from 'hooks/useCurrency';
import { useTokenName } from 'hooks/useTokenName';
import { useTokenSymbol } from 'hooks/useTokenSymbol';

const TokenBalanceRowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 15px;
  background: ${({ theme }) => theme.bg1};
  padding: 1em;
  transition: background-color 0.25s;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.bg2};
  }
`;

const TokenName = styled(Fonts.black)`
  text-wrap: nowrap;
  text-overflow: ellipsis;
  width: 60%;
  display: block;
  overflow: hidden;
  font-size: 16px;
  font-weight: 600 !important;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 14px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `};
  ${({ theme }) => theme.mediaWidth.upToUltraSmall`
  font-size: 11px;
`};
`;

const USDAmount = styled(Fonts.black)`
  text-wrap: nowrap;
  font-size: 18px;
  font-weight: 800 !important;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 14px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `};
`;

const TokenCount = styled(Fonts.darkGray)`
  font-size: 13px;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  width: 60%;
  display: block;
  overflow: hidden;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 11px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 10px;
  `};
`;

export default function TokenBalanceRow({ balance }: { balance?: Balance }) {
  const { nativeToken } = useNativeToken();
  const [usdBalance, setUsdBalance] = useState<number | undefined>(undefined);
  useMemo(() => {
    if (!balance || !nativeToken) {
      return;
    }
    /*if (balance.token.isLP) {
      const token0 = balance.token.lpPair?.token0;
      const token1 = balance.token.lpPair?.token1;
      if (!token0 || !token1) {
        return;
      }
      setUsdBalance(
        Number(balance.balance) *
          ((Number(balance.token.lpPair?.token0.nativeQuote) * Number(nativeToken.usdPrice) +
            Number(balance.token.lpPair?.token1.nativeQuote) * Number(nativeToken.usdPrice)) /
            2)
      );
      return;
    } else {
      setUsdBalance(Number(balance.balance) * Number(balance.token.nativeQuote) * Number(nativeToken.usdPrice));
    }*/
    setUsdBalance(Number(balance.balance) * Number(balance.token.nativeQuote) * Number(nativeToken.usdPrice));
  }, [nativeToken, setUsdBalance, balance]);
  const size = useWindowSize();
  const currency0 = useCurrency(balance?.token?.lpPair?.token0.address);
  const currency1 = useCurrency(balance?.token?.lpPair?.token1.address);
  const currency = useCurrency(balance?.token?.address);
  const name = useTokenName(balance?.token);
  const symbol = useTokenSymbol(balance?.token);
  return (
    <Link to={`/balance/${balance?.token.address}`} style={{ textDecoration: 'none', width: '100%' }}>
      <TokenBalanceRowContainer>
        <Row style={{ gap: '10px', width: '50%', flexGrow: 1, flexShrink: 1 }}>
          {balance?.token?.isLP ? (
            <DoubleCurrencyLogo size={30} currency0={currency0} currency1={currency1}></DoubleCurrencyLogo>
          ) : (
            <CurrencyLogo currency={currency} style={{ width: '40px', height: '40px' }}></CurrencyLogo>
          )}
          <TokenName>
            {balance ? (
              (size?.width ?? 0) < 500 ? (
                symbol
              ) : (
                name
              )
            ) : (
              <>
                <HideUltraSmall>
                  <Skeleton width="150px"></Skeleton>
                </HideUltraSmall>
                <ShowUltraSmall>
                  <Skeleton width="100px"></Skeleton>
                </ShowUltraSmall>
              </>
            )}
          </TokenName>
        </Row>
        <Column style={{ alignItems: 'end', textAlign: 'end', gap: '5px', width: '50%', flexGrow: 1, flexShrink: 1 }}>
          <USDAmount>
            {balance && usdBalance !== undefined ? (
              `${formatNumber(usdBalance, { reduce: (size?.width ?? 0) < 500, maxDecimals: 2 })} $`
            ) : (
              <>
                <HideUltraSmall>
                  <Skeleton width="70px"></Skeleton>
                </HideUltraSmall>
                <ShowUltraSmall>
                  <Skeleton width="50px"></Skeleton>
                </ShowUltraSmall>
              </>
            )}
          </USDAmount>
          <TokenCount>
            {balance ? (
              `${formatNumber(balance?.balance, { reduce: (size?.width ?? 0) < 500, maxDecimals: 2 })} ${symbol}`
            ) : (
              <>
                <HideUltraSmall>
                  <Skeleton width="90px"></Skeleton>
                </HideUltraSmall>
                <ShowUltraSmall>
                  <Skeleton width="70px"></Skeleton>
                </ShowUltraSmall>
              </>
            )}
          </TokenCount>
        </Column>
      </TokenBalanceRowContainer>
    </Link>
  );
}
