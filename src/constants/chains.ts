import hypraLogoUrl from 'assets/images/Hypra_trans-logo.png';
import ethereumLogoUrl from 'assets/images/ethereum_trans-logo.png';
import bnbLogoUrl from 'assets/images/bnb_trans-logo.png';
import polygonLogoUrl from 'assets/images/polygon_trans-logo.png';
import ms from 'ms.macro';

export enum SupportedChainId {
  HYPRA = 622277,
  ETHEREUM = 1,
  BNB = 56,
  POLYGON = 137,
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.HYPRA,
  SupportedChainId.ETHEREUM,
  SupportedChainId.BNB,
  SupportedChainId.POLYGON,
];

export const L1_CHAIN_IDS = [
  SupportedChainId.HYPRA,
  SupportedChainId.ETHEREUM,
  SupportedChainId.BNB,
  SupportedChainId.POLYGON,
] as const;

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number];

export interface L1ChainInfo {
  readonly chainId: SupportedL1ChainId;
  readonly blockWaitMsBeforeWarning?: number;
  readonly docs: string;
  readonly explorer: string;
  readonly infoLink: string;
  readonly label: string;
  readonly logoUrl?: string;
  readonly rpcUrls?: string[];
  readonly nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export type ChainInfo = { readonly [chainId: number]: L1ChainInfo } & {
  readonly [chainId in SupportedL1ChainId]: L1ChainInfo;
};

export const CHAIN_INFO: ChainInfo = {
  [SupportedChainId.HYPRA]: {
    chainId: SupportedChainId.HYPRA,
    blockWaitMsBeforeWarning: ms`10m`,
    docs: 'https://www.hypra.network/mining.html',
    explorer: 'https://explorer.hypra.network',
    infoLink: 'https://www.hypra.network/mining.html',
    label: 'Hypra',
    logoUrl: hypraLogoUrl,
    nativeCurrency: { name: 'Hypra Mainnet', symbol: 'HYP', decimals: 18 },
    rpcUrls: ['https://rpc.hypra.network'],
  },
  [SupportedChainId.ETHEREUM]: {
    chainId: SupportedChainId.ETHEREUM,
    blockWaitMsBeforeWarning: ms`10m`,
    docs: 'https://ethereum.org/en/learn/',
    explorer: 'https://etherscan.io',
    infoLink: 'https://ethereum.org/en/',
    label: 'Ethereum',
    logoUrl: ethereumLogoUrl,
    nativeCurrency: { name: 'Ethereum Mainnet', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
  },
  [SupportedChainId.BNB]: {
    chainId: SupportedChainId.BNB,
    blockWaitMsBeforeWarning: ms`10m`,
    docs: 'https://www.binance.org/en',
    explorer: 'https://bscscan.com/',
    infoLink: 'https://www.binance.org/en',
    label: 'BNB',
    logoUrl: bnbLogoUrl,
    nativeCurrency: { name: 'BNB Smart Chain', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
  },
  [SupportedChainId.POLYGON]: {
    chainId: SupportedChainId.POLYGON,
    blockWaitMsBeforeWarning: ms`10m`,
    docs: 'https://wiki.polygon.technology/',
    explorer: 'https://polygonscan.com/',
    infoLink: 'https://polygon.technology/',
    label: 'Polygon',
    logoUrl: polygonLogoUrl,
    nativeCurrency: { name: 'Polygon Mainnet', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com/'],
  },
};
