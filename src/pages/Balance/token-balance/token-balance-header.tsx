import React, { useMemo, useState } from 'react';
import Column from 'components/Column';
import { useNativeToken } from 'hooks/useNativeToken';
import { Fonts } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import Row from 'components/Row';
import styled from 'styled-components';
import { ArrowDown, Repeat, Shuffle } from 'react-feather';
import { transparentize } from 'polished';
import useTheme from 'hooks/useTheme';
import CurrencyLogo from 'components/CurrencyLogo';
import { Balance } from 'models/schema';
import TokenBalanceChart from './token-balance-chart';
import NoStyleLink from 'components/Link/no-style-link';
import Skeleton from 'react-loading-skeleton';
import DepositModal from '../deposit-modal/deposit-modal';
import DoubleCurrencyLogo from 'components/DoubleLogo';
import { useCurrency } from 'hooks/useCurrency';
import { useTokenName } from 'hooks/useTokenName';
import { useTokenSymbol } from 'hooks/useTokenSymbol';
import { useActiveWeb3React } from 'hooks';
import { useETHBalances } from 'state/wallet/hooks';

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
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const { nativeToken } = useNativeToken();
  const web3 = useActiveWeb3React();
  const userEthBalance = useETHBalances(web3.account ? [web3.account] : [])?.[web3.account ?? ''];
  const totalBalance = useMemo(() => {
    if (!balance) {
      return;
    }
    let totalBalance = Number(balance.balance);
    if (balance.token.isNative && userEthBalance) {
      totalBalance += Number(userEthBalance.toExact());
    }
    return totalBalance;
  }, [balance, userEthBalance]);
  const usdBalance = useMemo(() => {
    if (totalBalance === undefined || !balance || !nativeToken) {
      return;
    }
    return totalBalance * Number(balance.token.nativeQuote) * Number(nativeToken.usdPrice);
  }, [nativeToken, totalBalance, balance]);
  const theme = useTheme();
  const currency0 = useCurrency(balance?.token?.lpPair?.token0?.address?.address);
  const currency1 = useCurrency(balance?.token?.lpPair?.token1?.address?.address);
  const currency = useCurrency(balance?.token?.address?.address);
  const name = useTokenName(balance?.token);
  const symbol = useTokenSymbol(balance?.token);
  return (
    <Column style={{ gap: '0.5em', width: '100%', alignItems: 'center' }}>
      <DepositModal
        isOpen={depositModalOpen}
        onDismiss={() => {
          setDepositModalOpen(false);
        }}
      ></DepositModal>
      {balance?.token?.isLP ? (
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={50}></DoubleCurrencyLogo>
      ) : (
        <CurrencyLogo currency={currency} size="50px"></CurrencyLogo>
      )}
      <a
        href={`https://explorer.hypra.network/address/${balance?.token?.address?.address}`}
        target="_blank"
        rel="noreferrer noopener"
        style={{ textDecoration: 'none' }}
      >
        <Title>{balance ? `${name} Balance` : <Skeleton width="200px"></Skeleton>}</Title>
      </a>
      <BalanceTitle>
        {balance ? `$ ${formatNumber(usdBalance, { reduce: false })} USD` : <Skeleton width="200px"></Skeleton>}
      </BalanceTitle>
      <Fonts.darkGray fontSize={12}>
        {balance ? `${formatNumber(totalBalance, { reduce: false })} ${symbol}` : <Skeleton width="100px"></Skeleton>}
      </Fonts.darkGray>
      <TokenBalanceChart balance={balance}></TokenBalanceChart>{' '}
      <Row style={{ gap: '0.5em', zIndex: '1000', marginTop: '-2em', justifyContent: 'space-evenly' }}>
        <BalanceHeaderButtonContainer
          onClick={() => {
            setDepositModalOpen(true);
          }}
        >
          <BalanceHeaderButton>
            <ArrowDown color={theme.primary1}></ArrowDown>
          </BalanceHeaderButton>
          <Fonts.blue fontSize={12}>Deposit</Fonts.blue>
        </BalanceHeaderButtonContainer>
        <NoStyleLink
          to={
            balance?.token.isLP
              ? '/add/' +
                balance.token.lpPair?.token0?.address?.address +
                '/' +
                balance.token.lpPair?.token1?.address?.address
              : '/swap/' + balance?.token?.address?.address
          }
        >
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
