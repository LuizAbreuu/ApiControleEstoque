import { z } from 'zod';

export const batchSchema = z.object({
  productId: z.string().min(1, 'O produto é obrigatório'),
  batchNumber: z.string().min(1, 'O número do lote é obrigatório'),
  quantity: z.coerce.number().min(1, 'A quantidade deve ser maior que zero'),
  expirationDate: z.string().min(1, 'A data de validade é obrigatória'),
});

export type BatchFormValues = z.infer<typeof batchSchema>;
