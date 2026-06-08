import { z } from 'zod';

export const unitMeasureEnum = z.enum(['1', '2', '3', '4', '5'], {
  message: 'Selecione uma unidade de medida válida.',
});

export const createProductSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  description: z.string().min(5, 'A descrição deve ter no mínimo 5 caracteres.'),
  price: z.coerce.number().min(0.01, 'O preço deve ser maior que zero.'),
  sku: z.string().min(3, 'SKU deve ter no mínimo 3 caracteres.'),
  barcode: z.string().min(8, 'Código de barras inválido.').optional().or(z.literal('')),
  minimumStock: z.coerce.number().int().min(0, 'O estoque mínimo não pode ser negativo.'),
  unitMeasure: z.coerce.number().int().min(1).max(5), // 1=UN, 2=KG, 3=L, 4=CX, 5=PC
  categoryId: z.string().uuid('Categoria inválida. Selecione uma categoria válida.'),
});

export type CreateProductFormValues = z.input<typeof createProductSchema>;
export type CreateProductInput = z.output<typeof createProductSchema>;
