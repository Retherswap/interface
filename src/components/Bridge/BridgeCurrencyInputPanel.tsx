import { Currency, Pair } from '@retherswap/sdk';
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import CurrencySearchModal from '../SearchModal/CurrencySearchModal';
import CurrencyLogo from '../CurrencyLogo';
import Row from '../Row';
import { Fonts } from '../../theme';
import { Input as NumericalInput } from '../NumericalInput';
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg';
import { useActiveWeb3React } from '../../hooks';
import { useTranslation } from 'react-i18next';
import useTheme from '../../hooks/useTheme';
import Column from 'components/Column';
import NetworkSelectorModal from 'components/NetworkSelectorModal/NetworkSelectorModal';
import NetworkLogo from 'components/NetworkLogo';
import { useChainInfo } from 'hooks/useChainInfo';

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.8rem 0.6rem 0.8rem 1.1rem' : '0.8rem 0.8rem 0.8rem 1.1rem')};
`;

const CurrencySelect = styled.button`
  flex: 3;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  border: none;
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text1};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 1rem;
  transition: 0.2s;

  :focus,
  :hover {
    background-color: ${({ theme }) => theme.bg4};
  }
`;

const NetworkSelect = styled.button`
  flex: 2;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  border: none;
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text1};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 1rem;
  transition: 0.2s;

  :focus,
  :hover {
    background-color: ${({ theme }) => theme.bg4};
  }
`;

const StyledDropDown = styled(DropDown)`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ theme }) => theme.text1};
    stroke-width: 1.5px;
  }
`;

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg1};
  z-index: 1;
`;

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => theme.bg3};
`;

const StyledBalanceMax = styled.button`
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.bg3};
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: 0.2s;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};

  :hover {
    background-color: ${({ theme }) => theme.primary3};
  }
  :focus {
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`;

interface BridgeCurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  onNetworkSelect: (network: number) => void;
  currency?: Currency | null;
  otherCurrency?: Currency | null;
  selectedNetwork: number;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherNetwork: number;
  id: string;
  showCommonBases?: boolean;
  customBalanceText?: string;
}

export default function BridgeCurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  onNetworkSelect,
  selectedNetwork,
  currency,
  otherCurrency,
  disableCurrencySelect = false,
  hideBalance = false,
  hideInput = false,
  otherNetwork,
  id,
  showCommonBases,
  customBalanceText,
}: Readonly<BridgeCurrencyInputPanelProps>) {
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const [networkModalOpen, setNetworkModalOpen] = useState(false);
  const { account } = useActiveWeb3React();
  const theme = useTheme();

  const handleDismiss = useCallback(() => {
    setNetworkModalOpen(false);
  }, [setNetworkModalOpen]);
  const handleNetworkSelect = useCallback(
    (network: number) => {
      onNetworkSelect(network);
      handleDismiss();
    },
    [onNetworkSelect, handleDismiss]
  );
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined);
  const network = useChainInfo(selectedNetwork);
  return (
    <>
      <NetworkSelectorModal
        selectedNetwork={selectedNetwork}
        otherNetwork={otherNetwork}
        isOpen={networkModalOpen}
        onDismiss={handleDismiss}
        onNetworkSelect={handleNetworkSelect}
      ></NetworkSelectorModal>
      <InputPanel id={id} style={{ overflow: 'hidden' }}>
        <Container hideInput={hideInput}>
          <Row style={{ gap: '1px', alignItems: 'stretch' }}>
            <CurrencySelect
              className="open-currency-select-button"
              onClick={() => {
                if (!disableCurrencySelect) {
                  setModalOpen(true);
                }
              }}
            >
              <Row style={{ gap: '1rem' }}>
                {currency && <CurrencyLogo currency={currency} size={'48px'} />}
                <Column style={{ textAlign: 'start', gap: '5px' }}>
                  <Fonts.black fontWeight={500} fontSize={11}>
                    Token
                  </Fonts.black>
                  <Fonts.black fontWeight={500} fontSize={16}>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? currency.symbol.slice(0, 4) +
                        '...' +
                        currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                      : currency?.symbol) ?? t('Token')}
                  </Fonts.black>
                </Column>
                {!disableCurrencySelect && <StyledDropDown style={{ margin: '0' }} />}
              </Row>
            </CurrencySelect>
            <NetworkSelect
              onClick={() => {
                setNetworkModalOpen(true);
              }}
            >
              <Row style={{ gap: '1rem' }}>
                <NetworkLogo chainId={selectedNetwork} size="48px" />
                <Column style={{ textAlign: 'start', gap: '5px' }}>
                  <Fonts.black fontWeight={500} fontSize={11}>
                    Network
                  </Fonts.black>
                  <Fonts.black fontWeight={500} fontSize={16}>
                    {network?.label ?? 'BNB Chain'}
                  </Fonts.black>
                </Column>
                {!disableCurrencySelect && <StyledDropDown style={{ margin: '0' }} />}
              </Row>
            </NetworkSelect>
          </Row>

          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
            {!hideInput && (
              <>
                {account && currency && showMaxButton && label !== 'To' && (
                  <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
                )}
                <NumericalInput
                  className="token-amount-input"
                  value={value}
                  onUserInput={(val) => {
                    onUserInput(val);
                  }}
                />
                {account && (
                  <Fonts.body
                    onClick={onMax}
                    color={theme.text2}
                    fontWeight={500}
                    fontSize={14}
                    style={{ display: 'inline', cursor: 'pointer' }}
                  >
                    {!hideBalance && !!currency && selectedCurrencyBalance
                      ? (customBalanceText ?? 'Balance: ') + selectedCurrencyBalance?.toSignificant(6)
                      : ' -'}
                  </Fonts.body>
                )}
              </>
            )}
          </InputRow>
        </Container>
        {!disableCurrencySelect && onCurrencySelect && (
          <CurrencySearchModal
            isOpen={modalOpen}
            onDismiss={handleDismissSearch}
            onCurrencySelect={onCurrencySelect}
            selectedCurrency={currency}
            otherSelectedCurrency={otherCurrency}
            showCommonBases={showCommonBases}
          />
        )}
      </InputPanel>
    </>
  );
}
