'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormValues } from '../schemas/product.schema';
import { useCreateProduct, useUpdateProduct, useCategories } from '../hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Product } from '../types/product.types';

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const isEditing = !!initialData;
  const isPending = createProduct.isPending || updateProduct.isPending;

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || '',
      categoryId: initialData.categoryId,
      price: initialData.price,
      minimumStock: initialData.minimumStock,
      unitMeasure: initialData.unitMeasure,
      sku: initialData.sku,
      barcode: initialData.barcode || '',
      active: initialData.active,
    } : {
      active: true,
      unitMeasure: 0,
      price: 0,
      minimumStock: 0,
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (isEditing) {
      updateProduct.mutate({ id: initialData.id, data }, {
        onSuccess: () => {
          toast.success('Produto atualizado com sucesso!');
          router.push('/products');
        },
        onError: () => toast.error('Erro ao atualizar produto'),
      });
    } else {
      createProduct.mutate(data, {
        onSuccess: () => {
          toast.success('Produto criado com sucesso!');
          router.push('/products');
        },
        onError: () => toast.error('Erro ao criar produto'),
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input id="name" {...register('name')} disabled={isPending} />
              {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" {...register('description')} disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...register('sku')} disabled={isPending} />
              {errors.sku && <span className="text-xs text-destructive">{errors.sku.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Código de Barras</Label>
              <Input id="barcode" {...register('barcode')} disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select 
                disabled={isPending} 
                onValueChange={(val) => setValue('categoryId', val)} 
                defaultValue={watch('categoryId')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <span className="text-xs text-destructive">{errors.categoryId.message}</span>}
            </div>

            <div className="space-y-2">
              <Label>Unidade de Medida</Label>
              <Select 
                disabled={isPending} 
                onValueChange={(val) => setValue('unitMeasure', Number(val))} 
                defaultValue={watch('unitMeasure')?.toString() || "0"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Unidade (UN)</SelectItem>
                  <SelectItem value="1">Quilograma (KG)</SelectItem>
                  <SelectItem value="2">Litro (LT)</SelectItem>
                  <SelectItem value="3">Caixa (CX)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} disabled={isPending} />
              {errors.price && <span className="text-xs text-destructive">{errors.price.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumStock">Estoque Mínimo</Label>
              <Input id="minimumStock" type="number" {...register('minimumStock')} disabled={isPending} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar Produto'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
