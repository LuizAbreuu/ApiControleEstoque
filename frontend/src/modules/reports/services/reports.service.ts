import { api } from '@/lib/axios';
import { productService } from '@/modules/products/services/product.service';
import { ExpiringBatchReportItem, LowStockReportItem, ReportFilterParams } from '../types/reports';

interface LowStockApiItem {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  minimumStock: number;
}

interface ExpiredBatchApiItem {
  productId: string;
  batchNumber: string;
  quantity: number;
  expirationDate: string;
}

function getDaysUntilExpiration(expirationDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiration = new Date(expirationDate);
  expiration.setHours(0, 0, 0, 0);

  return Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export const reportsService = {
  async getLowStockReport(params?: ReportFilterParams): Promise<LowStockReportItem[]> {
    const response = await api.get<LowStockApiItem[]>('/reports/low-stock', { params });

    return response.data.map((item) => ({
      productId: item.id,
      sku: item.sku,
      name: item.name,
      currentStock: item.currentStock,
      minimumStock: item.minimumStock,
    }));
  },

  async getExpiringBatchesReport(params?: ReportFilterParams): Promise<ExpiringBatchReportItem[]> {
    const response = await api.get<ExpiredBatchApiItem[]>('/reports/expired', { params });
    const productIds = [...new Set(response.data.map((item) => item.productId))];
    const products = await Promise.all(
      productIds.map(async (productId) => {
        try {
          return await productService.getProductById(productId);
        } catch {
          return null;
        }
      })
    );

    const productMap = new Map(
      products
        .filter((product): product is NonNullable<typeof product> => product !== null)
        .map((product) => [product.id, product])
    );

    return response.data.map((item) => {
      const product = productMap.get(item.productId);

      return {
        batchId: `${item.productId}-${item.batchNumber}`,
        productId: item.productId,
        productName: product?.name || item.productId,
        sku: product?.sku || '-',
        batchNumber: item.batchNumber,
        expirationDate: item.expirationDate,
        currentQuantity: item.quantity,
        daysUntilExpiration: getDaysUntilExpiration(item.expirationDate),
      };
    });
  }
};
