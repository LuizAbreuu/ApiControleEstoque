'use client';

import React, { useState } from 'react';
import { useBatches, useExpiredBatches } from '@/modules/batches/hooks/useBatches';
import { BatchTable } from '@/modules/batches/components/BatchTable';
import { Button } from '@/components/ui/button';
import { Plus, PackageSearch, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BatchesPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const allBatchesQuery = useBatches();
  const expiredBatchesQuery = useExpiredBatches();
  
  const isLoading = activeTab === 'all' ? allBatchesQuery.isLoading : expiredBatchesQuery.isLoading;
  const isError = activeTab === 'all' ? allBatchesQuery.isError : expiredBatchesQuery.isError;
  const data = activeTab === 'all' ? allBatchesQuery.data : expiredBatchesQuery.data;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Lotes</h2>
        <div className="flex items-center space-x-2">
          <Button disabled title="Em breve">
            <Plus className="mr-2 h-4 w-4" /> Registrar Lote
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <PackageSearch className="h-4 w-4" />
            Todos os Lotes
          </TabsTrigger>
          <TabsTrigger value="expired" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Lotes Vencidos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border border-dashed bg-amber-50 p-4 text-sm text-amber-900">
            A listagem completa de lotes ainda não possui endpoint dedicado na API. Apenas a visão de lotes vencidos está conectada.
          </div>
          <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
            {isError ? (
              <div className="flex h-[400px] shrink-0 items-center justify-center rounded-md border border-dashed">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <h3 className="mt-4 text-lg font-semibold">Erro ao carregar lotes</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Ocorreu um erro ao buscar os dados da API.
                  </p>
                </div>
              </div>
            ) : (
              <BatchTable 
                data={data || []} 
                isLoading={isLoading} 
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="expired" className="space-y-4">
          <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
            {isError ? (
              <div className="flex h-[400px] shrink-0 items-center justify-center rounded-md border border-dashed">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <h3 className="mt-4 text-lg font-semibold">Erro ao carregar lotes vencidos</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Ocorreu um erro ao buscar os dados da API.
                  </p>
                </div>
              </div>
            ) : (
              <BatchTable 
                data={data || []} 
                isLoading={isLoading} 
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
