export interface LowStockReportItem {
  productId: string;
  sku: string;
  name: string;
  currentStock: number;
  minimumStock: number;
}

export interface ExpiringBatchReportItem {
  batchId: string;
  productId: string;
  productName: string;
  sku: string;
  batchNumber: string;
  expirationDate: string; // ISO date string
  currentQuantity: number;
  daysUntilExpiration: number;
}

export interface ReportFilterParams {
  startDate?: string;
  endDate?: string;
  status?: string;
}
