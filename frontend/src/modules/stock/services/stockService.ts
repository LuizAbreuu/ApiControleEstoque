import { api } from '@/lib/axios';
import { StockEntryDto, StockOutputDto, StockMovement } from '../types/stock';

export const stockService = {
  registerEntry: async (data: StockEntryDto) => {
    const response = await api.post('/stock/entry', data);
    return response.data;
  },

  registerOutput: async (data: StockOutputDto) => {
    const response = await api.post('/stock/output', data);
    return response.data;
  },

  getHistory: async (): Promise<StockMovement[]> => {
    return [];
  },
};
