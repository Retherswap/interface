import Row from 'components/Row';
import React from 'react';
import styled from 'styled-components';
import { Fonts } from 'theme';
import { formatNumber } from 'utils/formatNumber';
import { PairTransaction } from 'models/schema';
import DoubleCurrencyLogo from 'components/DoubleLogo';
import { HideSmall } from 'components/Hide/hide-small';
import { useCurrency } from 'hooks/useCurrency';

const TransactionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 0.75em 1.25em;
  border-radius: 1.5em;
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
`;

export default function DexStatsTransactionRow({ transaction }: { transaction: PairTransaction }) {
  const inputCurrency = useCurrency(transaction.inputToken.address);
  const outputCurrency = useCurrency(transaction.outputToken.address);
  return (
    <TransactionRow>
      <DoubleCurrencyLogo currency0={inputCurrency} currency1={outputCurrency} size={35} />
      <Fonts.black fontSize={18}>
        <Row style={{ gap: '5px' }}>
          <HideSmall>
            {transaction.inputToken.symbol}/{transaction.outputToken.symbol} :
          </HideSmall>
          $
          {formatNumber(Number(transaction.inputTokenUsdQuote) * Number(transaction.inputAmount), {
            reduce: false,
          })}
        </Row>
      </Fonts.black>
    </TransactionRow>
  );
}
