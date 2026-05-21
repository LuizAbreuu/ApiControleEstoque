'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StockEntryForm } from './StockEntryForm';
import { StockOutputForm } from './StockOutputForm';
import { StockAdjustmentForm } from './StockAdjustmentForm';
import { StockDisposalForm } from './StockDisposalForm';

export function StockOperations() {
  return (
    <Tabs defaultValue="entry" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="entry">Entrada</TabsTrigger>
        <TabsTrigger value="output">Saída</TabsTrigger>
        <TabsTrigger value="adjustment">Ajuste</TabsTrigger>
        <TabsTrigger value="disposal">Descarte</TabsTrigger>
      </TabsList>
      
      <TabsContent value="entry">
        <Card>
          <CardHeader>
            <CardTitle>Entrada de Estoque</CardTitle>
            <CardDescription>
              Registre a entrada de novos produtos. Esta ação criará um novo lote.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StockEntryForm />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="output">
        <Card>
          <CardHeader>
            <CardTitle>Saída de Estoque</CardTitle>
            <CardDescription>
              Registre a saída de produtos. O sistema usará o método FIFO automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StockOutputForm />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="adjustment">
        <Card>
          <CardHeader>
            <CardTitle>Ajuste de Estoque</CardTitle>
            <CardDescription>
              Corrija divergências de estoque. Exclusivo para administradores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StockAdjustmentForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="disposal">
        <Card>
          <CardHeader>
            <CardTitle>Descarte de Produto</CardTitle>
            <CardDescription>
              Registre perda, avaria ou vencimento de produtos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StockDisposalForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
