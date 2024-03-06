import CurrencyLogo from 'components/CurrencyLogo';
import Row from 'components/Row';
import React from 'react';
import styled from 'styled-components';
import { Fonts } from 'theme';
import Column from 'components/Column';
import { useNativeToken } from 'hooks/useNativeToken';
import { formatNumber } from 'utils/formatNumber';
import { useDefaultTokens } from 'hooks/Tokens';
import { useWindowSize } from 'hooks/useWindowSize';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { HideSmall } from 'components/Hide/hide-small';
import { HideMedium } from 'components/Hide/hide-medium';
import { ShowMedium } from 'components/Hide/show-medium';
import { ShowSmall } from 'components/Hide/show-small';
import { ShowUltraSmall } from 'components/Hide/show-ultra-small';
import { HideUltraSmall } from 'components/Hide/hide-ultra-small';
import { Balance } from 'models/schema';

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
  font-size: 15px;
  font-weight: 800;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 13px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 11px;
  `};
`;

const USDAmount = styled(Fonts.black)`
  text-wrap: nowrap;
  font-size: 18px;
  font-weight: 800 !important;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 15px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `};
`;

const TokenCount = styled(Fonts.darkGray)`
  font-size: 13px;
  text-wrap: nowrap;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 11px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 10px;
  `};
`;

export default function TokenBalanceRow({ balance }: { balance?: Balance }) {
  const nativeToken = useNativeToken();
  const defaultTokens = useDefaultTokens();
  const usdBalance =
    Number(balance?.balance ?? 0) * Number(balance?.token.nativeQuote) * Number(nativeToken.nativeToken?.usdPrice);
  const size = useWindowSize();
  return (
    <Link to={`/balance/${balance?.token.address}`} style={{ textDecoration: 'none', width: '100%' }}>
      <TokenBalanceRowContainer>
        <Row style={{ gap: '10px' }}>
          <CurrencyLogo currency={defaultTokens[balance?.token.address ?? '']} size="40px" />
          <TokenName fontSize={15}>
            {balance ? (
              (size?.width ?? 0) < 500 ? (
                balance.token.symbol
              ) : (
                balance.token.name
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
        <Column style={{ alignItems: 'end', textAlign: 'end', gap: '5px' }}>
          <USDAmount>
            {balance ? (
              `$ ${formatNumber(usdBalance, { reduce: (size?.width ?? 0) < 500 })}`
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
              `${formatNumber(balance?.balance, { reduce: (size?.width ?? 0) < 500 })} ${balance?.token.symbol}`
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
