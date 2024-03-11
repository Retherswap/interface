import React, { useMemo } from 'react';
import { PairTransactionModel } from 'models/PairTransactionModel';
import { HideSmall, Fonts } from 'theme';
import { TokenTransactionListGrid } from '../token-transaction-list-grid';
import styled from 'styled-components';
import { formatNumber } from 'utils/formatNumber';
import { formatAddress } from 'utils/formatAddress';
import { TokenModel } from 'models/TokenModel';
import { Circle } from 'react-feather';
import Row from 'components/Row';
import { HideMedium } from 'components/Hide/hide-medium';
import FullWidthSkeleton from 'components/Skeleton/full-width-skeleton';

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
  token?: TokenModel;
  pairTransaction?: PairTransactionModel;
}) {
  const timeAgo = useMemo(() => {
    if (!pairTransaction) {
      return undefined;
    }
    let time: string | number =
      (new Date().getTime() - new Date(pairTransaction.transaction.createdAt).getTime()) / 1000 / 60;
    if (time < 60) {
      const value = Math.floor(time);
      time = `${value} minute${value > 1 ? 's' : ''} ago`;
    } else if (time < 60 * 24) {
      const value = Math.floor(time / 60);
      time = `${value} hour${value > 1 ? 's' : ''} ago`;
    } else {
      const value = Math.floor(time / 60 / 24);
      time = `${value} day${value > 1 ? 's' : ''} ago`;
    }
    return time;
  }, [pairTransaction]);
  const inputToken = useMemo(() => {
    if (!pairTransaction) {
      return undefined;
    }
    return Number(pairTransaction.inputAmount).toFixed(2);
  }, [pairTransaction]);
  const outputToken = useMemo(() => {
    if (!pairTransaction) {
      return undefined;
    }
    return Number(pairTransaction.outputAmount).toFixed(2);
  }, [pairTransaction]);
  const buy = useMemo(() => {
    if (!pairTransaction || !token) {
      return undefined;
    }
    return (
      (pairTransaction.type === 'SWAP' && pairTransaction.outputToken.id === token.id) ||
      pairTransaction.type === 'ADD_LIQUIDITY'
    );
  }, [pairTransaction, token]);
  return (
    <TokenTransactionListGrid>
      {pairTransaction && token ? (
        <StyledLink href={`https://explorer.hypra.network/tx/${pairTransaction.transaction.txHash}`} target="_blank">
          <Row style={{ gap: '5px' }}>
            <>
              <Circle fill={buy ? 'green' : 'red'} color="transparent" size={7} />
              <Fonts.black fontSize={14} fontWeight={500}>
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
              </Fonts.black>
            </>
          </Row>
        </StyledLink>
      ) : (
        <FullWidthSkeleton width="75%"></FullWidthSkeleton>
      )}
      <HideSmall>
        {pairTransaction ? (
          <Fonts.black fontSize={14} fontWeight={500}>
            $
            {formatNumber(
              Number(inputToken) *
                Number(pairTransaction.inputTokenUsdQuote) *
                (pairTransaction.type !== 'SWAP' ? 2 : 1)
            )}
          </Fonts.black>
        ) : (
          <FullWidthSkeleton width="75%"></FullWidthSkeleton>
        )}
      </HideSmall>
      <HideMedium>
        {pairTransaction ? (
          <Fonts.black fontSize={14} fontWeight={500}>
            {formatNumber(outputToken)} {pairTransaction.outputToken.symbol}
          </Fonts.black>
        ) : (
          <FullWidthSkeleton width="75%"></FullWidthSkeleton>
        )}
      </HideMedium>
      <HideMedium>
        {pairTransaction ? (
          <Fonts.black fontSize={14} fontWeight={500}>
            {formatNumber(inputToken)} {pairTransaction.inputToken.symbol}
          </Fonts.black>
        ) : (
          <FullWidthSkeleton width="75%"></FullWidthSkeleton>
        )}
      </HideMedium>
      <HideSmall>
        {pairTransaction ? (
          <StyledLink
            href={`https://explorer.hypra.network/address/${pairTransaction.transaction.fromAddress.address}`}
            target="_blank"
          >
            <Fonts.blue2 fontSize={14} fontWeight={700}>
              {formatAddress(pairTransaction.transaction.fromAddress.address)}
            </Fonts.blue2>
          </StyledLink>
        ) : (
          <FullWidthSkeleton width="75%"></FullWidthSkeleton>
        )}
      </HideSmall>
      {timeAgo ? (
        <Fonts.black fontSize={14} fontWeight={500}>
          {timeAgo}
        </Fonts.black>
      ) : (
        <FullWidthSkeleton width="75%"></FullWidthSkeleton>
      )}
    </TokenTransactionListGrid>
  );
}
