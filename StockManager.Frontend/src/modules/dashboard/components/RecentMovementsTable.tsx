'use client';

import { useRecentMovements } from '../hooks/useDashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function RecentMovementsTable() {
  const { data, isLoading } = useRecentMovements();

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Entry': return 'default';
      case 'Output': return 'destructive';
      case 'Adjustment': return 'secondary';
      default: return 'outline';
    }
  };

  const getTranslatedType = (type: string) => {
    switch (type) {
      case 'Entry': return 'Entrada';
      case 'Output': return 'Saída';
      case 'Adjustment': return 'Ajuste';
      case 'Disposal': return 'Descarte';
      default: return type;
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Últimas Movimentações</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Carregando...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-medium">{movement.productName}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(movement.type) as any}>
                      {getTranslatedType(movement.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.userName}</TableCell>
                  <TableCell className="text-right">
                    {format(new Date(movement.date), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))}
              {!data?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    Nenhuma movimentação recente encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
