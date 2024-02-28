import { Pair } from '@retherswap/sdk';
import { RetherswapTransaction } from './RetherswapTransactionModel';
import { TokenModel } from './TokenModel';

export interface PairTransactionModel {
  id: string;
  inputAmount: string;
  outputAmount: string;
  inputTokenQuote: string;
  outputTokenQuote: string;
  inputTokenUsdQuote: string;
  outputTokenUsdQuote: string;
  idPair: number;
  inputToken: TokenModel;
  outputToken: TokenModel;
  pair: Pair;
  type: 'SWAP' | 'ADD_LIQUIDITY' | 'REMOVE_LIQUIDITY';
  transaction: RetherswapTransaction;
}
