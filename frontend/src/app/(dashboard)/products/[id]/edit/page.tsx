'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useProduct } from '@/modules/products/hooks/useProducts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: product, isLoading, isError } = useProduct(id);

  if (isLoading) {
    return <div className="p-8">Carregando detalhes do produto...</div>;
  }

  if (isError || !product) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-red-600">Erro</h2>
        <p>Não foi possível carregar o produto.</p>
        <Link href="/products" className="mt-4 inline-block text-blue-600 hover:underline">Voltar para a lista</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Detalhes do Produto</h2>
      </div>
      
      <div className="mt-8 rounded-md border p-6 max-w-2xl bg-card">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-muted-foreground">Nome</dt>
            <dd className="mt-1 text-sm font-semibold">{product.name}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-muted-foreground">SKU</dt>
            <dd className="mt-1 text-sm">{product.sku}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-muted-foreground">Descrição</dt>
            <dd className="mt-1 text-sm">{product.description}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-muted-foreground">Preço</dt>
            <dd className="mt-1 text-sm">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-muted-foreground">Código de Barras</dt>
            <dd className="mt-1 text-sm">{product.barcode || '-'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-muted-foreground">Estoque Atual</dt>
            <dd className="mt-1 text-sm">{product.currentStock}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-muted-foreground">Estoque Mínimo</dt>
            <dd className="mt-1 text-sm">{product.minimumStock}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-muted-foreground">Unidade de Medida</dt>
            <dd className="mt-1 text-sm">{product.unitMeasure}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-muted-foreground">Categoria</dt>
            <dd className="mt-1 text-sm">{product.categoryName}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-2xl" role="alert">
        <p className="font-bold">Aviso</p>
        <p>A edição de produtos ainda não está disponível na API (Endpoint não implementado).</p>
      </div>

      <div className="flex justify-start mt-6">
        <Link href="/products">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
    </div>
  );
}
