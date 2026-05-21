'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockDisposalSchema, StockDisposalFormData } from '../schemas/stock.schema';
import { useStockDisposal } from '../hooks/useStock';
import { useProducts } from '@/modules/products/hooks/useProducts';
import { useProductBatches } from '@/modules/batches/hooks/useBatches';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function StockDisposalForm() {
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const disposalMutation = useStockDisposal();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<StockDisposalFormData>({
    resolver: zodResolver(stockDisposalSchema),
    defaultValues: {
      productId: '',
      batchId: '',
      quantity: 0,
      notes: '',
    },
  });

  const selectedProductId = watch('productId');
  const { data: batches, isLoading: isLoadingBatches } = useProductBatches(selectedProductId || '');

  const onSubmit = (data: StockDisposalFormData) => {
    disposalMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Descarte registrado com sucesso!');
        reset();
      },
      onError: () => toast.error('Erro ao registrar descarte'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label>Produto *</Label>
          <Select 
            disabled={isLoadingProducts || disposalMutation.isPending} 
            onValueChange={(val) => {
              setValue('productId', val);
              setValue('batchId', ''); // reseta lote ao trocar produto
            }} 
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
          <Label>Lote (Opcional)</Label>
          <Select 
            disabled={!selectedProductId || isLoadingBatches || disposalMutation.isPending} 
            onValueChange={(val) => setValue('batchId', val === 'none' ? undefined : val)} 
            value={watch('batchId') || 'none'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Geral (Sem Lote)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Geral (Sem Lote Específico)</SelectItem>
              {batches?.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.batchNumber} - {b.quantity} disponíveis</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label htmlFor="quantity">Quantidade a descartar *</Label>
          <Input id="quantity" type="number" {...register('quantity')} disabled={disposalMutation.isPending} />
          {errors.quantity && <span className="text-xs text-destructive">{errors.quantity.message}</span>}
        </div>

        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label htmlFor="notes">Motivo do Descarte *</Label>
          <Input id="notes" {...register('notes')} disabled={disposalMutation.isPending} placeholder="Ex: Produto vencido, danificado..." />
          {errors.notes && <span className="text-xs text-destructive">{errors.notes.message}</span>}
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={disposalMutation.isPending} variant="destructive">
          {disposalMutation.isPending ? 'Processando...' : 'Confirmar Descarte'}
        </Button>
      </div>
    </form>
  );
}
