import { api } from '@/lib/axios';
import { CreateProductInput } from '../schemas/product.schema';
import { Product, ProductListApiResponse, ProductListResponse } from '../types/product.types';

export const productService = {
  async getProducts(pageNumber: number = 1, pageSize: number = 10): Promise<ProductListResponse> {
    const response = await api.get<ProductListApiResponse>('/products', {
      params: {
        pageNumber,
        pageSize,
      },
    });

    return {
      items: response.data.data,
      totalCount: response.data.totalCount,
      pageNumber: response.data.pageNumber,
      pageSize: response.data.pageSize,
      totalPages: response.data.totalPages,
    };
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async createProduct(data: CreateProductInput): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },
};
