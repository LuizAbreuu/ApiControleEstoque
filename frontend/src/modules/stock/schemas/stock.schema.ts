import { z } from 'zod';

export const stockEntrySchema = z.object({
  productId: z.string().uuid('Selecione um produto válido.'),
  batchNumber: z.string().min(1, 'O lote é obrigatório.'),
  quantity: z.coerce.number().int().positive('A quantidade deve ser maior que zero.'),
  expirationDate: z.string().min(1, 'A data de validade é obrigatória.'),
  observation: z.string().optional(),
});

export type StockEntryFormInput = z.input<typeof stockEntrySchema>;
export type StockEntryFormOutput = z.output<typeof stockEntrySchema>;

export const stockOutputSchema = z.object({
  productId: z.string().uuid('Selecione um produto válido.'),
  quantity: z.coerce.number().int().positive('A quantidade deve ser maior que zero.'),
  observation: z.string().optional(),
});

export type StockOutputFormInput = z.input<typeof stockOutputSchema>;
export type StockOutputFormOutput = z.output<typeof stockOutputSchema>;
