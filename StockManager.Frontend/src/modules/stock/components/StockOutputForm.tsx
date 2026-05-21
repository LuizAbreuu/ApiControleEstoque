'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockOutputSchema, StockOutputFormData } from '../schemas/stock.schema';
import { useStockOutput } from '../hooks/useStock';
import { useProducts } from '@/modules/products/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function StockOutputForm() {
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const outputMutation = useStockOutput();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<StockOutputFormData>({
    resolver: zodResolver(stockOutputSchema),
    defaultValues: {
      productId: '',
      quantity: 0,
      notes: '',
    },
  });

  const onSubmit = (data: StockOutputFormData) => {
    outputMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Saída de estoque realizada com sucesso!');
        reset();
      },
      onError: () => toast.error('Erro ao realizar saída de estoque'),
    });
  };

  const selectedProductId = watch('productId');
  const selectedProduct = products?.find(p => p.id === selectedProductId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="bg-amber-50 p-4 border border-amber-200 rounded-md mb-4 text-amber-800 text-sm">
        <strong>Aviso de FIFO:</strong> A saída baixará automaticamente o saldo dos lotes mais antigos primeiro.
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label>Produto *</Label>
          <Select 
            disabled={isLoadingProducts || outputMutation.isPending} 
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
          
          {selectedProduct && selectedProduct.currentStock !== undefined && (
            <div className="text-xs text-muted-foreground mt-1">
              Saldo disponível: {selectedProduct.currentStock}
            </div>
          )}
        </div>

        <div className="space-y-2 col-span-2 md:col-span-1">
          <Label htmlFor="quantity">Quantidade *</Label>
          <Input id="quantity" type="number" {...register('quantity')} disabled={outputMutation.isPending} />
          {errors.quantity && <span className="text-xs text-destructive">{errors.quantity.message}</span>}
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="notes">Observação</Label>
          <Input id="notes" {...register('notes')} disabled={outputMutation.isPending} placeholder="Opcional" />
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={outputMutation.isPending} variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white">
          {outputMutation.isPending ? 'Processando...' : 'Confirmar Saída'}
        </Button>
      </div>
    </form>
  );
}
