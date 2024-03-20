import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import TokenPairList from './token-pair-list/token-pair-list';
import TokenStatContainer from './token-stats/token-stat-container';
import TokenTransactionList from './token-transaction-list/token-transaction-list';
import Column from 'components/Column';
import TokenInfosHeader from './token-infos-header/token-infos-header';
import { apiUrl } from 'configs/server';
import { Pair, Token } from 'models/schema';

export default function TokenInfos({
  match: {
    params: { address },
  },
}: Readonly<RouteComponentProps<{ address: string }>>) {
  const [token, setToken] = useState<Token | undefined>(undefined);
  useEffect(() => {
    const fetchInfo = () => {
      return fetch(`${apiUrl}/tokens/address/${address}`)
        .then((res) => res.json())
        .then((d) => setToken(d))
        .catch((e) => {
          console.error(e);
        });
    };
    fetchInfo();
  }, [address]);
  const [pairs, setPairs] = useState<Pair[]>([]);
  useEffect(() => {
    const fetchInfo = () => {
      return fetch(`${apiUrl}/pairs/tokens/${address}`)
        .then((res) => res.json())
        .then((d) => setPairs(d))
        .catch((e) => {
          console.error(e);
        });
    };
    fetchInfo();
  }, [address]);
  return (
    <Column style={{ gap: '3em', width: '100%', maxWidth: '1200px', alignItems: 'center', padding: '1em' }}>
      <TokenInfosHeader token={token}></TokenInfosHeader>
      <TokenStatContainer token={token} pairs={pairs}></TokenStatContainer>
      <TokenTransactionList token={token}></TokenTransactionList>
      <TokenPairList token={token} pairs={pairs}></TokenPairList>
    </Column>
  );
}
