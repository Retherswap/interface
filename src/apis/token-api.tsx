import React, { useEffect } from 'react';
import { apiUrl } from 'configs/server';
import { Token } from 'models/schema';
import { useSocket } from 'hooks/useSocket';
import { useQuery, useQueryClient } from 'react-query';
import { RetherswapApi } from './retherswap-api';

export class TokenApi extends RetherswapApi {
  public async fetchToken(tokenAddress: string): Promise<Token | undefined> {
    const response = await fetch(`${apiUrl}/tokens/address/${tokenAddress}`);
    return response.json();
  }

  public async subscribeToken(tokenAddress: string) {
    this.subscribeSocketChannel(`token/${tokenAddress}`, (data) => {
      this.queryClient?.setQueryData(['token', tokenAddress], data);
    });
  }

  public unsubscribeToken(tokenAddress: string) {
    this.unsubscribeChannel(`token/${tokenAddress}`);
  }
}

const tokenApi = new TokenApi();

export default function TokenApiComponent() {
  const queryClient = useQueryClient();
  const socket = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }
    tokenApi.init(queryClient, socket);
  }, [queryClient, socket]);
  return <></>;
}

export function useToken(tokenAddress: string) {
  const { data: token, error, isLoading } = useQuery(['token', tokenAddress], () => tokenApi.fetchToken(tokenAddress));
  useEffect(() => {
    tokenApi.subscribeToken(tokenAddress);
    return () => {
      tokenApi.unsubscribeToken(tokenAddress);
    };
  }, [tokenAddress]);
  return { token, error, isLoading };
}
