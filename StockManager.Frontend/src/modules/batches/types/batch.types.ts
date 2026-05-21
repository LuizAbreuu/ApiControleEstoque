export type BatchStatus = 'Active' | 'Expiring' | 'Expired' | 'Depleted';

export interface ProductBatch {
  id: string;
  productId: string;
  productName?: string;
  batchNumber: string;
  quantity: number;
  originalQuantity: number;
  entryDate: string;
  expirationDate: string;
  status: BatchStatus;
}
