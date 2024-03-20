import React, { useMemo, useState } from 'react';
import Column from 'components/Column';
import { useNativeToken } from 'hooks/useNativeToken';
import { Balance, BalanceChange, TokenPrice } from 'models/schema';
import { Fonts } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import AccountBalanceChart from './account-balance-chart';
import Row from 'components/Row';
import styled from 'styled-components';
import { ArrowDown, Repeat, Shuffle } from 'react-feather';
import { transparentize } from 'polished';
import useTheme from 'hooks/useTheme';
import NoStyleLink from 'components/Link/no-style-link';
import Skeleton from 'react-loading-skeleton';
import DepositModal from '../deposit-modal/deposit-modal';
import { useActiveWeb3React } from 'hooks';
import { useETHBalances } from 'state/wallet/hooks';

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
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const { nativeToken } = useNativeToken();
  const web3 = useActiveWeb3React();
  const userEthBalance = useETHBalances(web3.account ? [web3.account] : [])?.[web3.account ?? ''];

  const totalBalance = useMemo(() => {
    if (!nativeToken) {
      return;
    }
    return balances.reduce((acc, balance) => {
      let amount = Number(balance.balance);
      if (balance.token.isNative && userEthBalance) {
        amount += Number(userEthBalance.toExact());
      }
      return acc + amount * Number(balance.token.nativeQuote) * Number(nativeToken?.usdPrice);
    }, 0);
  }, [userEthBalance, balances, nativeToken]);
  const change24h = useMemo(() => {
    if (!nativeToken) {
      return;
    }
    return balances.reduce((acc, balance) => {
      let balance24h: BalanceChange | undefined = undefined;
      if (balance.balanceChanges) {
        for (const change of balance.balanceChanges) {
          if (new Date(change.date).getTime() > Date.now() - 1000 * 60 * 60 * 24) {
            if (!balance24h || new Date(balance24h.date).getTime() > new Date(change.date).getTime()) {
              balance24h = change;
            }
          }
        }
      }
      let price24h: TokenPrice | undefined = undefined;
      if (balance.token.price) {
        for (const price of balance.token.price) {
          if (new Date(price.date).getTime() > Date.now() - 1000 * 60 * 60 * 24) {
            if (!price24h || new Date(price24h.date).getTime() > new Date(price.date).getTime()) {
              price24h = price;
            }
          }
        }
      }
      if (!price24h) return acc;
      return (
        acc +
        Number(balance.balance) * Number(balance.token.nativeQuote) * Number(nativeToken.usdPrice) -
        Number(balance24h ? balance24h.amount : balance?.balance) * Number(price24h.usdQuote)
      );
    }, 0);
  }, [balances, nativeToken]);
  const theme = useTheme();
  return (
    <Column style={{ gap: '0.5em', width: '100%', alignItems: 'center' }}>
      <DepositModal
        isOpen={depositModalOpen}
        onDismiss={() => {
          setDepositModalOpen(false);
        }}
      ></DepositModal>
      <Title>{balances.length > 0 ? 'Your Balance' : <Skeleton width="150px"></Skeleton>}</Title>
      <BalanceTitle>
        {balances.length > 0 ? (
          `$ ${formatNumber(totalBalance, { reduce: false })} USD`
        ) : (
          <Skeleton width="200px"></Skeleton>
        )}
      </BalanceTitle>
      {change24h ? (
        change24h > 0 ? (
          <Fonts.green fontSize={12}>{formatNumber(change24h, { reduce: false })}$ (24h)</Fonts.green>
        ) : (
          <Fonts.red fontSize={12}>{formatNumber(change24h, { reduce: false })}$ (24h)</Fonts.red>
        )
      ) : (
        <Skeleton width="75px"></Skeleton>
      )}
      <AccountBalanceChart balances={balances}></AccountBalanceChart>
      <Row style={{ gap: '0.5em', zIndex: '1000', marginTop: '-2em', justifyContent: 'space-evenly' }}>
        <BalanceHeaderButtonContainer
          onClick={(event) => {
            setDepositModalOpen(true);
          }}
        >
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
