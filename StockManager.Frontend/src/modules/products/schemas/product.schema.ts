import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'A categoria é obrigatória'),
  price: z.coerce.number().min(0.01, 'O preço deve ser maior que zero'),
  minimumStock: z.coerce.number().min(0, 'O estoque mínimo deve ser maior ou igual a zero'),
  unitMeasure: z.coerce.number(),
  sku: z.string().min(1, 'O SKU é obrigatório'),
  barcode: z.string().optional(),
  active: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;
