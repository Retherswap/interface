export interface Chain {
  id: number;
  name: string;
  idChain: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  transactions: Transaction[] | null;
  tokens: Token[] | null;
  pairs: Pair[] | null;
}

export interface TotalTVL {
  id: number;
  idAppInfo: number;
  reserve: number;
  reserveUsd: number;
  date: Date;
  appInfo: AppInfo;
}

export interface TotalVolume {
  id: number;
  idAppInfo: number;
  volume: number;
  usdVolume: number;
  date: Date;
  appInfo: AppInfo;
}

export interface AppInfo {
  id: number;
  totalTransactions: number;
  totalUsers: number;
  totalVolume: TotalVolume[] | null;
  totalTvl: TotalTVL[] | null;
}

export interface Token {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  circulatingSupply: number;
  idAddress: number;
  idChain: number;
  usdPrice: number;
  nativeQuote: number;
  isNative: boolean;
  isListed: boolean;
  isLP: boolean;
  idLastTvl: number | null;
  holders: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  pair0: Pair[] | null;
  pair1: Pair[] | null;
  chain: Chain;
  lastTvl: TokenTVL | null;
  price: TokenPrice[] | null;
  volume: TokenVolume[] | null;
  tvl: TokenTVL[] | null;
  inputTransactions: PairTransaction[] | null;
  outputTransactions: PairTransaction[] | null;
  balance: Balance[] | null;
  lpPair: Pair | null;
  excludedSupplyAddresses: ExcludedSupplyAddresses[] | null;
  address: Address;
}

export interface ExcludedSupplyAddresses {
  id: number;
  idAddress: number;
  idToken: number;
  token: Token;
  address: Address;
}

export interface TokenPrice {
  id: number;
  idToken: number;
  usdQuote: number;
  nativeQuote: number;
  date: Date;
  token: Token;
}

export interface TokenTVL {
  id: number;
  idToken: number;
  reserve: number;
  reserveUsd: number;
  date: Date;
  token: Token;
  tokens: Token[] | null;
}

export interface TokenVolume {
  id: number;
  idToken: number;
  volume: number;
  usdVolume: number;
  date: Date;
  token: Token;
}

export interface Pair {
  id: number;
  address: string;
  ticker: string;
  idChain: number;
  idToken0: number;
  idToken1: number;
  idLPToken: number;
  idLastTvl: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  token0: Token;
  token1: Token;
  transactions: PairTransaction[] | null;
  chain: Chain;
  tvl: PairTVL[] | null;
  volume: PairVolume[] | null;
  lastTvl: PairTVL | null;
  lpToken: Token;
}

export interface PairVolume {
  id: number;
  idPair: number;
  token0Volume: number;
  token1Volume: number;
  token0UsdVolume: number;
  token1UsdVolume: number;
  date: Date;
  pair: Pair;
}

export interface PairTVL {
  id: number;
  idPair: number;
  reserve0: number;
  reserve1: number;
  reserve0Usd: number;
  reserve1Usd: number;
  reserveUsd: number;
  date: Date;
  pair: Pair;
  pairs: Pair[] | null;
}

export interface PairTransaction {
  id: number;
  idTransaction: number;
  idPair: number;
  idInputToken: number;
  idOutputToken: number;
  inputAmount: number;
  outputAmount: number;
  inputTokenQuote: number;
  outputTokenQuote: number;
  inputTokenUsdQuote: number;
  outputTokenUsdQuote: number;
  type: PairTransactionType;
  transaction: Transaction;
  pair: Pair;
  inputToken: Token;
  outputToken: Token;
}

export interface FetchingService {
  id: number;
  lastBlock: number;
}

export interface Transaction {
  id: number;
  idChain: number;
  blockNumber: number;
  txHash: string;
  from: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  pairTransactions: PairTransaction[] | null;
  chain: Chain;
  fromAddress: Address;
}

export interface Address {
  id: number;
  address: string;
  transactions: Transaction[] | null;
  balance: Balance[] | null;
  addressAveragePrice: AddressAveragePrice[] | null;
  spent: AddressSpent | null;
  profit: AddressProfit | null;
}

export interface Balance {
  id: number;
  idAddress: number;
  idToken: number;
  balance: number;
  token: Token;
  address: Address;
  averagePrice: BalanceAveragePrice | null;
  balanceChanges: BalanceChange[] | null;
  spent: BalanceSpent | null;
  profit: BalanceProfit | null;
}

export interface BalanceChange {
  id: number;
  idBalance: number;
  amount: number;
  usdAmount: number;
  date: Date;
  balance: Balance;
}

export interface BalanceAveragePrice {
  id: number;
  idBalance: number;
  nativeQuote: number;
  usdQuote: number;
  amount: number;
  balance: Balance;
}

export interface AddressAveragePrice {
  id: number;
  idAddress: number;
  nativeQuote: number;
  usdQuote: number;
  amount: number;
  address: Address;
}

export interface AddressSpent {
  id: number;
  idAddress: number;
  usdAmount: number;
  address: Address;
}

export interface AddressProfit {
  id: number;
  idAddress: number;
  usdAmount: number;
  address: Address;
}

export interface BalanceSpent {
  id: number;
  idBalance: number;
  usdAmount: number;
  balance: Balance;
}

export interface BalanceProfit {
  id: number;
  idBalance: number;
  usdAmount: number;
  balance: Balance;
}

export enum PairTransactionType {
  SWAP = 'SWAP',
  ADD_LIQUIDITY = 'ADD_LIQUIDITY',
  REMOVE_LIQUIDITY = 'REMOVE_LIQUIDITY',
}
