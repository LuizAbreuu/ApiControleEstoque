'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { LowStockReportItem } from '../types/reports';
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
import { ReportExportButton } from './ReportExportButton';

interface LowStockReportProps {
  data: LowStockReportItem[];
  isLoading: boolean;
}

const columns: ColumnDef<LowStockReportItem>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
  },
  {
    accessorKey: 'name',
    header: 'Produto',
  },
  {
    accessorKey: 'currentStock',
    header: 'Estoque Atual',
    cell: ({ row }) => {
      const current = parseInt(row.getValue('currentStock'));
      return (
        <Badge variant={current === 0 ? 'destructive' : 'secondary'}>
          {current}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'minimumStock',
    header: 'Estoque Mínimo',
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const current = parseInt(row.getValue('currentStock'));
      const min = parseInt(row.getValue('minimumStock'));
      
      if (current === 0) return <span className="text-red-500 font-semibold text-sm">Esgotado</span>;
      if (current <= min) return <span className="text-yellow-600 font-semibold text-sm">Abaixo do Mínimo</span>;
      return <span className="text-green-600 font-semibold text-sm">Normal</span>;
    },
  }
];

export function LowStockReport({ data, isLoading }: LowStockReportProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Relatório de Estoque Baixo</h3>
        <ReportExportButton data={data} filename="estoque_baixo" />
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
                  className="h-24 text-center"
                >
                  Nenhum registro encontrado.
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
