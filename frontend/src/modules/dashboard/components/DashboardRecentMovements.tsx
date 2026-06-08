import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StockEntryDto } from '../types/dashboard.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardRecentMovementsProps {
  expiredBatches: StockEntryDto[];
}

export function DashboardRecentMovements({ expiredBatches }: DashboardRecentMovementsProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Atenção: Lotes Vencidos</CardTitle>
        <CardDescription>
          Os seguintes lotes já passaram da data de validade e requerem descarte ou revisão.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lote</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expiredBatches.length > 0 ? (
              expiredBatches.slice(0, 5).map((batch) => (
                <TableRow key={batch.batchNumber}>
                  <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                  <TableCell>{batch.quantity}</TableCell>
                  <TableCell>
                    {format(new Date(batch.expirationDate), "dd 'de' MMM, yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="destructive">Vencido</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhum lote vencido.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
