'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownRight, ArrowUpRight, History } from 'lucide-react';
import { StockHistoryTable } from '@/modules/stock/components/StockHistoryTable';
import { useStockHistory } from '@/modules/stock/hooks/useStock';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StockEntryForm } from '@/modules/stock/components/StockEntryForm';
import { StockOutputForm } from '@/modules/stock/components/StockOutputForm';

export default function StockPage() {
  const { data: history, isLoading } = useStockHistory();
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Movimentações de Estoque</h2>
          <p className="text-muted-foreground">Gerencie entradas e saídas de produtos no estoque.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-900 shadow-sm transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-300 flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5" />
              Entrada de Estoque
            </CardTitle>
            <CardDescription>
              Registre o recebimento de novos lotes e produtos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white" 
              onClick={() => setIsEntryModalOpen(true)}
            >
              Registrar Nova Entrada
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-900 shadow-sm transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-300 flex items-center gap-2">
              <ArrowDownRight className="h-5 w-5" />
              Saída de Estoque
            </CardTitle>
            <CardDescription>
              Registre a baixa (venda, descarte, uso) de produtos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full sm:w-auto" 
              onClick={() => setIsOutputModalOpen(true)}
            >
              Registrar Nova Saída
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Histórico de Movimentações
          </CardTitle>
          <CardDescription>
            Entradas e saídas funcionam via API, mas o histórico consolidado ainda não possui endpoint de consulta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StockHistoryTable data={history || []} isLoading={isLoading} />
        </CardContent>
      </Card>

      <Dialog open={isEntryModalOpen} onOpenChange={setIsEntryModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Entrada de Estoque</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para dar entrada em um produto.
            </DialogDescription>
          </DialogHeader>
          <StockEntryForm onSuccess={() => setIsEntryModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isOutputModalOpen} onOpenChange={setIsOutputModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar Saída de Estoque</DialogTitle>
            <DialogDescription>
              Registre a retirada de produtos do estoque atual.
            </DialogDescription>
          </DialogHeader>
          <StockOutputForm onSuccess={() => setIsOutputModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
