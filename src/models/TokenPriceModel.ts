import { TokenModel } from './TokenModel';

export interface TokenPriceModel {
  id: string;
  idToken: number;
  usdPrice: number;
  nativeQuote: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  token: TokenModel;
}
