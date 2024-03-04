import { PairTVLModel } from './PairTVLModel';
import { PairVolumeModel } from './PairVolumeModel';
import { TokenModel } from './TokenModel';

export interface PairModel {
  id: string;
  address: string;
  idToken0: number;
  idToken1: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  token0: TokenModel;
  token1: TokenModel;
  lastTvl: PairTVLModel;
  tvl: PairTVLModel[];
  volume: PairVolumeModel[];
}
