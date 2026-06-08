import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  role: z.enum(['Admin', 'Employee']),
  isActive: z.boolean().default(true),
});

export type UserFormInput = z.input<typeof userSchema>;
export type UserFormData = z.output<typeof userSchema>;
