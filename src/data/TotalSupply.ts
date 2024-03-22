import { BigNumber } from '@ethersproject/bignumber';
import { Token, TokenAmount } from '@retherswap/sdk';
import { useTokenContract } from '../hooks/useContract';
import { useSingleCallResult } from '../state/multicall/hooks';
import { useMemo } from 'react';

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Token): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false);

  const totalSupply: BigNumber = useSingleCallResult(contract, 'totalSupply')?.result?.[0];

  return useMemo(() => (token && totalSupply ? new TokenAmount(token, totalSupply.toString()) : undefined), [
    token,
    totalSupply,
  ]);
}
