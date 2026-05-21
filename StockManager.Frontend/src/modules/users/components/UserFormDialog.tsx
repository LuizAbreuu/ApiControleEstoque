'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormData } from '../schemas/user.schema';
import { useCreateUser, useUpdateUser } from '../hooks/useUsers';
import { User } from '../types/user.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const isEditing = !!user;
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'Employee',
      status: user?.status || 'Active',
      password: '',
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (isEditing) {
      updateMutation.mutate({ 
        id: user.id, 
        data: { 
          name: data.name, 
          email: data.email, 
          role: data.role as 'Admin' | 'Employee', 
          status: data.status as 'Active' | 'Inactive' 
        } 
      }, {
        onSuccess: () => {
          toast.success('Usuário atualizado com sucesso!');
          onOpenChange(false);
          reset();
        },
        onError: () => toast.error('Erro ao atualizar usuário'),
      });
    } else {
      createMutation.mutate({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role as 'Admin' | 'Employee',
      }, {
        onSuccess: () => {
          toast.success('Usuário criado com sucesso!');
          onOpenChange(false);
          reset();
        },
        onError: () => toast.error('Erro ao criar usuário'),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados do usuário abaixo.' : 'Preencha os dados para criar um novo acesso.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" {...register('name')} disabled={isPending} />
            {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" {...register('email')} disabled={isPending || isEditing} />
            {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register('password')} disabled={isPending} />
              {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
            </div>
          )}

          <div className="space-y-2">
            <Label>Perfil de Acesso</Label>
            <Select 
              disabled={isPending} 
              onValueChange={(val) => setValue('role', val as 'Admin' | 'Employee')} 
              value={watch('role')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Administrador</SelectItem>
                <SelectItem value="Employee">Funcionário</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <span className="text-xs text-destructive">{errors.role.message}</span>}
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                disabled={isPending} 
                onValueChange={(val) => setValue('status', val as 'Active' | 'Inactive')} 
                value={watch('status')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Ativo</SelectItem>
                  <SelectItem value="Inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
