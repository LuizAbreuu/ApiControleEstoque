'use client';

import React from 'react';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockOutputSchema, StockOutputFormInput, StockOutputFormOutput } from '../schemas/stock.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRegisterOutput } from '../hooks/useStock';
import { useProducts } from '@/modules/products/hooks/useProducts';

interface StockOutputFormProps {
  onSuccess?: () => void;
}

export function StockOutputForm({ onSuccess }: StockOutputFormProps) {
  const registerOutput = useRegisterOutput();
  const { data: productsData, isLoading: isLoadingProducts } = useProducts(1, 100);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StockOutputFormInput, unknown, StockOutputFormOutput>({
    resolver: zodResolver(stockOutputSchema),
    defaultValues: {
      productId: '',
      quantity: 1,
      observation: '',
    },
  });

  const onSubmit = async (data: StockOutputFormOutput) => {
    try {
      await registerOutput.mutateAsync(data);
      toast.success('Saída de estoque registrada com sucesso!');
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const description = isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error
        : undefined;

      toast.error('Erro ao registrar saída', {
        description: description || 'Verifique se há estoque suficiente e tente novamente.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="productIdOut">Produto</Label>
        <select
          id="productIdOut"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          {...register('productId')}
          disabled={isLoadingProducts}
        >
          <option value="" disabled>Selecione um produto</option>
          {productsData?.items?.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (SKU: {product.sku}) - Estoque: {product.currentStock}
            </option>
          ))}
        </select>
        {errors.productId && <span className="text-sm text-red-500">{errors.productId.message}</span>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantityOut">Quantidade</Label>
        <Input id="quantityOut" type="number" {...register('quantity')} />
        {errors.quantity && <span className="text-sm text-red-500">{errors.quantity.message}</span>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observationOut">Observação (Motivo da Saída)</Label>
        <Input id="observationOut" {...register('observation')} placeholder="Ex: Venda, Descarte, Uso interno" />
        {errors.observation && <span className="text-sm text-red-500">{errors.observation.message}</span>}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="destructive" disabled={registerOutput.isPending || isLoadingProducts}>
          {registerOutput.isPending ? 'Registrando...' : 'Registrar Saída'}
        </Button>
      </div>
    </form>
  );
}
