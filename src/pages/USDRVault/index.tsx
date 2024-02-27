import { ChainId, CurrencyAmount, Token } from '@retherswap/sdk';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { AutoColumn } from '../../components/Column';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import { useActiveWeb3React } from '../../hooks';
import { useCurrency, useAllTokens } from '../../hooks/Tokens';
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback';
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback';
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks';
import { Field } from '../../state/swap/actions';
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import { useExpertModeManager, useUserSlippageTolerance } from '../../state/user/hooks';
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
import USDRVaultHeader from 'components/USDRVault/USDRVaultHeader';
export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`;

export default function USDRVault() {
  return (
    <>
      <SwapPoolTabs active={'swap'} />
      <AppBody>
        <USDRVaultHeader />
        <Wrapper id="usdr-vault-page"></Wrapper>
      </AppBody>
    </>
  );
}
