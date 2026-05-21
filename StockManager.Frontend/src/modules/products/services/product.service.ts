import { api } from '@/services/api';
import { Product, Category } from '../types/product.types';
import { ProductFormValues } from '../schemas/product.schema';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    // Mock until API is fully ready or if we want to test UI
    // return api.get<Product[]>('/products');
    
    return [
      { id: '1', name: 'Notebook Dell Inspiron', description: 'Core i7', categoryId: 'c1', categoryName: 'Eletrônicos', price: 4500, minimumStock: 5, unitMeasure: 0, sku: 'NOTE-DELL-01', barcode: '123456', active: true, currentStock: 15 },
      { id: '2', name: 'Mouse Logitech G PRO', description: 'Sem fio', categoryId: 'c1', categoryName: 'Eletrônicos', price: 450, minimumStock: 10, unitMeasure: 0, sku: 'MOUSE-LOGI-01', barcode: '654321', active: true, currentStock: 8 },
    ];
  },

  getById: async (id: string): Promise<Product> => {
    // return api.get<Product>(`/products/${id}`);
    return { id, name: 'Notebook Dell Inspiron', description: 'Core i7', categoryId: 'c1', categoryName: 'Eletrônicos', price: 4500, minimumStock: 5, unitMeasure: 0, sku: 'NOTE-DELL-01', barcode: '123456', active: true, currentStock: 15 };
  },

  create: async (data: ProductFormValues): Promise<Product> => {
    // return api.post<Product>('/products', data);
    console.log('Created:', data);
    return { id: Math.random().toString(), ...data } as Product;
  },

  update: async (id: string, data: ProductFormValues): Promise<Product> => {
    // return api.put<Product>(`/products/${id}`, data);
    console.log('Updated:', id, data);
    return { id, ...data } as Product;
  },

  delete: async (id: string): Promise<void> => {
    // return api.delete(`/products/${id}`);
    console.log('Deleted:', id);
  },

  getCategories: async (): Promise<Category[]> => {
    return [
      { id: 'c1', name: 'Eletrônicos' },
      { id: 'c2', name: 'Móveis' },
      { id: 'c3', name: 'Papelaria' },
    ];
  }
};
