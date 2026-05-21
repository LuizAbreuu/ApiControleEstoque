'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  useLowStockReport, 
  useExpiredReport, 
  useExpiringReport, 
  useExportReport 
} from '../hooks/useReports';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ReportViews() {
  const exportMutation = useExportReport();
  
  const { data: lowStockData, isLoading: loadingLowStock } = useLowStockReport();
  const { data: expiredData, isLoading: loadingExpired } = useExpiredReport();
  const { data: expiringData, isLoading: loadingExpiring } = useExpiringReport(30);

  const handleExport = (reportType: string) => {
    exportMutation.mutate(reportType, {
      onSuccess: () => toast.success('Relatório exportado com sucesso!'),
      onError: () => toast.error('Erro ao exportar relatório. Tente novamente.'),
    });
  };

  return (
    <Tabs defaultValue="low-stock" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="low-stock">Estoque Baixo</TabsTrigger>
        <TabsTrigger value="expiring">Próximos do Vencimento</TabsTrigger>
        <TabsTrigger value="expired">Vencidos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="low-stock">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Relatório de Estoque Baixo</CardTitle>
              <CardDescription>Produtos que atingiram ou estão abaixo do estoque mínimo definido.</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('low-stock')}
              disabled={exportMutation.isPending || !lowStockData?.length}
            >
              <Download className="mr-2 h-4 w-4" /> Exportar Excel
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Estoque Atual</TableHead>
                    <TableHead className="text-right">Mínimo</TableHead>
                    <TableHead className="text-right">Faltam</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingLowStock ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">Carregando...</TableCell></TableRow>
                  ) : lowStockData?.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">Nenhum produto com estoque baixo.</TableCell></TableRow>
                  ) : (
                    lowStockData?.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell className="text-right text-destructive font-bold">{item.currentStock}</TableCell>
                        <TableCell className="text-right">{item.minimumStock}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{item.difference}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="expiring">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lotes Próximos do Vencimento</CardTitle>
              <CardDescription>Lotes que vencerão nos próximos 30 dias.</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('expiring')}
              disabled={exportMutation.isPending || !expiringData?.length}
            >
              <Download className="mr-2 h-4 w-4" /> Exportar Excel
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lote</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead className="text-right">Dias Restantes</TableHead>
                    <TableHead className="text-right">Qtd em Estoque</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingExpiring ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">Carregando...</TableCell></TableRow>
                  ) : expiringData?.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">Nenhum lote próximo do vencimento.</TableCell></TableRow>
                  ) : (
                    expiringData?.map((item) => (
                      <TableRow key={item.batchId}>
                        <TableCell className="font-medium">{item.batchNumber}</TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{format(new Date(item.expirationDate), 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="text-right text-amber-600 font-bold">{item.daysRemaining}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="expired">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lotes Vencidos</CardTitle>
              <CardDescription>Lotes que já ultrapassaram a data de validade, requer atenção imediata (Descarte).</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('expired')}
              disabled={exportMutation.isPending || !expiredData?.length}
            >
              <Download className="mr-2 h-4 w-4" /> Exportar Excel
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lote</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Venceu em</TableHead>
                    <TableHead className="text-right">Dias Vencidos</TableHead>
                    <TableHead className="text-right">Qtd Presa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingExpired ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">Carregando...</TableCell></TableRow>
                  ) : expiredData?.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">Nenhum lote vencido.</TableCell></TableRow>
                  ) : (
                    expiredData?.map((item) => (
                      <TableRow key={item.batchId}>
                        <TableCell className="font-medium">{item.batchNumber}</TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{format(new Date(item.expirationDate), 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="text-right text-destructive font-bold">{item.daysExpired}</TableCell>
                        <TableCell className="text-right font-medium">{item.quantity}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
