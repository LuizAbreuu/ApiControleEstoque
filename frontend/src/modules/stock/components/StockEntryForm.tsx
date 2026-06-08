'use client';

import React from 'react';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockEntrySchema, StockEntryFormInput, StockEntryFormOutput } from '../schemas/stock.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRegisterEntry } from '../hooks/useStock';
import { useProducts } from '@/modules/products/hooks/useProducts';

interface StockEntryFormProps {
  onSuccess?: () => void;
}

export function StockEntryForm({ onSuccess }: StockEntryFormProps) {
  const registerEntry = useRegisterEntry();
  // Busca os produtos para o select (buscando primeiros 100 para simplificar, ideal seria um Combobox com paginação/search)
  const { data: productsData, isLoading: isLoadingProducts } = useProducts(1, 100);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StockEntryFormInput, unknown, StockEntryFormOutput>({
    resolver: zodResolver(stockEntrySchema),
    defaultValues: {
      productId: '',
      batchNumber: '',
      quantity: 1,
      expirationDate: '',
      observation: '',
    },
  });

  const onSubmit = async (data: StockEntryFormOutput) => {
    try {
      // O backend espera um formato DateTime válido. O input type="date" devolve YYYY-MM-DD. 
      // O DTO backend pede ExpirationDate como DateTime. 
      const payload = {
        ...data,
        expirationDate: new Date(data.expirationDate).toISOString(),
      };
      
      await registerEntry.mutateAsync(payload);
      toast.success('Entrada de estoque registrada com sucesso!');
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const description = isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error
        : undefined;

      toast.error('Erro ao registrar entrada', {
        description: description || 'Verifique os dados e tente novamente.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="productId">Produto</Label>
        <select
          id="productId"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          {...register('productId')}
          disabled={isLoadingProducts}
        >
          <option value="" disabled>Selecione um produto</option>
          {productsData?.items?.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (SKU: {product.sku})
            </option>
          ))}
        </select>
        {errors.productId && <span className="text-sm text-red-500">{errors.productId.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="batchNumber">Lote</Label>
          <Input id="batchNumber" {...register('batchNumber')} placeholder="Ex: LOTE-001" />
          {errors.batchNumber && <span className="text-sm text-red-500">{errors.batchNumber.message}</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expirationDate">Validade</Label>
          <Input id="expirationDate" type="date" {...register('expirationDate')} />
          {errors.expirationDate && <span className="text-sm text-red-500">{errors.expirationDate.message}</span>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade</Label>
        <Input id="quantity" type="number" {...register('quantity')} />
        {errors.quantity && <span className="text-sm text-red-500">{errors.quantity.message}</span>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observation">Observação</Label>
        <Input id="observation" {...register('observation')} placeholder="Opcional" />
        {errors.observation && <span className="text-sm text-red-500">{errors.observation.message}</span>}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={registerEntry.isPending || isLoadingProducts}>
          {registerEntry.isPending ? 'Registrando...' : 'Registrar Entrada'}
        </Button>
      </div>
    </form>
  );
}
