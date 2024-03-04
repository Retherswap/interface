import { CloseIcon, Fonts } from 'theme';
import Modal from '../Modal';
import React, { useCallback } from 'react';
import Row, { RowBetween } from 'components/Row';
import Column from 'components/Column';
import { SearchInput } from 'components/SearchInput/SearchInput';
import { useTranslation } from 'react-i18next';
import { Separator } from 'components/Separator/Separator';
import { ALL_SUPPORTED_CHAIN_IDS, CHAIN_INFO, L1ChainInfo } from 'constants/chains';
import { FixedSizeList } from 'react-window';
import NetworkLogo from 'components/NetworkLogo';
import { MenuItem } from 'components/Menu/MenuItem';

interface NetworkSelectorModalProps {
  isOpen: boolean;
  selectedNetwork?: number;
  otherNetwork?: number;
  onDismiss: () => void;
  onNetworkSelect: (network: number) => void;
}

export default function NetworkSelectorModal({
  isOpen,
  selectedNetwork,
  otherNetwork,
  onDismiss,
  onNetworkSelect,
}: NetworkSelectorModalProps) {
  const translation = useTranslation().t;
  const chains = ALL_SUPPORTED_CHAIN_IDS;
  const Network = useCallback(
    ({ data, index, style }) => {
      const network: L1ChainInfo = CHAIN_INFO[data[index]];
      const isSelected = Boolean(selectedNetwork === network.chainId);
      const otherSelected = Boolean(otherNetwork === network.chainId);
      return (
        <MenuItem
          style={style}
          className={`network-item-${network.chainId}`}
          onClick={() => (isSelected ? null : onNetworkSelect(network.chainId))}
          disabled={isSelected}
          selected={otherSelected}
        >
          <Row>
            <NetworkLogo chainId={network.chainId} size="24px" style={{ marginRight: '16px' }} />
            {network.label}
          </Row>
        </MenuItem>
      );
    },
    [selectedNetwork, otherNetwork, onNetworkSelect]
  );
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={80}>
      <Column style={{ width: '100%', padding: '20px', gap: '16px' }}>
        <RowBetween style={{ alignItems: 'start' }}>
          <Fonts.black fontWeight={500} fontSize={16}>
            Select a network
          </Fonts.black>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <Row>
          <SearchInput
            type="text"
            id="network-search-input"
            placeholder={translation('Search name or paste address')}
            autoComplete="off"
            /*value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}*/
          />
        </Row>
        <Separator />
        <FixedSizeList height={490} width="100%" itemData={chains} itemCount={chains.length} itemSize={56}>
          {Network}
        </FixedSizeList>
      </Column>
    </Modal>
  );
}
