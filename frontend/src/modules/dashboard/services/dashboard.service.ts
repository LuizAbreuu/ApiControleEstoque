import { api } from '@/lib/axios';
import { PaginationResponse, ProductDto, StockEntryDto } from '../types/dashboard.types';

interface ProductPaginationApiResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const dashboardService = {
  getProducts: async () => {
    const response = await api.get<ProductPaginationApiResponse<ProductDto>>('/products', {
      params: { pageNumber: 1, pageSize: 1 }
    });

    return {
      items: response.data.data,
      totalCount: response.data.totalCount,
      pageNumber: response.data.pageNumber,
      pageSize: response.data.pageSize,
      totalPages: response.data.totalPages,
    } satisfies PaginationResponse<ProductDto>;
  },

  getLowStock: async () => {
    const response = await api.get<Array<ProductDto & { id: string }>>('/reports/low-stock');
    return response.data;
  },

  getExpiredBatches: async () => {
    const response = await api.get<StockEntryDto[]>('/reports/expired');
    return response.data;
  }
};
