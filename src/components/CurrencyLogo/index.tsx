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

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`;

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`;

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined);
  const { chainId } = useActiveWeb3React();

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return [];

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address, currency.chainId)];
      }

      return [getTokenLogoURL(currency.address, currency.chainId)];
    }
    return [];
  }, [currency, uriLocations]);

  if (currency === ETHER) {
    if (chainId === ChainIds.HYPRA) {
      return <StyledEthereumLogo src={HypraLogo} size={size} style={style} />;
    }
    if (chainId === ChainIds.BNB) {
      return <StyledEthereumLogo src={BNBLogo} size={size} style={style} />;
    }
    if (chainId === ChainIds.MATIC) {
      return <StyledEthereumLogo src={MATICLogo} size={size} style={style} />;
    }
    if (chainId === ChainIds.ETHEREUM) {
      return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />;
    }
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />;
}
