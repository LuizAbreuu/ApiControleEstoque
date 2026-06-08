'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormData, UserFormInput } from '../schemas/user.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormInput, unknown, UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      role: 'Employee',
      isActive: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input id="name" placeholder="Ex: João da Silva" {...register('name')} />
        {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" placeholder="Ex: joao@empresa.com" {...register('email')} />
        {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Perfil</Label>
        <select
          id="role"
          {...register('role')}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="Employee">Funcionário (Employee)</option>
          <option value="Admin">Administrador (Admin)</option>
        </select>
        {errors.role && <span className="text-sm text-destructive">{errors.role.message}</span>}
      </div>

      <div className="flex items-center space-x-2 py-2">
        <input
          type="checkbox"
          id="isActive"
          {...register('isActive')}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="isActive">Usuário Ativo</Label>
      </div>

      <div className="flex justify-end pt-4 space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}
