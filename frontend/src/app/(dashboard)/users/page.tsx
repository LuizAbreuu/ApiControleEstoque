'use client';

import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser } from '@/modules/users/hooks/useUsers';
import { UserTable } from '@/modules/users/components/UserTable';
import { UserForm } from '@/modules/users/components/UserForm';
import { User } from '@/modules/users/types/user.types';
import { UserFormData } from '@/modules/users/schemas/user.schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function UsersPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data, isLoading, isError } = useUsers(pagination.pageIndex + 1, pagination.pageSize);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const isUnsupported = isError;

  const handleOpenCreate = () => {
    if (isUnsupported) return;
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (formData: UserFormData) => {
    if (editingUser) {
      updateUser.mutate(
        { id: editingUser.id, data: formData },
        {
          onSuccess: () => {
            toast.success('Usuário atualizado com sucesso!');
            handleCloseModal();
          },
          onError: () => {
            toast.error('Erro ao atualizar usuário.');
          },
        }
      );
    } else {
      createUser.mutate(formData, {
        onSuccess: () => {
          toast.success('Usuário criado com sucesso!');
          handleCloseModal();
        },
        onError: () => {
          toast.error('Erro ao criar usuário.');
        },
      });
    }
  };

  const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 0;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleOpenCreate} disabled={isUnsupported} title={isUnsupported ? 'Endpoint ainda não implementado na API' : undefined}>
            <Plus className="mr-2 h-4 w-4" /> Novo Usuário
          </Button>
        </div>
      </div>

      {isUnsupported ? (
        <div className="rounded-md border border-dashed bg-amber-50 p-6 text-sm text-amber-900">
          A tela de usuários está pronta no frontend, mas a API ainda não expõe endpoints como <code>/api/users</code>.
        </div>
      ) : (
        <UserTable
          data={data?.data || []}
          isLoading={isLoading}
          pageCount={totalPages}
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          setPagination={setPagination}
          onEdit={handleOpenEdit}
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Atualize os dados do usuário abaixo.'
                : 'Preencha os dados para criar um novo usuário.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <UserForm
              initialData={
                editingUser
                  ? {
                      name: editingUser.name,
                      email: editingUser.email,
                      role: editingUser.role,
                      isActive: editingUser.isActive,
                    }
                  : undefined
              }
              onSubmit={handleSubmit}
              isLoading={createUser.isPending || updateUser.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
