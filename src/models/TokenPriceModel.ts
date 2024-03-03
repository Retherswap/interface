import { TokenModel } from './TokenModel';

export interface TokenPriceModel {
  id: string;
  idToken: number;
  openUsd: string;
  closeUsd: string;
  highUsd: string;
  lowUsd: string;
  openNativeQuote: string;
  closeNativeQuote: string;
  highNativeQuote: string;
  lowNativeQuote: string;
  date: Date;
  token: TokenModel;
}
