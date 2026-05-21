'use client';

import { useParams } from 'next/navigation';
import { useProduct } from '@/modules/products/hooks/useProducts';
import { ProductForm } from '@/modules/products/components/ProductForm';
import { BatchList } from '@/modules/batches/components/BatchList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: product, isLoading } = useProduct(id);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando detalhes do produto...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center text-destructive">Produto não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
        <p className="text-muted-foreground">
          SKU: {product.sku} | Categoria: {product.categoryName}
        </p>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Detalhes e Edição</TabsTrigger>
          <TabsTrigger value="stock">Estoque e Lotes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <ProductForm initialData={product} />
        </TabsContent>
        
        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>Lotes Vinculados e Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Atual</p>
                  <p className="text-2xl font-bold">{product.currentStock || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Estoque Mínimo</p>
                  <p className="text-xl font-semibold">{product.minimumStock}</p>
                </div>
              </div>
              
              <BatchList productId={product.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
