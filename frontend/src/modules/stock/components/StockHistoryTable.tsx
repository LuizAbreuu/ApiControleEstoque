'use client';

import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { StockMovement } from '../types/stock';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface StockHistoryTableProps {
  data: StockMovement[];
  isLoading: boolean;
}

export function StockHistoryTable({ data, isLoading }: StockHistoryTableProps) {
  const columns = React.useMemo<ColumnDef<StockMovement>[]>(
    () => [
      {
        accessorKey: 'type',
        header: 'Tipo',
        cell: ({ row }) => {
          const type = row.getValue('type') as string;
          return type === 'ENTRY' ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              Entrada
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              <ArrowDownRight className="mr-1 h-3 w-3" />
              Saída
            </Badge>
          );
        },
      },
      {
        accessorKey: 'date',
        header: 'Data',
        cell: ({ row }) => {
          const date = row.getValue('date') as string;
          return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
        },
      },
      {
        accessorKey: 'productName',
        header: 'Produto',
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
      },
      {
        accessorKey: 'quantity',
        header: 'Quantidade',
        cell: ({ row }) => {
          const type = row.original.type;
          const qty = row.getValue('quantity') as number;
          return (
            <span className={type === 'ENTRY' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {type === 'ENTRY' ? '+' : '-'}{qty}
            </span>
          );
        },
      },
      {
        accessorKey: 'observation',
        header: 'Observação',
        cell: ({ row }) => {
          const obs = row.getValue('observation') as string;
          return <span className="text-muted-foreground">{obs || '-'}</span>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando histórico...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhuma movimentação encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
