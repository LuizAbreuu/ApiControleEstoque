export type StockMovementType = 'Entry' | 'Output' | 'Adjustment' | 'Disposal';

export interface StockMovement {
  id: string;
  productId: string;
  productName?: string;
  batchId?: string;
  batchNumber?: string;
  type: StockMovementType;
  quantity: number;
  date: string;
  userId: string;
  userName?: string;
  notes?: string;
}

export interface StockEntryRequest {
  productId: string;
  quantity: number;
  batchNumber: string;
  expirationDate: string;
  notes?: string;
}

export interface StockOutputRequest {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface StockAdjustmentRequest {
  productId: string;
  batchId?: string;
  quantity: number;
  notes: string; // Motivo obrigatório
}

export interface StockDisposalRequest {
  productId: string;
  batchId?: string;
  quantity: number;
  notes: string; // Motivo obrigatório
}
