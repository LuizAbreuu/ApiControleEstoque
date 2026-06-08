import { api } from '@/lib/axios';
import { Category } from '../types/category.types';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },
};
