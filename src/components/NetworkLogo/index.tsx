import React from 'react';
import { CHAIN_INFO } from 'constants/chains';

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
