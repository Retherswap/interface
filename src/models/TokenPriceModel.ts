import { TokenModel } from './TokenModel';

export interface TokenPriceModel {
  id: string;
  idToken: number;
  usdPrice: number;
  nativeQuote: number;
  date: Date;
  token: TokenModel;
}
