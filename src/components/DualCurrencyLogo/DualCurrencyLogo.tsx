import { Currency, ETHER, Token, ChainId as ChainIds, ChainId } from '@retherswap/sdk';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import HypraLogo from '../../assets/images/hypra-logo.png';
import EthereumLogo from '../../assets/images/ethereum_trans-logo.png';
import BNBLogo from '../../assets/images/bnb_trans-logo.png';
import MATICLogo from '../../assets/images/polygon_trans-logo.png';
import useHttpLocations from '../../hooks/useHttpLocations';
import { useActiveWeb3React } from '../../hooks';
import { WrappedTokenInfo } from '../../state/lists/hooks';
import Logo from '../Logo';

const getTokenLogoURL = (address: string, chainId: ChainId) => {
  let baseURL = '';

  switch (chainId) {
    case ChainIds.HYPRA:
      baseURL += `https://raw.githubusercontent.com/Retherswap/default-token-list/main/supported_chains/hypra/${address}/logo.png`;
      break;
    case ChainIds.BNB:
      baseURL += `https://raw.githubusercontent.com/Retherswap/default-token-list/main/supported_chains/bnb/${address}/logo.png`;
      break;
    case ChainIds.MATIC:
      baseURL += `https://raw.githubusercontent.com/Retherswap/default-token-list/main/supported_chains/matic/${address}/logo.png`;
      break;
    case ChainIds.ETHEREUM:
      baseURL += `https://raw.githubusercontent.com/Retherswap/default-token-list/main/supported_chains/ethereum/${address}/logo.png`;
      break;
  }

  return baseURL;
};

const ImageContainer = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: transparent;
`;

const Logo0 = styled.img`
  position: absolute;
  width: 105%;
  height: 105%;
  background-size: cover;
  -webkit-clip-path: polygon(100% 0, 100% 100%, 0 100%);
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  background-position: bottom right;
  background-image: url('https://raw.githubusercontent.com/Retherswap/default-token-list/main/supported_chains/hypra/0x0000000000079c645A9bDE0Bd8Af1775FAF5598A/logo.png');
`;

const Logo1 = styled.img`
  position: absolute;
  width: 105%;
  height: 105%;
  background-size: cover;
  -webkit-clip-path: polygon(0 0, 100% 0, 0 100%);
  clip-path: polygon(0 0, 100% 0, 0 100%);
  background-image: url('https://raw.githubusercontent.com/Retherswap/default-token-list/main/supported_chains/hypra/0xCf52025D37f68dEdA9ef8307Ba4474eCbf15C33c/logo.png');
`;

const Divider = styled.div`
  position: absolute;
  width: 2px;
  height: 100%;
  background-color: white;
  right: 50%;
  transform: translateX(50%) rotate(45deg);
  z-index: 100;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`;

export default function DualCurrencyLogo({
  size,
  currency0,
  currency1,
  style,
}: {
  size?: number;
  currency0: any;
  currency1: any;
  style?: React.CSSProperties;
}) {
  const { chainId } = useActiveWeb3React();
  const currency0LogoURL = useMemo(() => {
    if (!chainId) {
      return;
    }
    let logo = currency0 instanceof WrappedTokenInfo ? currency0.logoURI : getTokenLogoURL(currency0?.address, chainId);
    if (!logo) {
    }
    return logo;
  }, [currency0, chainId]);
  const currency1LogoURL = useMemo(() => {
    if (!chainId) {
      return;
    }
    let logo = currency1 instanceof WrappedTokenInfo ? currency1.logoURI : getTokenLogoURL(currency1?.address, chainId);
    if (!logo) {
    }
    return logo;
  }, [currency1, chainId]);
  return (
    <ImageContainer>
      <Logo0 style={{ backgroundImage: `url('${currency0LogoURL}')` }}></Logo0>
      <Divider></Divider>
      <Logo1 style={{ backgroundImage: `url('${currency1LogoURL}')` }}></Logo1>
    </ImageContainer>
  );
}
