import { Trade, TradeType } from '@retherswap/sdk';
import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Field } from '../../state/swap/actions';
import { useUserSlippageTolerance } from '../../state/user/hooks';
import { Fonts } from '../../theme';
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices';
import { AutoColumn } from '../Column';
import QuestionHelper from '../QuestionHelper';
import { RowBetween, RowFixed } from '../Row';
import FormattedPriceImpact from './FormattedPriceImpact';
import SwapRoute from './SwapRoute';

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const theme = useContext(ThemeContext);
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade);
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT;
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage);

  return (
    <>
      <AutoColumn style={{ padding: '0 16px' }}>
        <RowBetween>
          <RowFixed>
            <Fonts.black fontSize={14} fontWeight={400} color={theme.text2}>
              {isExactIn ? 'Minimum received' : 'Maximum sold'}
            </Fonts.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <Fonts.black color={theme.text1} fontSize={14}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                  '-'}
            </Fonts.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Fonts.black fontSize={14} fontWeight={400} color={theme.text2}>
              Price Impact
            </Fonts.black>
            <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
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
          <Fonts.black fontSize={14} color={theme.text1}>
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Fonts.black>
        </RowBetween>
      </AutoColumn>
    </>
  );
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade;
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext);

  const [allowedSlippage] = useUserSlippageTolerance();

  const showRoute = Boolean(trade && trade.route.path.length > 2);

  return (
    <AutoColumn gap="0px">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <RowBetween style={{ padding: '0 16px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Fonts.black fontSize={14} fontWeight={400} color={theme.text2}>
                    Route
                  </Fonts.black>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )}
        </>
      )}
    </AutoColumn>
  );
}
