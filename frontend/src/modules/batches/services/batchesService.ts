import { api } from '@/lib/axios';
import { Batch } from '../types/batch';

interface ExpiredBatchApiItem {
  productId: string;
  batchNumber: string;
  quantity: number;
  expirationDate: string;
}

export const batchesService = {
  getExpiredBatches: async (): Promise<Batch[]> => {
    const response = await api.get<ExpiredBatchApiItem[]>('/reports/expired');

    return response.data.map((item) => ({
      productId: item.productId,
      batchNumber: item.batchNumber,
      quantity: item.quantity,
      expirationDate: item.expirationDate,
    }));
  },
  
  getAllBatches: async (): Promise<Batch[]> => {
    return [];
  }
};
