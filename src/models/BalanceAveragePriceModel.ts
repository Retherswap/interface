import { BalanceModel } from './BalanceModel';

export interface BalanceAveragePriceModel {
  id: number;
  idBalance: number;
  nativeQuote: number;
  usdQuote: number;
  amount: number;
  balance: BalanceModel;
}
