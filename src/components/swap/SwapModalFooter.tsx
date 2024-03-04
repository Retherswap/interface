import { Trade, TradeType } from '@retherswap/sdk';
import React, { useContext, useMemo, useState } from 'react';
import { Repeat } from 'react-feather';
import { Text } from 'rebass';
import { ThemeContext } from 'styled-components';
import { Field } from '../../state/swap/actions';
import { Fonts } from '../../theme';
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from '../../utils/prices';
import { ButtonError } from '../Button';
import { AutoColumn } from '../Column';
import QuestionHelper from '../QuestionHelper';
import { AutoRow, RowBetween, RowFixed } from '../Row';
import FormattedPriceImpact from './FormattedPriceImpact';
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds';

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade;
  allowedSlippage: number;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  disabledConfirm: boolean;
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const theme = useContext(ThemeContext);
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    allowedSlippage,
    trade,
  ]);
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade]);
  const severity = warningSeverity(priceImpactWithoutFee);

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={14} color={theme.text2}>
            Price
          </Text>
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme.text1}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <Repeat size={14} />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Fonts.black fontSize={14} fontWeight={400} color={theme.text2}>
              {trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
            </Fonts.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <Fonts.black fontSize={14}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </Fonts.black>
            <Fonts.black fontSize={14} marginLeft={'4px'}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </Fonts.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Fonts.black color={theme.text2} fontSize={14} fontWeight={400}>
              Price Impact
            </Fonts.black>
            <QuestionHelper text="The difference between the market price and your price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Fonts.black fontSize={14} fontWeight={400} color={theme.text2}>
              Liquidity Provider Fee
            </Fonts.black>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <Fonts.black fontSize={14}>
            {realizedLPFee ? realizedLPFee?.toSignificant(6) + ' ' + trade.inputAmount.currency.symbol : '-'}
          </Fonts.black>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          error={severity > 2}
          style={{ margin: '10px 0 0 0' }}
          id="confirm-swap-or-send"
        >
          <Text fontSize={20} fontWeight={500}>
            {severity > 2 ? 'Swap Anyway' : 'Confirm Swap'}
          </Text>
        </ButtonError>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  );
}
