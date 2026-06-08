'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LowStockReport } from '@/modules/reports/components/LowStockReport';
import { ExpiringBatchesReport } from '@/modules/reports/components/ExpiringBatchesReport';
import { useExpiringBatchesReport, useLowStockReport } from '@/modules/reports/hooks/useReports';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('low-stock');

  const { data: lowStockData, isLoading: isLoadingLowStock } = useLowStockReport();
  const { data: expiringBatchesData, isLoading: isLoadingExpiringBatches } = useExpiringBatchesReport();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
      </div>

      <Tabs defaultValue="low-stock" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="low-stock">Estoque Baixo</TabsTrigger>
          <TabsTrigger value="expiring-batches">Vencimentos</TabsTrigger>
        </TabsList>
        <TabsContent value="low-stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Produtos com Estoque Baixo</CardTitle>
              <CardDescription>
                Acompanhamento de produtos que atingiram ou estão abaixo do estoque mínimo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LowStockReport 
                data={lowStockData || []} 
                isLoading={isLoadingLowStock} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expiring-batches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lotes Próximos ao Vencimento / Vencidos</CardTitle>
              <CardDescription>
                Controle de lotes que necessitam de atenção imediata por expiração.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpiringBatchesReport 
                data={expiringBatchesData || []} 
                isLoading={isLoadingExpiringBatches} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
