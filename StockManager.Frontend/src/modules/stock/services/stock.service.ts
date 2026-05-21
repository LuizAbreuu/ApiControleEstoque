import { api } from '@/services/api';
import { 
  StockMovement, 
  StockEntryRequest, 
  StockOutputRequest, 
  StockAdjustmentRequest, 
  StockDisposalRequest 
} from '../types/stock.types';

export const stockService = {
  async getHistory(): Promise<StockMovement[]> {
    const response = await api.get<StockMovement[]>('/api/stock/history');
    return response.data;
  },

  async getProductHistory(productId: string): Promise<StockMovement[]> {
    const response = await api.get<StockMovement[]>(`/api/stock/history/product/${productId}`);
    return response.data;
  },

  async entry(data: StockEntryRequest): Promise<void> {
    await api.post('/api/stock/entry', data);
  },

  async output(data: StockOutputRequest): Promise<void> {
    await api.post('/api/stock/output', data);
  },

  async adjustment(data: StockAdjustmentRequest): Promise<void> {
    await api.post('/api/stock/adjustment', data);
  },

  async disposal(data: StockDisposalRequest): Promise<void> {
    await api.post('/api/stock/disposal', data);
  }
};
