'use client';

import { useState } from 'react';
import { useUsers, useToggleUserStatus } from '../hooks/useUsers';
import { User } from '../types/user.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Edit, Power, PowerOff, Plus } from 'lucide-react';
import { UserFormDialog } from './UserFormDialog';
import { toast } from 'sonner';

export function UserList() {
  const { data: users, isLoading } = useUsers();
  const toggleStatusMutation = useToggleUserStatus();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreateNew = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const action = currentStatus === 'Active' ? 'inativar' : 'ativar';
    if (confirm(`Deseja realmente ${action} este usuário?`)) {
      toggleStatusMutation.mutate(id, {
        onSuccess: () => toast.success(`Usuário ${action}do com sucesso!`),
        onError: () => toast.error(`Erro ao ${action} usuário.`)
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Carregando usuários...
                </TableCell>
              </TableRow>
            ) : users?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.status === 'Active' ? (
                      <Badge className="bg-green-600 hover:bg-green-700">Ativo</Badge>
                    ) : (
                      <Badge variant="destructive">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} title="Editar Usuário">
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      title={user.status === 'Active' ? 'Inativar' : 'Ativar'}
                      disabled={toggleStatusMutation.isPending}
                    >
                      {user.status === 'Active' ? (
                        <PowerOff className="h-4 w-4 text-red-600" />
                      ) : (
                        <Power className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isDialogOpen && (
        <UserFormDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          user={selectedUser} 
        />
      )}
    </div>
  );
}
