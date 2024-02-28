import { CHAIN_INFO, SupportedChainId } from 'constants/chains';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import { useActiveWeb3React } from 'hooks/web3';
import React, { useCallback, useRef } from 'react';
import { ChevronDown } from 'react-feather';
import { ApplicationModal } from 'state/application/actions';
import { useModalOpen, useToggleModal } from 'state/application/hooks';
import { useAppSelector } from 'state/hooks';
import styled from 'styled-components/macro';
import { MEDIA_WIDTHS } from 'theme';
import { switchToNetwork } from 'utils/switchToNetwork';

const FlyoutHeader = styled.div`
  color: ${({ theme }) => theme.text2};
  font-weight: 400;
`;
const FlyoutMenu = styled.div`
  position: relative;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  overflow: auto;
  padding: 16px;
  position: absolute;
  top: 150px;
  right: 20px;
  width: 272px;
  z-index: 99;
  & > *:not(:last-child) {
    margin-bottom: 12px;
  }
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    top: 50px;
    right: unset;
  }
`;
const FlyoutRow = styled.div<{ active: boolean }>`
  position: relative;
  align-items: center;
  background-color: ${({ active, theme }) => (active ? theme.bg2 : 'transparent')};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
  text-align: left;
  width: 100%;
`;
const FlyoutRowActiveIndicator = styled.div`
  background-color: ${({ theme }) => theme.green1};
  border-radius: 50%;
  height: 9px;
  width: 9px;
  box-shadow: 0 0 10px skyblue; /* Use skyblue color for the glow */
`;

const FlyoutRowInactiveIndicator = styled.div`
  background-color: red; // You can customize the color here
  border-radius: 50%;
  height: 9px;
  width: 9px;
`;

const Logo = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 8px;
`;
const NetworkLabel = styled.div`
  flex: 1 1 auto;
`;
const SelectorLabel = styled(NetworkLabel)`
  display: none;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    display: block;
    margin-right: 8px;
  }
`;
const SelectorControls = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.bg1};
  border: 2px solid ${({ theme }) => theme.bg1};
  border-radius: 12px;
  color: ${({ theme }) => theme.text1};
  cursor: pointer; // or 'auto' if needed
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
`;

const SelectorLogo = styled(Logo)<{ interactive?: boolean }>`
  margin-right: ${({ interactive }) => (interactive ? 8 : 0)}px;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    margin-right: 8px;
  }
`;
const SelectorWrapper = styled.div`
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    position: relative;
  }
`;
const StyledChevronDown = styled(ChevronDown)`
  width: 12px;
`;

export default function NetworkSelector() {
  const { chainId, library } = useActiveWeb3React();
  const node = useRef<HTMLDivElement>();
  const open = useModalOpen(ApplicationModal.NETWORK_SELECTOR);
  const toggle = useToggleModal(ApplicationModal.NETWORK_SELECTOR);
  useOnClickOutside(node, open ? toggle : undefined);
  const implements3085 = useAppSelector((state) => state.application.implements3085);

  const info = chainId ? CHAIN_INFO[chainId] : undefined;
  const showSelector = Boolean(implements3085);
  const mainnetInfo = CHAIN_INFO[SupportedChainId.HYPRA];
  const isOnHypraNetwork = chainId === SupportedChainId.HYPRA;
  const isOnBNBNetwork = chainId === SupportedChainId.BNB;
  const isOnEthereumNetwork = chainId === SupportedChainId.ETHEREUM;
  const isOnPolygonNetwork = chainId === SupportedChainId.POLYGON;
  const conditionalToggle = useCallback(() => {
    if (showSelector) {
      toggle();
    }
  }, [showSelector, toggle]);

  if (!chainId || !info || !library) {
    return null;
  }

  function Row({ targetChain }: { targetChain: number }) {
    const { chainId, library } = useActiveWeb3React();

    if (!library) {
      return null;
    }

    const handleRowClick = () => {
      switchToNetwork({ library, chainId: targetChain });
      toggle();
    };

    const active = chainId === targetChain;
    const isEthereum = targetChain === SupportedChainId.ETHEREUM;
    const isBNB = targetChain === SupportedChainId.BNB;
    const isHypra = targetChain === SupportedChainId.HYPRA;
    const isPolygon = targetChain === SupportedChainId.POLYGON;

    return (
      <FlyoutRow onClick={handleRowClick} active={active}>
        <Logo src={CHAIN_INFO[targetChain].logoUrl} />
        <NetworkLabel>{CHAIN_INFO[targetChain].label}</NetworkLabel>
        {!isHypra && (isEthereum || isBNB || isPolygon) ? <FlyoutRowInactiveIndicator /> : <FlyoutRowActiveIndicator />}
      </FlyoutRow>
    );
  }

  return (
    <SelectorWrapper ref={node as any}>
      <SelectorControls onClick={conditionalToggle}>
        <SelectorLogo interactive={showSelector} src={info.logoUrl || mainnetInfo.logoUrl} />
        <SelectorLabel>{info.label}</SelectorLabel>
        {showSelector && <StyledChevronDown />}
      </SelectorControls>
      {open && (
        <FlyoutMenu>
          <FlyoutHeader>Select a network</FlyoutHeader>
          {/* Display a message if on the Ethereum network */}
          {isOnHypraNetwork && <div style={{ color: 'green', marginBottom: '12px' }}>You're on the Hypra network.</div>}
          {/* Display a message if on the Ethereum network */}
          {isOnEthereumNetwork && (
            <div style={{ color: 'red', marginBottom: '12px' }}>
              You're on the Ethereum network. Please switch to the Hypra Network.
            </div>
          )}
          {/* Display a message if on the Binance Smart Chain */}
          {isOnBNBNetwork && (
            <div style={{ color: 'red', marginBottom: '12px' }}>
              You're on the Binance Smart Chain. Please switch to the Hypra Network.
            </div>
          )}
          {/* Display a message if on the Polygon Mainnet */}
          {isOnPolygonNetwork && (
            <div style={{ color: 'red', marginBottom: '12px' }}>
              You're on the Polygon Mainnet. Please switch to the Hypra Network.
            </div>
          )}
          {/* Render rows for different networks */}
          <Row targetChain={SupportedChainId.HYPRA} />
          <Row targetChain={SupportedChainId.ETHEREUM} />
          <Row targetChain={SupportedChainId.BNB} />
          <Row targetChain={SupportedChainId.POLYGON} />
          {/* Add more rows for additional networks as needed */}
        </FlyoutMenu>
      )}
    </SelectorWrapper>
  );
}
