import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres').optional(),
  role: z.enum(['Admin', 'Employee'], { required_error: 'Perfil é obrigatório' }),
  status: z.enum(['Active', 'Inactive']).optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
