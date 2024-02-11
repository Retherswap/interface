import { CHAIN_INFO } from 'constants/chains';

export function useChainInfo(chaidId: number) {
  return CHAIN_INFO[chaidId] || undefined;
}
