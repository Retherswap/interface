import { ChainId, JSBI, Percent, Token, WETH } from '@retherswap/sdk';
import { AbstractConnector } from '@web3-react/abstract-connector/dist';
import { injected, walletlink } from '../connectors';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const FACTORY_ADDRESS = '0xa995CBAd84fdeE7608F082bC0dBDB5DdD91D373f';
export const ROUTER_ADDRESS = '0x11FE7aAD506545A3e371D4E4a1bEB1B63000b253';

export const LP_TOKEN_NAME = 'RETHERSWAP-LP';
export const LP_TOKEN_SYMBOL = 'RETHERS-LP';

export { PRELOADED_PROPOSALS } from './proposals';

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

// Tokens
export const HINU = new Token(ChainId.HYPRA, '0xcBFbd38167519F4DCcfF1dbd48304a4FC8d4De32', 18, 'HINU', 'Hypra Inu');
export const STAKE1 = new Token(
  ChainId.HYPRA,
  '0xCf52025D37f68dEdA9ef8307Ba4474eCbf15C33c',
  18,
  'RETHER',
  'Retherswap Token'
);

export const BUSD = new Token(ChainId.BNB, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 6, 'BUSD', 'BUSD Token');
export const USDC = new Token(ChainId.HYPRA, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C');
export const USDT = new Token(ChainId.HYPRA, '0xfb6352104fEF2f3CF07A91f73C7f679fF6AB50da', 6, 'USDT', 'Tether USD');
export const COMP = new Token(ChainId.ETHEREUM, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound');
export const MKR = new Token(ChainId.ETHEREUM, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker');
export const AMPL = new Token(ChainId.ETHEREUM, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth');
export const WBTC = new Token(ChainId.ETHEREUM, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC');
export const WHYP = new Token(ChainId.HYPRA, '0x0000000000079c645A9bDE0Bd8Af1775FAF5598A', 18, 'WHYP', 'Wrapped Hypra');

export const RETHERS_ADDRESS = '0xCf52025D37f68dEdA9ef8307Ba4474eCbf15C33c';
export const RETHER: { [chainId in ChainId]: Token } = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, RETHERS_ADDRESS, 18, 'RETHER', 'Retherswap Token'),
  [ChainId.BNB]: new Token(ChainId.BNB, RETHERS_ADDRESS, 18, 'RETHER', 'Retherswap Token'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, RETHERS_ADDRESS, 18, 'RETHER', 'Retherswap Token'),
  [ChainId.HYPRA]: new Token(ChainId.HYPRA, RETHERS_ADDRESS, 18, 'RETHER', 'Retherswap Token'),
};

const STAKE_ADDRESS = '0xCf52025D37f68dEdA9ef8307Ba4474eCbf15C33c';
export const STAKE: { [chainId in ChainId]: Token } | any = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, STAKE_ADDRESS, 18, 'RETHER', 'Retherswap Token'),
  [ChainId.HYPRA]: new Token(ChainId.HYPRA, RETHERS_ADDRESS, 18, 'RETHER', 'Retherswap Token'),
};
// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 10;
export const PROPOSAL_LENGTH_IN_BLOCKS = 60_480;
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS;
export const TIMELOCK_ADDRESS = '0x5Ec189286619e52BdF2e68546837255A2cccCb18';

export const GOVERNANCE_ADDRESS = '0x897Ac879C841eD67c9d4bEB015Da3429C7B51689';

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [TIMELOCK_ADDRESS]: 'Timelock',
};

const WETH_ONLY: ChainTokenList = {
  [ChainId.ETHEREUM]: [WETH[ChainId.ETHEREUM]],
  [ChainId.MATIC]: [WETH[ChainId.MATIC]],
  [ChainId.BNB]: [WETH[ChainId.BNB], BUSD],
  [ChainId.HYPRA]: [WETH[ChainId.HYPRA]],
};

export const ETH_NAME_AND_SYMBOL = {
  [ChainId.ETHEREUM]: { name: 'Ether', symbol: 'ETH' },
  [ChainId.BNB]: { name: 'BNB', symbol: 'BNB' },
  [ChainId.MATIC]: { name: 'Matic', symbol: 'MATIC' },
  [ChainId.HYPRA]: { name: 'Hypra', symbol: 'HYP' },
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.BNB]: [...WETH_ONLY[ChainId.BNB], BUSD],
  [ChainId.HYPRA]: [...WETH_ONLY[ChainId.HYPRA]],
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.ETHEREUM]: {
    [AMPL.address]: [USDC, WETH[ChainId.ETHEREUM]],
  },
};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.HYPRA]: [...WETH_ONLY[ChainId.HYPRA]],
  [ChainId.ETHEREUM]: [...WETH_ONLY[ChainId.ETHEREUM], USDC],
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.ETHEREUM]: [...WETH_ONLY[ChainId.ETHEREUM]],
  [ChainId.BNB]: [...WETH_ONLY[ChainId.BNB], BUSD],
  [ChainId.MATIC]: [...WETH_ONLY[ChainId.MATIC]],
  [ChainId.HYPRA]: [...WETH_ONLY[ChainId.HYPRA]],
};

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.HYPRA]: [
    [
      new Token(ChainId.HYPRA, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.HYPRA, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin'),
    ],
    [USDC, USDT],
  ],
};

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5',
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true,
  },
};

export const NetworkContextName = 'NETWORK';
// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 49;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;
// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7);
export const BIG_INT_ZERO = JSBI.BigInt(0);
// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE); // 15%
// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)); // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000));
export const ZERO_PERCENT = new Percent('0');
export const ONE_HUNDRED_PERCENT = new Percent('1');
