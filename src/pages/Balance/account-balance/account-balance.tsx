import React, { useEffect, useMemo, useState } from 'react';
import { useActiveWeb3React } from 'hooks/web3';
import { useNativeToken } from 'hooks/useNativeToken';
import TokenBalanceRow from './token-balance-row';
import { apiUrl } from 'configs/server';
import AccountBalanceHeader from './account-balance-header';
import styled from 'styled-components';
import Balance from '../balance';
import { Balance as BalanceModel } from 'models/schema';
import { useETHBalances } from 'state/wallet/hooks';

const TokenBalanceRowList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  width: 100%;
  padding: 1em;
`;

export default function AccountBalance() {
  const web3 = useActiveWeb3React();
  const userEthBalance = useETHBalances(web3.account ? [web3.account] : [])?.[web3.account ?? ''];
  const [balances, setBalances] = useState<BalanceModel[]>([]);
  useEffect(() => {
    const fetchInfo = () => {
      return fetch(`${apiUrl}/balances/address/${web3.account}`)
        .then((res) => res.json())
        .then((d) => setBalances(d))
        .catch((e) => {
          console.error(e);
        });
    };
    fetchInfo();
  }, [web3.account]);
  const { nativeToken } = useNativeToken();
  const sortedBalances = useMemo(() => {
    if (!balances) {
      return [];
    }
    return balances.sort((a, b) => {
      let totalBalanceA = Number(a.balance);
      if (a.token.isNative && userEthBalance) {
        totalBalanceA += Number(userEthBalance.toExact());
      }
      let totalBalanceB = Number(b.balance);
      if (b.token.isNative && userEthBalance) {
        totalBalanceB += Number(userEthBalance.toExact());
      }
      return (
        totalBalanceB * Number(b.token.nativeQuote) * Number(nativeToken?.nativeQuote) -
        totalBalanceA * Number(a.token.nativeQuote) * Number(nativeToken?.nativeQuote)
      );
    });
  }, [balances, userEthBalance, nativeToken]);
  return (
    <Balance>
      <AccountBalanceHeader balances={balances}></AccountBalanceHeader>
      <TokenBalanceRowList>
        {balances.length > 0
          ? sortedBalances.map((balance) => (
              <TokenBalanceRow key={`token-balance-row-${balance.id}`} balance={balance}></TokenBalanceRow>
            ))
          : Array.from({ length: 5 }).map((_, i) => (
              <TokenBalanceRow key={`token-balance-row-skeleton-${i}`}></TokenBalanceRow>
            ))}
      </TokenBalanceRowList>
    </Balance>
  );
}
