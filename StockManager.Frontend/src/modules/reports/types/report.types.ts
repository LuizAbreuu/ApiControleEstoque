export interface LowStockReportItem {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  difference: number;
}

export interface ExpiredReportItem {
  batchId: string;
  batchNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  expirationDate: string;
  daysExpired: number;
}

export interface ExpiringReportItem {
  batchId: string;
  batchNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  expirationDate: string;
  daysRemaining: number;
}

export interface MovementReportItem {
  id: string;
  date: string;
  type: string;
  productName: string;
  batchNumber?: string;
  quantity: number;
  userName: string;
}
