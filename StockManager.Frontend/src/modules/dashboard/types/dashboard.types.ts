export interface DashboardMetrics {
  totalProducts: number;
  lowStockProducts: number;
  expiringBatches: number;
  expiredBatches: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'Entry' | 'Output' | 'Adjustment' | 'Disposal';
  quantity: number;
  date: string;
  userName: string;
}

export interface ChartData {
  name: string;
  entradas: number;
  saidas: number;
}
