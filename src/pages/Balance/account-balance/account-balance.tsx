import React, { useEffect, useState } from 'react';
import { useActiveWeb3React } from 'hooks/web3';
import { useNativeToken } from 'hooks/useNativeToken';
import TokenBalanceRow from './token-balance-row';
import { apiUrl } from 'configs/server';
import AccountBalanceHeader from './account-balance-header';
import styled from 'styled-components';
import Balance from '../balance';
import { Balance as BalanceModel } from 'models/schema';

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
  const nativeToken = useNativeToken();
  return (
    <Balance>
      <AccountBalanceHeader balances={balances}></AccountBalanceHeader>
      <TokenBalanceRowList>
        {balances.length > 0
          ? balances
              .sort((a, b) => {
                return (
                  b.balance * Number(b.token.nativeQuote) * Number(nativeToken.nativeToken?.usdPrice) -
                  a.balance * Number(a.token.nativeQuote) * Number(nativeToken.nativeToken?.usdPrice)
                );
              })
              .map((balance) => (
                <TokenBalanceRow key={`token-balance-row-${balance.id}`} balance={balance}></TokenBalanceRow>
              ))
          : Array.from({ length: 5 }).map((_, i) => (
              <TokenBalanceRow key={`token-balance-row-skeleton-${i}`}></TokenBalanceRow>
            ))}
      </TokenBalanceRowList>
    </Balance>
  );
}
