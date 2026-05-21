import { z } from 'zod';

export const stockEntrySchema = z.object({
  productId: z.string().min(1, 'Produto é obrigatório'),
  quantity: z.coerce.number().positive('Quantidade deve ser maior que zero'),
  batchNumber: z.string().min(1, 'Lote é obrigatório'),
  expirationDate: z.string().min(1, 'Data de validade é obrigatória'),
  notes: z.string().optional(),
});

export type StockEntryFormData = z.infer<typeof stockEntrySchema>;

export const stockOutputSchema = z.object({
  productId: z.string().min(1, 'Produto é obrigatório'),
  quantity: z.coerce.number().positive('Quantidade deve ser maior que zero'),
  notes: z.string().optional(),
});

export type StockOutputFormData = z.infer<typeof stockOutputSchema>;

export const stockAdjustmentSchema = z.object({
  productId: z.string().min(1, 'Produto é obrigatório'),
  batchId: z.string().optional(),
  quantity: z.coerce.number().refine(val => val !== 0, 'Ajuste não pode ser zero'),
  notes: z.string().min(3, 'Motivo do ajuste é obrigatório'),
});

export type StockAdjustmentFormData = z.infer<typeof stockAdjustmentSchema>;

export const stockDisposalSchema = z.object({
  productId: z.string().min(1, 'Produto é obrigatório'),
  batchId: z.string().optional(),
  quantity: z.coerce.number().positive('Quantidade deve ser maior que zero'),
  notes: z.string().min(3, 'Motivo do descarte é obrigatório'),
});

export type StockDisposalFormData = z.infer<typeof stockDisposalSchema>;
