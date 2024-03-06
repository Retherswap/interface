import React from 'react';
import Column from 'components/Column';
import { useNativeToken } from 'hooks/useNativeToken';
import { Balance } from 'models/schema';
import { Fonts } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import AccountBalanceChart from './account-balance-chart';
import Row from 'components/Row';
import styled from 'styled-components';
import { ArrowDown, Download, Repeat, Shuffle } from 'react-feather';
import { transparentize } from 'polished';
import useTheme from 'hooks/useTheme';
import NoStyleLink from 'components/Link/no-style-link';
import Skeleton from 'react-loading-skeleton';

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

export default function AccountBalanceHeader({ balances }: { balances: Balance[] }) {
  const nativeToken = useNativeToken();
  const totalBalance = balances.reduce((acc, balance) => {
    return acc + balance.balance * Number(balance.token.nativeQuote) * Number(nativeToken.nativeToken?.usdPrice);
  }, 0);
  const change = 20.78;
  const theme = useTheme();
  return (
    <Column style={{ gap: '0.5em', width: '100%', alignItems: 'center' }}>
      <Title>{balances.length > 0 ? 'Your Balance' : <Skeleton width="150px"></Skeleton>}</Title>
      <BalanceTitle>
        {balances.length > 0 ? (
          `$ ${formatNumber(totalBalance, { reduce: false })} USD`
        ) : (
          <Skeleton width="200px"></Skeleton>
        )}
      </BalanceTitle>
      {change > 0 ? (
        <Fonts.green fontSize={12}>+ $ {formatNumber(change, { reduce: false })} (24h)</Fonts.green>
      ) : (
        <Fonts.red fontSize={12}>- $ {formatNumber(change, { reduce: false })} (24h)</Fonts.red>
      )}
      <AccountBalanceChart balances={balances}></AccountBalanceChart>
      <Row style={{ gap: '0.5em', marginTop: '-2em', justifyContent: 'space-evenly' }}>
        <BalanceHeaderButtonContainer>
          <BalanceHeaderButton>
            <ArrowDown color={theme.primary1}></ArrowDown>
          </BalanceHeaderButton>
          <Fonts.blue fontSize={12}>Deposit</Fonts.blue>
        </BalanceHeaderButtonContainer>
        <NoStyleLink to={'/swap'}>
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
    </Column>
  );
}
