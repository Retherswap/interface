import { ChainId } from '@retherswap/sdk';

export const RPC_URLS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: 'https://rpc.ankr.com/eth',
  [ChainId.BNB]: 'https://bsc-dataseed.binance.org/',
  [ChainId.MATIC]: 'https://polygon-rpc.com/',
  [ChainId.HYPRA]: 'http://162.0.211.141:3030/',
};
