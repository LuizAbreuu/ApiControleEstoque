'use client';

import React, { useState } from 'react';
import { useProducts } from '@/modules/products/hooks/useProducts';
import { ProductTable } from '@/modules/products/components/ProductTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError } = useProducts(pageIndex + 1, pageSize);

  const products = data?.items || [];
  const pageCount = data?.totalPages || 0;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
        <div className="flex items-center space-x-2">
          <Link href="/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Produto
            </Button>
          </Link>
        </div>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        {isError ? (
          <div className="flex h-[400px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <h3 className="mt-4 text-lg font-semibold">Erro ao carregar produtos</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Ocorreu um erro ao buscar os dados da API. Tente novamente mais tarde.
              </p>
            </div>
          </div>
        ) : (
          <ProductTable 
            data={products} 
            isLoading={isLoading} 
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPagination={setPagination}
          />
        )}
      </div>
    </div>
  );
}
