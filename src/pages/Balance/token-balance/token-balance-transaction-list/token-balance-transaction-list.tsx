import React, { useEffect, useMemo, useState } from 'react';
import { apiUrl } from 'configs/server';
import { useActiveWeb3React } from 'hooks';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import styled from 'styled-components';
import { PairTransaction } from 'models/schema';
import Balance from 'pages/Balance/balance';
import TokenBalanceTransactionRow from './token-balance-transaction-row';
import { transparentize } from 'polished';
import { HideUltraSmall } from 'components/Hide/hide-ultra-small';
import { useSocket } from 'hooks/useSocket';
import { useToken } from 'apis/token-api';

const BackLink = styled(Link)`
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 0.5em;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};
  &:hover {
    color: ${({ theme }) => theme.text2};
  }
`;

const TransactionListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1em;
  padding: 2em 1em;
`;

const TransactionFilterContainer = styled.div`
  display: flex;
  gap: 1em;
  width: 100%;
  justify-content: start;
`;

const TransactionFilterButton = styled.button<{ active?: boolean }>`
  padding: 0.5em 1em;
  border-radius: 10px;
  cursor: pointer;
  color: ${({ theme, active }) => (active ? 'white' : theme.text1)};
  background-color: ${({ theme, active }) => (active ? theme.blue2 : theme.bg1)};
  box-shadow: 0 0 5px skyblue;
  border: none;
  &:hover {
    background-color: ${({ theme }) => transparentize(0.4, theme.blue2)};
    color: white;
  }
`;

type TransactionFilter = 'all' | 'buys' | 'sells' | 'gains' | 'loss';

export default function TokenBalanceTransactionList({
  match: {
    params: { tokenAddress },
  },
}: Readonly<RouteComponentProps<{ tokenAddress: string }>>) {
  const web3 = useActiveWeb3React();
  const { token } = useToken(tokenAddress);
  const [transactions, setTransactions] = useState<PairTransaction[]>([]);
  useEffect(() => {
    if (!web3.account) {
      return;
    }
    const fetchInfo = () => {
      return fetch(`${apiUrl}/pair_transactions/tokens/${tokenAddress}/${web3.account}`)
        .then((res) => res.json())
        .then((d) => setTransactions(d))
        .catch((e) => {
          console.error(e);
        });
    };
    fetchInfo();
  }, [tokenAddress, web3]);
  const socket = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }
    const channelId = `tokens/${tokenAddress}/transactions`;
    const onUpdate = (data: PairTransaction) => {
      if (data.transaction.fromAddress.address.toLowerCase() !== web3.account?.toLowerCase()) {
        return;
      }
      setTransactions((transactions) => {
        const newTransactions = [data, ...transactions];
        return newTransactions;
      });
    };
    socket.on(channelId, onUpdate);
    return () => {
      socket.off(channelId, onUpdate);
    };
  }, [socket, tokenAddress, web3.account]);
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const filteredTransactions = useMemo(() => {
    if (filter === 'all') {
      return transactions.filter((transaction) => transaction.type === 'SWAP');
    }
    if (filter === 'buys') {
      return transactions.filter((transaction) => transaction.type === 'SWAP');
    }
    if (filter === 'sells') {
      return transactions.filter((transaction) => transaction.type === 'SWAP');
    }
    if (filter === 'gains') {
      return transactions.filter((transaction) => transaction.type === 'SWAP');
    }
    if (filter === 'loss') {
      return transactions.filter((transaction) => transaction.type === 'SWAP');
    }
    return transactions;
  }, [filter, transactions]);
  return (
    <Balance>
      <BackLink to={`/balance/${tokenAddress}`}>
        <ChevronLeft size={25}></ChevronLeft>
      </BackLink>
      <TransactionListContainer>
        <TransactionFilterContainer>
          <TransactionFilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </TransactionFilterButton>
          <HideUltraSmall>
            <TransactionFilterButton active={filter === 'buys'} onClick={() => setFilter('buys')}>
              Buys
            </TransactionFilterButton>
          </HideUltraSmall>
          <HideUltraSmall>
            <TransactionFilterButton active={filter === 'sells'} onClick={() => setFilter('sells')}>
              Sells
            </TransactionFilterButton>
          </HideUltraSmall>
          <TransactionFilterButton active={filter === 'gains'} onClick={() => setFilter('gains')}>
            Gains
          </TransactionFilterButton>
          <TransactionFilterButton active={filter === 'loss'} onClick={() => setFilter('loss')}>
            Loss
          </TransactionFilterButton>
        </TransactionFilterContainer>
        {token &&
          filteredTransactions.map((transaction) => (
            <TokenBalanceTransactionRow key={transaction.id} token={token} transaction={transaction} />
          ))}
      </TransactionListContainer>
    </Balance>
  );
}
