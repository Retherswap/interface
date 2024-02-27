export interface RetherswapTransaction {
  id: number;
  blockNumber: number;
  txHash: string;
  from: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
