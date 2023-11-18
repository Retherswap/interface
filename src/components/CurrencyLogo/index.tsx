import { Currency, ETHER, Token, ChainId as ChainIds } from '@retherswap/sdk';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import RethereumLogo from '../../assets/images/rethereum-logo.png';
import useHttpLocations from '../../hooks/useHttpLocations';
import { useActiveWeb3React } from '../../hooks';
import { WrappedTokenInfo } from '../../state/lists/hooks';
import Logo from '../Logo';

const getTokenLogoURL = () =>
  `https://raw.githubusercontent.com/Retherswap/default-token-list/main/tokens/0x0000000000E3448F3b4f0a59cDd084689a8eA3cB/logo.png`;

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
        return [...uriLocations, getTokenLogoURL()];
      }

      return [getTokenLogoURL()];
    }
    return [];
  }, [currency, uriLocations]);

  if (currency === ETHER) {
    if (chainId === ChainIds.RTH) {
      return <StyledEthereumLogo src={RethereumLogo} size={size} style={style} />;
    }
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />;
}
