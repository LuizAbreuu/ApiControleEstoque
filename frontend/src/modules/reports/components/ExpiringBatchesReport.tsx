'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { ExpiringBatchReportItem } from '../types/reports';
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
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExpiringBatchesReportProps {
  data: ExpiringBatchReportItem[];
  isLoading: boolean;
}

const columns: ColumnDef<ExpiringBatchReportItem>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
  },
  {
    accessorKey: 'productName',
    header: 'Produto',
  },
  {
    accessorKey: 'batchNumber',
    header: 'Lote',
  },
  {
    accessorKey: 'currentQuantity',
    header: 'Qtd. no Lote',
  },
  {
    accessorKey: 'expirationDate',
    header: 'Data de Vencimento',
    cell: ({ row }) => {
      try {
        const dateStr = row.getValue('expirationDate') as string;
        const formatted = format(parseISO(dateStr), 'dd/MM/yyyy', { locale: ptBR });
        return <span>{formatted}</span>;
      } catch (e) {
        return <span>-</span>;
      }
    },
  },
  {
    accessorKey: 'daysUntilExpiration',
    header: 'Status',
    cell: ({ row }) => {
      const days = parseInt(row.getValue('daysUntilExpiration'));
      
      if (days < 0) {
        return <Badge variant="destructive">Vencido há {Math.abs(days)} dias</Badge>;
      } else if (days === 0) {
        return <Badge variant="destructive">Vence Hoje</Badge>;
      } else if (days <= 30) {
        return <Badge variant="secondary">Vence em {days} dias</Badge>;
      }
      return <Badge variant="default">No prazo ({days} dias)</Badge>;
    },
  }
];

export function ExpiringBatchesReport({ data, isLoading }: ExpiringBatchesReportProps) {
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
        <h3 className="text-lg font-medium">Relatório de Lotes a Vencer / Vencidos</h3>
        <ReportExportButton data={data} filename="lotes_vencimento" />
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
