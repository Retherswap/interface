import React from 'react';
import styled from 'styled-components';
import Logo from '../Logo';
import { CHAIN_INFO } from 'constants/chains';

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`;

export default function NetworkLogo({
  chainId,
  size = '24px',
  style,
}: {
  chainId: number;
  size?: string;
  style?: React.CSSProperties;
}) {
  const network = CHAIN_INFO[chainId];
  return (
    <img width={size} height={size} src={network?.logoUrl} alt={`${network?.label ?? 'network'} logo`} style={style} />
  );
}
