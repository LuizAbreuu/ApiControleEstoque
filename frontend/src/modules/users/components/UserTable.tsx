'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { User } from '../types/user.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserTableProps {
  data: User[];
  isLoading: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
  onEdit: (user: User) => void;
}

export function UserTable({
  data,
  isLoading,
  pageCount,
  pageIndex,
  pageSize,
  setPagination,
  onEdit
}: UserTableProps) {
  
  const columns = React.useMemo<ColumnDef<User>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'email',
      header: 'E-mail',
    },
    {
      accessorKey: 'role',
      header: 'Perfil',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge variant={role === 'Admin' ? 'default' : 'secondary'}>
            {role === 'Admin' ? 'Administrador' : 'Funcionário'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge variant={isActive ? 'default' : 'destructive'} className={isActive ? 'bg-green-600' : ''}>
            {isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Criado em',
      cell: ({ row }) => {
        try {
          const dateStr = row.getValue('createdAt') as string;
          return <span>{format(parseISO(dateStr), 'dd/MM/yyyy', { locale: ptBR })}</span>;
        } catch {
          return <span>-</span>;
        }
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="icon" onClick={() => onEdit(user)} title="Editar Usuário">
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ], [onEdit]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        setPagination(updater({ pageIndex, pageSize }));
      } else {
        setPagination(updater);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount() || 1}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
