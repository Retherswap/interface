import { TokenModel } from 'models/TokenModel';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import TokenPairList from './token-pair-list/token-pair-list';
import TokenStatContainer from './token-stats/token-stat-container';
import TokenTransactionList from './token-transaction-list/token-transaction-list';
import Column from 'components/Column';
import TokenInfosHeader from './token-infos-header/token-infos-header';
import { apiUrl } from 'configs/server';

export default function TokenInfos({
  match: {
    params: { address },
  },
}: Readonly<RouteComponentProps<{ address: string }>>) {
  const [token, setToken] = useState<TokenModel | undefined>(undefined);

  useEffect(() => {
    const fetchInfo = () => {
      return fetch(`${apiUrl}/tokens/address/${address}`)
        .then((res) => res.json())
        .then((d) => setToken(d));
    };
    fetchInfo();
  }, [address]);
  return (
    <Column style={{ gap: '4em', width: '100%', maxWidth: '1200px', alignItems: 'center', padding: '1em' }}>
      {token && (
        <>
          <TokenInfosHeader token={token}></TokenInfosHeader>
          <TokenStatContainer token={token}></TokenStatContainer>
          <TokenPairList token={token}></TokenPairList>
          <TokenTransactionList token={token}></TokenTransactionList>
        </>
      )}
    </Column>
  );
}
