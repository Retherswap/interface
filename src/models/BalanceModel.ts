import { AddressModel } from './AddressModel';
import { BalanceAveragePriceModel } from './BalanceAveragePriceModel';
import { TokenModel } from './TokenModel';

export interface BalanceModel {
  id: number;
  idAddress: number;
  idToken: number;
  balance: number;
  token: TokenModel;
  address: AddressModel;
  averagePrice: BalanceAveragePriceModel;
}
