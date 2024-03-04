import { AddressModel } from './AddressModel';

export interface Transaction {
  id: number;
  blockNumber: number;
  txHash: string;
  from: number;
  fromAddress: AddressModel;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
