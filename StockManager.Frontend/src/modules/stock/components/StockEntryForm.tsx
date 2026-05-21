'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockEntrySchema, StockEntryFormData } from '../schemas/stock.schema';
import { useStockEntry } from '../hooks/useStock';
import { useProducts } from '@/modules/products/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function StockEntryForm() {
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const entryMutation = useStockEntry();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<StockEntryFormData>({
    resolver: zodResolver(stockEntrySchema),
    defaultValues: {
      productId: '',
      quantity: 0,
      batchNumber: '',
      expirationDate: '',
      notes: '',
    },
  });

  const onSubmit = (data: StockEntryFormData) => {
    entryMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Entrada de estoque realizada com sucesso!');
        reset();
      },
      onError: () => toast.error('Erro ao realizar entrada de estoque'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label>Produto *</Label>
          <Select 
            disabled={isLoadingProducts || entryMutation.isPending} 
            onValueChange={(val) => setValue('productId', val)} 
            value={watch('productId') || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o produto" />
            </SelectTrigger>
            <SelectContent>
              {products?.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.productId && <span className="text-xs text-destructive">{errors.productId.message}</span>}
        </div>

        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label htmlFor="quantity">Quantidade *</Label>
          <Input id="quantity" type="number" {...register('quantity')} disabled={entryMutation.isPending} />
          {errors.quantity && <span className="text-xs text-destructive">{errors.quantity.message}</span>}
        </div>

        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label htmlFor="batchNumber">Número do Lote *</Label>
          <Input id="batchNumber" {...register('batchNumber')} disabled={entryMutation.isPending} />
          {errors.batchNumber && <span className="text-xs text-destructive">{errors.batchNumber.message}</span>}
        </div>

        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label htmlFor="expirationDate">Data de Validade *</Label>
          <Input id="expirationDate" type="date" {...register('expirationDate')} disabled={entryMutation.isPending} />
          {errors.expirationDate && <span className="text-xs text-destructive">{errors.expirationDate.message}</span>}
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="notes">Observação</Label>
          <Input id="notes" {...register('notes')} disabled={entryMutation.isPending} placeholder="Opcional" />
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={entryMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white">
          {entryMutation.isPending ? 'Processando...' : 'Confirmar Entrada'}
        </Button>
      </div>
    </form>
  );
}
