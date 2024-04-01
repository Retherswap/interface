import React, { useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { PairTransaction, Token } from 'models/schema';
import { formatNumber } from 'utils/formatNumber';
import { Fonts } from 'theme';
import { transparentize } from 'polished';
import { useNativeToken } from 'hooks/useNativeToken';

const TransactionRow = styled.div`
  display: flex;
  width: 100%;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 10px;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  :hover {
    background-color: ${({ theme }) => transparentize(0.1, theme.bg2)};
  }
`;

const TransactionContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.25em;
  width: 100%;
  align-items: center;
  padding: 0.4em 1em;
`;

const TransactionInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25em;
`;

const TransactionAmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25em;
`;

const TransactionExtraInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.4em 1em;
`;

const TradeBanner = styled.div<{ color: string }>`
  width: 10px;
  height: 100%;
  background-color: ${({ color }) => color};
`;

const Divider = styled.div`
  border: 1px solid ${({ theme }) => transparentize(0.5, theme.text4)};
  width: 100%;
`;

export default function TokenBalanceTransactionRow({
  token,
  transaction,
}: {
  token: Token;
  transaction: PairTransaction;
}) {
  const { nativeToken } = useNativeToken();
  const theme = useTheme();
  const transactionType = useMemo(() => {
    if (!transaction || !token) {
      return 'Unknown';
    }
    if (transaction.type === 'SWAP') {
      if (transaction.inputToken.address.address.toLowerCase() === token.address.address.toLowerCase()) {
        return 'Sell';
      } else {
        return 'Buy';
      }
    } else if (transaction.type === 'ADD_LIQUIDITY') {
      return 'Add Liquidity';
    } else if (transaction.type === 'REMOVE_LIQUIDITY') {
      return 'Remove Liquidity';
    }
    return 'Unknown';
  }, [transaction, token]);
  const profit = useMemo(() => {
    if (!nativeToken || !token) {
      return 0;
    }
    if (transactionType === 'Sell') {
      return (transaction.inputTokenUsdQuote - transaction.averageBuyPrice) * transaction.inputAmount;
    } else if (transactionType === 'Buy') {
      return token.nativeQuote * nativeToken.usdPrice - transaction.outputTokenUsdQuote;
    }
    return 0;
  }, [transaction, transactionType, nativeToken, token]);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TransactionRow onClick={() => setIsOpen(!isOpen)}>
      <TradeBanner color={transactionType === 'Buy' ? theme.green1 : theme.red1}></TradeBanner>
      <TransactionContent>
        <TransactionHeader>
          <TransactionInfoContainer>
            <Fonts.black fontWeight={700} fontSize={14}>
              {transactionType}
            </Fonts.black>
            <Fonts.gray fontWeight={400} fontSize={12}>
              {new Date(transaction.transaction.createdAt).toLocaleString()}
            </Fonts.gray>
          </TransactionInfoContainer>
          <TransactionAmountContainer>
            {transactionType === 'Buy' ? (
              <Fonts.green fontWeight={500} fontSize={14}>
                {formatNumber(Number(transaction.outputAmount)) + ' ' + transaction.outputToken.symbol}{' '}
              </Fonts.green>
            ) : (
              <Fonts.black fontWeight={500} fontSize={14}>
                {'-' + formatNumber(Number(transaction.inputAmount)) + ' ' + transaction.inputToken.symbol}
              </Fonts.black>
            )}

            <Fonts.gray fontWeight={400} fontSize={12}>
              {transactionType === 'Buy'
                ? '-' +
                  formatNumber(Number(transaction.outputAmount) * Number(transaction.outputTokenUsdQuote)) +
                  ' USD'
                : formatNumber(Number(transaction.inputAmount) * Number(transaction.inputTokenUsdQuote)) + ' USD'}
            </Fonts.gray>
          </TransactionAmountContainer>
        </TransactionHeader>
        {isOpen && (
          <>
            <Divider></Divider>
            <TransactionExtraInfo>
              {transactionType === 'Sell' && (
                <>
                  <Fonts.black fontWeight={400} fontSize={12}>
                    Sell price: {formatNumber(transaction.inputTokenUsdQuote)}$
                  </Fonts.black>
                  <Fonts.black fontWeight={400} fontSize={12}>
                    Average buy price: {formatNumber(transaction.averageBuyPrice)}$
                  </Fonts.black>
                  {profit >= 0 ? (
                    <Fonts.green fontWeight={400} fontSize={12}>
                      Profit:{' '}
                      {formatNumber(
                        (transaction.inputTokenUsdQuote - transaction.averageBuyPrice) * transaction.inputAmount
                      )}
                      $ (
                      {formatNumber(
                        ((transaction.inputTokenUsdQuote - transaction.averageBuyPrice) / transaction.averageBuyPrice) *
                          100
                      )}
                      %)
                    </Fonts.green>
                  ) : (
                    <Fonts.red fontWeight={400} fontSize={12}>
                      Loss:{' '}
                      {formatNumber(
                        Math.abs(
                          (transaction.inputTokenUsdQuote - transaction.averageBuyPrice) * transaction.inputAmount
                        )
                      )}
                      $ (
                      {formatNumber(
                        ((transaction.inputTokenUsdQuote - transaction.averageBuyPrice) / transaction.averageBuyPrice) *
                          100
                      )}
                      %)
                    </Fonts.red>
                  )}
                </>
              )}
              {transactionType === 'Buy' && (
                <>
                  <Fonts.black fontWeight={400} fontSize={12}>
                    Buy price: {formatNumber(transaction.outputTokenUsdQuote)}$
                  </Fonts.black>
                  <Fonts.black fontWeight={400} fontSize={12}>
                    Current price: {formatNumber(Number(token?.nativeQuote) * Number(nativeToken?.usdPrice))}$
                  </Fonts.black>
                  {profit >= 0 ? (
                    <Fonts.green fontWeight={400} fontSize={12}>
                      Profit: {formatNumber(profit * Number(transaction.outputAmount))}$ (
                      {formatNumber(
                        ((Number(token?.nativeQuote) * Number(nativeToken?.usdPrice)) /
                          Number(transaction.outputTokenUsdQuote)) *
                          100 -
                          100
                      )}
                      %)
                    </Fonts.green>
                  ) : (
                    <Fonts.red fontWeight={400} fontSize={12}>
                      Loss: {formatNumber(profit * Number(transaction.outputAmount))}$ (
                      {formatNumber(
                        (Number(transaction.outputTokenUsdQuote) /
                          (Number(token?.nativeQuote) * Number(nativeToken?.usdPrice))) *
                          100 -
                          100
                      )}
                      %)
                    </Fonts.red>
                  )}
                </>
              )}
            </TransactionExtraInfo>
          </>
        )}
      </TransactionContent>
    </TransactionRow>
  );
}
