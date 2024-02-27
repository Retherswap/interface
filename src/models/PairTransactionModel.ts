import { Pair, Token } from '@retherswap/sdk';
import { RetherswapTransaction } from './RetherswapTransactionModel';

export interface PairTransactionModel {
  id: string;
  inputAmount: string;
  outputAmount: string;
  inputTokenQuote: string;
  outputTokenQuote: string;
  inputTokenUsdQuote: string;
  outputTokenUsdQuote: string;
  idPair: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  inputToken: Token;
  outputToken: Token;
  pair: Pair;
  type: 'SWAP' | 'ADD_LIQUIDITY' | 'REMOVE_LIQUIDITY';
  transaction: RetherswapTransaction;
}
