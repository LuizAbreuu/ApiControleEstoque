import { api } from '@/services/api';
import { ProductBatch } from '../types/batch.types';
import { BatchFormValues } from '../schemas/batch.schema';

export const batchService = {
  getAll: async (): Promise<ProductBatch[]> => {
    // return api.get<ProductBatch[]>('/batches');
    const now = new Date();
    const futureDate = new Date();
    futureDate.setMonth(now.getMonth() + 6);
    
    const nearDate = new Date();
    nearDate.setDate(now.getDate() + 15);
    
    const pastDate = new Date();
    pastDate.setMonth(now.getMonth() - 1);

    return [
      { id: '1', productId: '1', productName: 'Notebook Dell Inspiron', batchNumber: 'LT-001', originalQuantity: 50, quantity: 15, entryDate: now.toISOString(), expirationDate: futureDate.toISOString(), status: 'Active' },
      { id: '2', productId: '2', productName: 'Mouse Logitech G PRO', batchNumber: 'LT-002', originalQuantity: 20, quantity: 5, entryDate: now.toISOString(), expirationDate: nearDate.toISOString(), status: 'Expiring' },
      { id: '3', productId: '1', productName: 'Notebook Dell Inspiron', batchNumber: 'LT-003', originalQuantity: 10, quantity: 2, entryDate: now.toISOString(), expirationDate: pastDate.toISOString(), status: 'Expired' },
    ];
  },

  getByProductId: async (productId: string): Promise<ProductBatch[]> => {
    // return api.get<ProductBatch[]>(`/batches/product/${productId}`);
    const batches = await batchService.getAll();
    return batches.filter(b => b.productId === productId);
  },

  create: async (data: BatchFormValues): Promise<ProductBatch> => {
    // return api.post<ProductBatch>('/batches', data);
    return {
      id: Math.random().toString(),
      ...data,
      originalQuantity: data.quantity,
      entryDate: new Date().toISOString(),
      status: 'Active',
    } as ProductBatch;
  }
};
