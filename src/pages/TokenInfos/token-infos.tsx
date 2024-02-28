import CurrencyLogo from 'components/CurrencyLogo';
import Row from 'components/Row';
import { TokenModel } from 'models/TokenModel';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TYPE } from 'theme';
import { useDefaultTokens } from 'hooks/Tokens';
import { Link, RouteComponentProps } from 'react-router-dom';
import TokenPairList from './token-pair-list/token-pair-list';
import TokenStatContainer from './token-stats/token-stat-container';
import TokenTransactionList from './token-transaction-list/token-transaction-list';
import Column from 'components/Column';
import TokenInfosHeader from './token-infos-header/token-infos-header';

export default function TokenInfos({
  match: {
    params: { address },
  },
}: Readonly<RouteComponentProps<{ address: string }>>) {
  const [token, setToken] = useState<TokenModel | undefined>(undefined);
  const fetchInfo = () => {
    return fetch('http://162.0.211.141:4000/api/tokens/address/' + address)
      .then((res) => res.json())
      .then((d) => setToken(d));
  };
  useEffect(() => {
    fetchInfo();
  }, []);
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
