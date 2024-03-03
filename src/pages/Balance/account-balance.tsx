import React, { useEffect, useState } from 'react';
import Column from 'components/Column';
import { useActiveWeb3React } from 'hooks/web3';
import { useNativeToken } from 'hooks/useNativeToken';
import { BalanceModel } from 'models/BalanceModel';
import TokenBalance from './token-balance';

export default function AccountBalance() {
  const web3 = useActiveWeb3React();
  const [balances, setBalances] = useState<BalanceModel[]>([]);
  const fetchInfo = () => {
    return fetch('http://162.0.211.141:4000/api/v1/balances/address/' + web3.account)
      .then((res) => res.json())
      .then((d) => setBalances(d));
  };
  useEffect(() => {
    fetchInfo();
  }, []);
  const nativeToken = useNativeToken();
  const totalBalance = balances.reduce((acc, balance) => {
    return acc + balance.balance * Number(balance.token.nativeQuote) * Number(nativeToken.nativeToken?.usdPrice);
  }, 0);
  return (
    <Column style={{ gap: '0.5em', width: '100%', maxWidth: '600px', alignItems: 'center', padding: '1em' }}>
      {totalBalance}
      {balances
        .sort((a, b) => {
          return (
            b.balance * Number(b.token.nativeQuote) * Number(nativeToken.nativeToken?.usdPrice) -
            a.balance * Number(a.token.nativeQuote) * Number(nativeToken.nativeToken?.usdPrice)
          );
        })
        .map((balance) => (
          <TokenBalance key={`token-balance-${balance.id}`} balance={balance}></TokenBalance>
        ))}
    </Column>
  );
}
