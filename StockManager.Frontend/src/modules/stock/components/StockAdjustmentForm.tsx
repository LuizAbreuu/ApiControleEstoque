'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockAdjustmentSchema, StockAdjustmentFormData } from '../schemas/stock.schema';
import { useStockAdjustment } from '../hooks/useStock';
import { useProducts } from '@/modules/products/hooks/useProducts';
import { useProductBatches } from '@/modules/batches/hooks/useBatches';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';

export function StockAdjustmentForm() {
  const { user } = useAuthStore();
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const adjustmentMutation = useStockAdjustment();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<StockAdjustmentFormData>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      productId: '',
      batchId: '',
      quantity: 0,
      notes: '',
    },
  });

  const selectedProductId = watch('productId');
  const { data: batches, isLoading: isLoadingBatches } = useProductBatches(selectedProductId || '');

  const onSubmit = (data: StockAdjustmentFormData) => {
    adjustmentMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Ajuste de estoque realizado com sucesso!');
        reset();
      },
      onError: () => toast.error('Erro ao realizar ajuste de estoque'),
    });
  };

  if (user?.role !== 'Admin') {
    return (
      <div className="p-4 text-center text-muted-foreground border rounded bg-card">
        Apenas administradores podem realizar ajustes de estoque.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label>Produto *</Label>
          <Select 
            disabled={isLoadingProducts || adjustmentMutation.isPending} 
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
            disabled={!selectedProductId || isLoadingBatches || adjustmentMutation.isPending} 
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
          <Label htmlFor="quantity">Quantidade (Use negativo para subtrair) *</Label>
          <Input id="quantity" type="number" {...register('quantity')} disabled={adjustmentMutation.isPending} />
          {errors.quantity && <span className="text-xs text-destructive">{errors.quantity.message}</span>}
        </div>

        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label htmlFor="notes">Motivo do Ajuste *</Label>
          <Input id="notes" {...register('notes')} disabled={adjustmentMutation.isPending} />
          {errors.notes && <span className="text-xs text-destructive">{errors.notes.message}</span>}
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={adjustmentMutation.isPending} variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
          {adjustmentMutation.isPending ? 'Processando...' : 'Confirmar Ajuste'}
        </Button>
      </div>
    </form>
  );
}
