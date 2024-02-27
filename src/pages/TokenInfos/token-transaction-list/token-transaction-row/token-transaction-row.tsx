import React from 'react';
import { useDefaultTokens } from 'hooks/Tokens';
import { PairTransactionModel } from 'models/PairTransactionModel';
import { TYPE } from 'theme';
import { TokenTransactionListGrid } from '../token-transaction-list-grid';
import styled from 'styled-components';
import { formatNumber } from 'utils/formatNumber';

export const StyledLink = styled('a')`
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    color: ${({ theme }) => theme.blue2};
  }
`;

export default function TokenTransactionRow({ pairTransaction }: { pairTransaction: PairTransactionModel }) {
  let timeAgo = '';
  let time = (new Date().getTime() - new Date(pairTransaction.transaction.createdAt).getTime()) / 1000 / 60;
  if (time < 60) {
    const value = Math.floor(time);
    timeAgo = `${value} minute${value > 1 ? 's' : ''} ago`;
  } else if (time < 60 * 24) {
    const value = Math.floor(time / 60);
    timeAgo = `${value} hour${value > 1 ? 's' : ''} ago`;
  } else {
    const value = Math.floor(time / 60 / 24);
    timeAgo = `${value} day${value > 1 ? 's' : ''} ago`;
  }
  const inputToken = Number(pairTransaction.inputAmount).toFixed(2);
  const outputToken = Number(pairTransaction.outputAmount).toFixed(2);
  return (
    <TokenTransactionListGrid>
      <StyledLink href={`https://explorer.hypra.network/tx/${pairTransaction.transaction.txHash}`} target="_blank">
        <TYPE.black fontSize={14} fontWeight={500}>
          {pairTransaction.type === 'SWAP' && (
            <>
              Swap {pairTransaction.inputToken.symbol} for {pairTransaction.outputToken.symbol}
            </>
          )}
          {pairTransaction.type === 'ADD_LIQUIDITY' && (
            <>
              Add {pairTransaction.inputToken.symbol} and {pairTransaction.outputToken.symbol}
            </>
          )}
          {pairTransaction.type === 'REMOVE_LIQUIDITY' && (
            <>
              Remove {pairTransaction.inputToken.symbol} and {pairTransaction.outputToken.symbol}
            </>
          )}
        </TYPE.black>
      </StyledLink>
      <TYPE.black fontSize={14} fontWeight={500}>
        $
        {formatNumber(
          Number(inputToken) * Number(pairTransaction.inputTokenUsdQuote) * (pairTransaction.type !== 'SWAP' ? 2 : 1)
        )}
      </TYPE.black>
      <TYPE.black fontSize={14} fontWeight={500}>
        {formatNumber(outputToken)} {pairTransaction.outputToken.symbol}
      </TYPE.black>
      <TYPE.black fontSize={14} fontWeight={500}>
        {formatNumber(inputToken)} {pairTransaction.inputToken.symbol}
      </TYPE.black>
      <StyledLink href={`https://explorer.hypra.network/address/${pairTransaction.transaction.from}`} target="_blank">
        <TYPE.blue2 fontSize={14} fontWeight={700}>
          {pairTransaction.transaction.from.slice(0, 6)}
          {'...'}
          {pairTransaction.transaction.from.slice(-4, pairTransaction.transaction.from.length)}
        </TYPE.blue2>
      </StyledLink>
      <TYPE.black fontSize={14} fontWeight={500}>
        {timeAgo}
      </TYPE.black>
    </TokenTransactionListGrid>
  );
}
