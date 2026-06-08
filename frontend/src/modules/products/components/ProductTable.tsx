'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Product } from '../types/product.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FileEdit, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface ProductTableProps {
  data: Product[];
  isLoading: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'price',
    header: 'Preço (R$)',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: 'currentStock',
    header: 'Estoque Atual',
    cell: ({ row }) => {
      const current = parseInt(row.getValue('currentStock'));
      const min = row.original.minimumStock;
      
      let variant: "default" | "destructive" | "secondary" | "outline" = 'default';
      if (current === 0) variant = 'destructive';
      else if (current <= min) variant = 'secondary';
      
      return <Badge variant={variant}>{current}</Badge>;
    },
  },
  {
    accessorKey: 'categoryName',
    header: 'Categoria',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Link href={`/products/${product.id}/edit`}>
            <Button variant="outline" size="icon" title="Editar Produto">
              <FileEdit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export function ProductTable({
  data,
  isLoading,
  pageCount,
  pageIndex,
  pageSize,
  setPagination,
}: ProductTableProps) {
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
      <div className="flex items-center gap-2">
         <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos (Em breve)..."
              className="pl-8"
              disabled
            />
          </div>
      </div>
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
                  Nenhum produto encontrado.
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
