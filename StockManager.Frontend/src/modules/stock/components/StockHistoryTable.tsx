'use client';

import { useStockHistory } from '../hooks/useStock';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { StockMovementType } from '../types/stock.types';

export function StockHistoryTable() {
  const { data, isLoading } = useStockHistory();

  const getTypeBadge = (type: StockMovementType) => {
    switch (type) {
      case 'Entry':
        return <Badge className="bg-green-600 hover:bg-green-700">Entrada</Badge>;
      case 'Output':
        return <Badge variant="secondary">Saída</Badge>;
      case 'Adjustment':
        return <Badge variant="outline" className="border-amber-500 text-amber-600">Ajuste</Badge>;
      case 'Disposal':
        return <Badge variant="destructive">Descarte</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="border rounded-lg bg-card mt-6">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Histórico de Movimentações</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Lote</TableHead>
            <TableHead className="text-right">Qtd</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Observação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                Carregando histórico...
              </TableCell>
            </TableRow>
          ) : data?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                Nenhuma movimentação encontrada.
              </TableCell>
            </TableRow>
          ) : (
            data?.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>
                  {format(new Date(movement.date), "dd/MM/yyyy HH:mm")}
                </TableCell>
                <TableCell>{getTypeBadge(movement.type)}</TableCell>
                <TableCell className="font-medium">{movement.productName || movement.productId}</TableCell>
                <TableCell>{movement.batchNumber || '-'}</TableCell>
                <TableCell className="text-right font-semibold">
                  {movement.type === 'Output' || movement.type === 'Disposal' ? '-' : '+'}
                  {movement.quantity}
                </TableCell>
                <TableCell>{movement.userName || movement.userId}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={movement.notes}>
                  {movement.notes || '-'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
