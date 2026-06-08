export interface StockEntryDto {
  productId: string;
  batchNumber: string;
  quantity: number;
  expirationDate: string; // ISO DateTime
  observation?: string;
}

export interface StockOutputDto {
  productId: string;
  quantity: number;
  observation?: string;
}

export interface StockMovement {
  id: string;
  type: 'ENTRY' | 'OUTPUT';
  productName: string;
  sku: string;
  quantity: number;
  date: string;
  batchNumber?: string;
  observation?: string;
}
