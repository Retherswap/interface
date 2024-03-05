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
import { Balance } from 'models/schema';
import TokenBalanceChart from './token-balance-chart';
import NoStyleLink from 'components/Link/no-style-link';
import Skeleton from 'react-loading-skeleton';

const Title = styled(Fonts.darkGray)`
  font-size: 20px;
  font-weight: 300;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 16px;
    `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
    `};
`;

const BalanceTitle = styled(Fonts.black)`
  font-size: 30px;
  font-weight: 800 !important;
  ${({ theme }) => theme.mediaWidth.upToMedium`
        font-size: 24px;
        `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        font-size: 20px;
        `};
`;

const BalanceHeaderButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
`;

const BalanceHeaderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-color: ${({ theme }) => transparentize(0.8, theme.primary1)};
  outline: none;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => transparentize(0.7, theme.primary1)};
  }
`;
export default function TokenBalanceHeader({ balance }: { balance?: Balance }) {
  const nativeToken = useNativeToken();
  const usdBalance = balance
    ? balance.balance * Number(balance.token.nativeQuote) * Number(nativeToken.nativeToken?.usdPrice)
    : 0;
  const theme = useTheme();
  const defaultTokens = useDefaultTokens();
  return (
    <Column style={{ gap: '0.5em', width: '100%', alignItems: 'center' }}>
      <>
        <CurrencyLogo currency={defaultTokens[balance?.token?.address ?? '']} size="50px"></CurrencyLogo>
        <Title>{balance ? `${balance.token.name} Balance` : <Skeleton width="200px"></Skeleton>}</Title>
        <BalanceTitle>
          {balance ? `$ ${formatNumber(usdBalance, { reduce: false })} USD` : <Skeleton width="200px"></Skeleton>}
        </BalanceTitle>
        <Fonts.darkGray fontSize={12}>
          {balance ? (
            `${formatNumber(balance.balance, { reduce: false })} ${balance?.token.symbol}`
          ) : (
            <Skeleton width="100px"></Skeleton>
          )}
        </Fonts.darkGray>
        <TokenBalanceChart balance={balance}></TokenBalanceChart>{' '}
        <Row style={{ gap: '0.5em', marginTop: '-2em', justifyContent: 'space-evenly' }}>
          <BalanceHeaderButtonContainer>
            <BalanceHeaderButton>
              <ArrowDown color={theme.primary1}></ArrowDown>
            </BalanceHeaderButton>
            <Fonts.blue fontSize={12}>Deposit</Fonts.blue>
          </BalanceHeaderButtonContainer>
          <NoStyleLink to={'/swap/' + balance?.token.address}>
            <BalanceHeaderButtonContainer>
              <BalanceHeaderButton>
                <Repeat color={theme.primary1}></Repeat>
              </BalanceHeaderButton>
              <Fonts.blue fontSize={12}>Swap</Fonts.blue>
            </BalanceHeaderButtonContainer>
          </NoStyleLink>
          <BalanceHeaderButtonContainer>
            <BalanceHeaderButton>
              <Shuffle color={theme.primary1}></Shuffle>
            </BalanceHeaderButton>
            <Fonts.blue fontSize={12}>Bridge</Fonts.blue>
          </BalanceHeaderButtonContainer>
        </Row>
      </>
    </Column>
  );
}
