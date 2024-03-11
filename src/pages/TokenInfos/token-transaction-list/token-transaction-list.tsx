import { TokenModel } from 'models/TokenModel';
import React, { useEffect, useState } from 'react';
import { TokenInfosCard } from '../token-infos-card';
import Column from 'components/Column';
import { PairTransactionModel } from 'models/PairTransactionModel';
import TokenTransactionRow from './token-transaction-row/token-transaction-row';
import { HideSmall, Fonts } from 'theme';
import { TokenTransactionListGrid } from './token-transaction-list-grid';
import styled from 'styled-components';
import Paginator from 'components/Paginator/Paginator';
import { HideMedium } from 'components/Hide/hide-medium';
import { apiUrl } from 'configs/server';
export const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.bg3};
`;

export const RowDivider = styled(Divider)`
  height: 1px;
`;
export default function TokenTransactionList({ token }: { token?: TokenModel }) {
  const elementsPerPage = 10;
  const [transactions, setTransactions] = useState<PairTransactionModel[]>([]);
  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchInfo = () => {
      return fetch(`${apiUrl}/pair_transactions/tokens/${token.address}`)
        .then((res) => res.json())
        .then((d) => setTransactions(d))
        .catch((e) => {
          console.error(e);
        });
    };
    fetchInfo();
  }, [token]);
  const [page, setPage] = useState(1);
  return (
    <Column style={{ width: '100%' }}>
      <h1>Transactions</h1>
      <TokenInfosCard>
        <TokenTransactionListGrid>
          <Fonts.blue fontWeight={500}></Fonts.blue>
          <HideSmall>
            <Fonts.blue fontWeight={500}>Total value</Fonts.blue>
          </HideSmall>
          <HideMedium>
            <Fonts.blue fontWeight={500}>Buy</Fonts.blue>
          </HideMedium>
          <HideMedium>
            <Fonts.blue fontWeight={500}>Sell</Fonts.blue>
          </HideMedium>
          <HideSmall>
            <Fonts.blue fontWeight={500}>Account</Fonts.blue>
          </HideSmall>
          <Fonts.blue fontWeight={500}>Time</Fonts.blue>
        </TokenTransactionListGrid>
        <Divider></Divider>
        {transactions.length > 0
          ? transactions.slice((page - 1) * elementsPerPage, page * elementsPerPage).map((transaction) => (
              <Column key={`token-transaction-row-${transaction.id}`} style={{ gap: '1em' }}>
                <TokenTransactionRow token={token} pairTransaction={transaction}></TokenTransactionRow>
                <RowDivider></RowDivider>
              </Column>
            ))
          : Array.from({ length: 10 }).map((_, index) => (
              <Column key={`skeleton-token-transaction-row-${index}`} style={{ gap: '1em' }}>
                <TokenTransactionRow></TokenTransactionRow>
                <RowDivider />
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
