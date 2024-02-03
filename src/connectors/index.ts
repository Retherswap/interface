import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { NetworkConnector } from './NetworkConnector';
import { ChainId } from '@retherswap/sdk';
import { RPC_URLS } from '../constants/rpc';

// const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
// const PORTIS_ID = process.env.REACT_APP_PORTIS_ID

export const DEFAULT_CHAIN_ID: ChainId = parseInt(process.env.REACT_APP_DEFAULT_CHAIN_ID ?? '622277');

if (RPC_URLS[DEFAULT_CHAIN_ID] === '') {
  throw new Error(`RPC must be defined for DEFAULT_CHAIN_ID=` + DEFAULT_CHAIN_ID);
}

export const network = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: DEFAULT_CHAIN_ID,
});

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any));
}

export const injected = new InjectedConnector({
  supportedChainIds: [ChainId.ETHEREUM, ChainId.HYPRA, ChainId.MATIC, ChainId.BNB],
});

// Bitgert only
export const walletconnect = new WalletConnectConnector({
  rpc: { [ChainId.HYPRA]: RPC_URLS[ChainId.HYPRA] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true
});

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[DEFAULT_CHAIN_ID],
  appName: 'Retherswap',
  // appLogoUrl: '',
});
