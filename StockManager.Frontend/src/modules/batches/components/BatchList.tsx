'use client';

import { useBatches, useProductBatches } from '../hooks/useBatches';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BatchListProps {
  productId?: string; // Se passado, filtra por produto. Se não, busca todos.
}

export function BatchList({ productId }: BatchListProps) {
  // Chamamos um ou outro hook baseado na prop
  const allBatchesQuery = useBatches();
  const productBatchesQuery = useProductBatches(productId!);

  const isLoading = productId ? productBatchesQuery.isLoading : allBatchesQuery.isLoading;
  const data = productId ? productBatchesQuery.data : allBatchesQuery.data;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Badge variant="default">Ativo</Badge>;
      case 'Expiring': return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white">Próximo ao Vencimento</Badge>;
      case 'Expired': return <Badge variant="destructive">Vencido</Badge>;
      case 'Depleted': return <Badge variant="outline">Esgotado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-lg bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lote</TableHead>
            {!productId && <TableHead>Produto</TableHead>}
            <TableHead>Validade</TableHead>
            <TableHead>Data de Entrada</TableHead>
            <TableHead className="text-right">Quantidade Atual</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={productId ? 5 : 6} className="text-center h-24 text-muted-foreground">
                Carregando lotes...
              </TableCell>
            </TableRow>
          ) : data?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={productId ? 5 : 6} className="text-center h-24 text-muted-foreground">
                Nenhum lote encontrado.
              </TableCell>
            </TableRow>
          ) : (
            data?.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                {!productId && <TableCell>{batch.productName}</TableCell>}
                <TableCell>
                  {format(new Date(batch.expirationDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(batch.entryDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {batch.quantity} <span className="text-xs text-muted-foreground font-normal">/ {batch.originalQuantity}</span>
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(batch.status)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
