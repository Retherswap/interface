import React from 'react';
import { useDefaultTokens } from 'hooks/Tokens';
import { PairTransactionModel } from 'models/PairTransactionModel';
import { HideSmall, TYPE } from 'theme';
import { TokenTransactionListGrid } from '../token-transaction-list-grid';
import styled from 'styled-components';
import { formatNumber } from 'utils/formatNumber';
import { formatAddress } from 'utils/formatAddress';
import { TokenModel } from 'models/TokenModel';
import { Circle } from 'react-feather';
import Row from 'components/Row';
import { HideMedium } from 'components/Hide/hide-medium';

export const StyledLink = styled('a')`
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    color: ${({ theme }) => theme.blue2};
  }
`;

export default function TokenTransactionRow({
  token,
  pairTransaction,
}: {
  token: TokenModel;
  pairTransaction: PairTransactionModel;
}) {
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
  const buy =
    (pairTransaction.type === 'SWAP' && pairTransaction.outputToken.id === token.id) ||
    pairTransaction.type === 'ADD_LIQUIDITY';
  return (
    <TokenTransactionListGrid>
      <StyledLink href={`https://explorer.hypra.network/tx/${pairTransaction.transaction.txHash}`} target="_blank">
        <Row style={{ gap: '5px' }}>
          <Circle fill={buy ? 'green' : 'red'} color="transparent" size={7} />
          <TYPE.black fontSize={14} fontWeight={500}>
            {pairTransaction.type === 'SWAP' && (
              <>
                {pairTransaction.inputToken.id === token.id ? 'Sell' : 'Buy'}{' '}
                {buy ? pairTransaction.outputToken.symbol : pairTransaction.inputToken.symbol}{' '}
                {pairTransaction.inputToken.id === token.id ? 'for' : 'with'}{' '}
                {buy ? pairTransaction.inputToken.symbol : pairTransaction.outputToken.symbol}
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
        </Row>
      </StyledLink>
      <HideSmall>
        <TYPE.black fontSize={14} fontWeight={500}>
          $
          {formatNumber(
            Number(inputToken) * Number(pairTransaction.inputTokenUsdQuote) * (pairTransaction.type !== 'SWAP' ? 2 : 1)
          )}
        </TYPE.black>
      </HideSmall>
      <HideMedium>
        <TYPE.black fontSize={14} fontWeight={500}>
          {formatNumber(outputToken)} {pairTransaction.outputToken.symbol}
        </TYPE.black>
      </HideMedium>
      <HideMedium>
        <TYPE.black fontSize={14} fontWeight={500}>
          {formatNumber(inputToken)} {pairTransaction.inputToken.symbol}
        </TYPE.black>
      </HideMedium>
      <HideSmall>
        <StyledLink href={`https://explorer.hypra.network/address/${pairTransaction.transaction.from}`} target="_blank">
          <TYPE.blue2 fontSize={14} fontWeight={700}>
            {formatAddress(pairTransaction.transaction.from)}
          </TYPE.blue2>
        </StyledLink>
      </HideSmall>
      <TYPE.black fontSize={14} fontWeight={500}>
        {timeAgo}
      </TYPE.black>
    </TokenTransactionListGrid>
  );
}
