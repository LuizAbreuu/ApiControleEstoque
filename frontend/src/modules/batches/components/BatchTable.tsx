'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Batch } from '../types/batch';
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
import { FileEdit, Search, AlertTriangle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BatchTableProps {
  data: Batch[];
  isLoading: boolean;
}

export const columns: ColumnDef<Batch>[] = [
  {
    accessorKey: 'batchNumber',
    header: 'Nº do Lote',
  },
  {
    accessorKey: 'productId',
    header: 'ID do Produto', // Idealmente teríamos o nome, mas a API de lotes vencidos retorna só ID
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.productId}</span>
    )
  },
  {
    accessorKey: 'quantity',
    header: 'Quantidade',
    cell: ({ row }) => {
      return <span>{row.original.quantity}</span>;
    },
  },
  {
    accessorKey: 'expirationDate',
    header: 'Data de Vencimento',
    cell: ({ row }) => {
      const dateStr = row.original.expirationDate;
      if (!dateStr) return <span>-</span>;
      
      const date = new Date(dateStr);
      const today = new Date();
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let variant: "default" | "destructive" | "secondary" | "outline" = 'default';
      let icon = null;
      let textClass = "";
      
      if (diffDays < 0) {
        variant = 'destructive';
        icon = <AlertCircle className="w-3 h-3 mr-1 inline-block" />;
      } else if (diffDays <= 30) {
        variant = 'secondary';
        icon = <AlertTriangle className="w-3 h-3 mr-1 inline-block text-amber-500" />;
        textClass = "text-amber-500 font-medium";
      } else {
        variant = 'outline';
        textClass = "text-emerald-500 font-medium";
      }
      
      return (
        <Badge variant={variant} className={textClass}>
          {icon}
          {date.toLocaleDateString('pt-BR')}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const batch = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon" title="Editar Lote" disabled>
            <FileEdit className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export function BatchTable({
  data,
  isLoading,
}: BatchTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
         <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar lotes..."
              className="pl-8"
              value={(table.getColumn('batchNumber')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('batchNumber')?.setFilterValue(event.target.value)
              }
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
              Array.from({ length: 5 }).map((_, index) => (
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
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum lote encontrado.
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
