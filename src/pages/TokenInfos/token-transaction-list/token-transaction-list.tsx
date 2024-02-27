import { TokenModel } from 'models/TokenModel';
import React, { useEffect, useState } from 'react';
import { useDefaultTokens } from 'hooks/Tokens';
import { TokenInfosCard } from '../token-infos-card';
import Column from 'components/Column';
import { PairTransactionModel } from 'models/PairTransactionModel';
import TokenTransactionRow from './token-transaction-row/token-transaction-row';
import { TYPE } from 'theme';
import { TokenTransactionListGrid } from './token-transaction-list-grid';
import styled from 'styled-components';
import Paginator from 'components/Paginator/Paginator';
export const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.bg3};
`;

export const RowDivider = styled(Divider)`
  height: 1px;
`;
export default function TokenTransactionList({ token }: { token: TokenModel }) {
  const elementsPerPage = 10;
  const [transactions, setTransactions] = useState<PairTransactionModel[]>([]);
  const fetchInfo = () => {
    return fetch('http://162.0.211.141:4000/api/pair_transactions/tokens/' + token.address)
      .then((res) => res.json())
      .then((d) => setTransactions(d));
  };
  useEffect(() => {
    fetchInfo();
  }, []);
  const [page, setPage] = useState(1);
  return (
    <Column style={{ width: '100%' }}>
      <h1>Transactions</h1>
      <TokenInfosCard>
        <TokenTransactionListGrid>
          <TYPE.blue fontWeight={500}></TYPE.blue>
          <TYPE.blue fontWeight={500}>Total value</TYPE.blue>
          <TYPE.blue fontWeight={500}>Buy</TYPE.blue>
          <TYPE.blue fontWeight={500}>Sell</TYPE.blue>
          <TYPE.blue fontWeight={500}>Account</TYPE.blue>
          <TYPE.blue fontWeight={500}>Time</TYPE.blue>
        </TokenTransactionListGrid>
        <Divider></Divider>
        {transactions.slice((page - 1) * elementsPerPage, page * elementsPerPage).map((transaction) => (
          <Column key={`token-transaction-row-${transaction.id}`} style={{ gap: '1em' }}>
            <TokenTransactionRow pairTransaction={transaction}></TokenTransactionRow>
            <RowDivider></RowDivider>
          </Column>
        ))}
        <Paginator
          page={page}
          elementsPerPage={elementsPerPage}
          count={transactions.length}
          onPageChange={(page) => {
            setPage(page);
          }}
        ></Paginator>
      </TokenInfosCard>
    </Column>
  );
}
