import { TokenPriceModel } from './TokenPriceModel';
import { TokenTVLModel } from './TokenTVLModel';
import { TokenVolumeModel } from './TokenVolumeModel';

export interface TokenModel {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  circulatingSupply: string;
  address: string;
  idChain: number;
  usdPrice: string;
  nativeQuote: string;
  holders: string;
  lastTvl?: TokenTVLModel;
  volume: TokenVolumeModel[];
  tvl: TokenTVLModel[];
  price: TokenPriceModel[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
