import React, { useEffect } from 'react';
import { apiUrl } from 'configs/server';
import { Balance } from 'models/schema';
import { useSocket } from 'hooks/useSocket';
import { useQuery, useQueryClient } from 'react-query';
import { RetherswapApi } from './retherswap-api';

export class BalanceApi extends RetherswapApi {
  public async fetchAccountBalances(address: string): Promise<Balance[]> {
    const response = await fetch(`${apiUrl}/balances/address/${address}`);
    return response.json();
  }

  public async fetchTokenBalance(address: string, tokenAddress: string): Promise<Balance> {
    const response = await fetch(`${apiUrl}/balances/address/${address}/token/${tokenAddress}`);
    return response.json();
  }

  public async subscribeBalance(tokenAddress: string) {
    /*this.subscribeSocketChannel(`token/${tokenAddress}`, (data) => {
      this.queryClient?.setQueryData(['token', tokenAddress], data);
    });*/
  }

  public unsubscribeBalance(tokenAddress: string) {
    //this.unsubscribeChannel(`token/${tokenAddress}`);
  }
}

const balanceApi = new BalanceApi();

export default function BalanceApiComponent() {
  const queryClient = useQueryClient();
  const socket = useSocket();
  useEffect(() => {
    if (!socket) {
      return;
    }
    balanceApi.init(queryClient, socket);
  }, [queryClient, socket]);
  return <></>;
}

export function useTokenBalance(address: string, tokenAddress: string) {
  const { data: balance, error, isLoading } = useQuery(['balance', address, tokenAddress], () =>
    balanceApi.fetchTokenBalance(address, tokenAddress)
  );
  useEffect(() => {
    balanceApi.subscribeBalance(address);
    return () => {
      balanceApi.unsubscribeBalance(address);
    };
  }, [address]);
  return { balance, error, isLoading };
}

export function useAccountBalances(address: string) {
  const { data: balances, error, isLoading } = useQuery(['balances', address], () =>
    balanceApi.fetchAccountBalances(address)
  );
  useEffect(() => {
    balanceApi.subscribeBalance(address);
    return () => {
      balanceApi.unsubscribeBalance(address);
    };
  }, [address]);
  if (!balances) {
    return { balances: [], error, isLoading };
  }
  return { balances, error, isLoading };
}
