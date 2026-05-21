'use client';

import { UserList } from '@/modules/users/components/UserList';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UsersPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'Admin') {
    return null; // ou um loading spinner, será redirecionado
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie os acessos ao sistema StockManager.
        </p>
      </div>

      <UserList />
    </div>
  );
}
