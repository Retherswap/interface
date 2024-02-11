import { ChainId, CurrencyAmount, JSBI, Token, Trade } from '@retherswap/sdk';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { AutoColumn } from '../../components/Column';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee';
import { useActiveWeb3React } from '../../hooks';
import { useCurrency, useAllTokens } from '../../hooks/Tokens';
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback';
import { useSwapCallback } from '../../hooks/useSwapCallback';
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback';
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks';
import { Field } from '../../state/swap/actions';
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import { useExpertModeManager, useUserSlippageTolerance, useUserSingleHopOnly } from '../../state/user/hooks';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices';
import AppBody from '../AppBody';
import BridgeCurrencyInputPanel from 'components/Bridge/BridgeCurrencyInputPanel';
import BridgeHeader from 'components/Bridge/BridgeHeader';
import { AutoRow, RowBetween } from 'components/Row';
import { ArrowDown } from 'react-feather';
import { ArrowWrapper } from 'components/swap/styleds';
import { TYPE } from 'theme';
import { ButtonPrimary } from 'components/Button';
import { L1ChainInfo } from 'constants/chains';
export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`;

export default function Bridge() {
  const loadedUrlParams = useDefaultsFromURLSearch();

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false);
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens();
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens);
    });

  const { account } = useActiveWeb3React();
  const theme = useContext(ThemeContext);

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // for expert mode
  const toggleSettings = useToggleSettingsMenu();
  const [isExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance();

  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo();
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const trade = showWrap ? undefined : v2Trade;

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      };

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  const [approval] = useApproveCallbackFromTrade(trade, allowedSlippage);

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput));

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);
  const [inputNetwork, setInputNetwork] = useState<number>(ChainId.HYPRA);
  const [outputNetwork, setOutputNetwork] = useState<number>(ChainId.ETHEREUM);

  const handleInputNetworkSelect = useCallback(
    (network: number) => {
      setInputNetwork(network);
    },
    [setInputNetwork]
  );

  const handleOutputNetworkSelect = useCallback(
    (network: number) => {
      setOutputNetwork(network);
    },
    [setOutputNetwork]
  );

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact());
  }, [maxAmountInput, onUserInput]);

  return (
    <>
      <SwapPoolTabs active={'swap'} />
      <AppBody>
        <BridgeHeader />
        <Wrapper id="bridge-page">
          <AutoColumn style={{ gap: '2.25rem' }}>
            <BridgeCurrencyInputPanel
              label={independentField === Field.OUTPUT && !showWrap && trade ? 'From (estimated)' : 'From'}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={!atMaxAmountInput}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              selectedNetwork={inputNetwork}
              otherNetwork={outputNetwork}
              onNetworkSelect={handleInputNetworkSelect}
              id="swap-currency-input"
            ></BridgeCurrencyInputPanel>
            <AutoColumn justify="space-between">
              <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                <ArrowWrapper clickable>
                  <ArrowDown
                    size="32"
                    color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.primary1 : theme.text2}
                  />
                </ArrowWrapper>
              </AutoRow>
            </AutoColumn>
            <BridgeCurrencyInputPanel
              label={independentField === Field.OUTPUT && !showWrap && trade ? 'From (estimated)' : 'From'}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={!atMaxAmountInput}
              currency={currencies[Field.INPUT]}
              selectedNetwork={outputNetwork}
              otherNetwork={inputNetwork}
              onNetworkSelect={handleOutputNetworkSelect}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id="swap-currency-output"
            ></BridgeCurrencyInputPanel>
            <AutoColumn style={{ gap: '0.65rem' }}>
              <RowBetween>
                <TYPE.black fontWeight={500} fontSize={13}>
                  Gas on destination
                </TYPE.black>
                <TYPE.black fontWeight={500} fontSize={13}>
                  Add
                </TYPE.black>
              </RowBetween>
              <RowBetween>
                <TYPE.black fontWeight={500} fontSize={13}>
                  You will receive
                </TYPE.black>
                <TYPE.black fontWeight={500} fontSize={13}>
                  100 RETHER
                </TYPE.black>
              </RowBetween>
              <RowBetween>
                <TYPE.black fontWeight={500} fontSize={13}>
                  Fee
                </TYPE.black>
                <TYPE.black fontWeight={500} fontSize={13}>
                  15.00 USD
                </TYPE.black>
              </RowBetween>
              <RowBetween>
                <TYPE.black fontWeight={500} fontSize={13}>
                  Slippage tolerance
                </TYPE.black>
                <TYPE.black fontWeight={500} fontSize={13}>
                  2.5%
                </TYPE.black>
              </RowBetween>
            </AutoColumn>
            <ButtonPrimary>Bridge tokens</ButtonPrimary>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  );
}
