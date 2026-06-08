'use client';

import React, { useEffect } from 'react';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, CreateProductFormValues, CreateProductInput } from '../schemas/product.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useCreateProduct } from '../hooks/useProducts';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/modules/categories/hooks/useCategories';

export function ProductForm() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
  } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductFormValues, unknown, CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      sku: '',
      barcode: '',
      minimumStock: 0,
      unitMeasure: 1, // 1 = UN
      categoryId: '',
    },
  });
  const selectedCategoryId = watch('categoryId');

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setValue('categoryId', categories[0].id, { shouldValidate: true });
    }
  }, [categories, selectedCategoryId, setValue]);

  const onSubmit = async (data: CreateProductInput) => {
    try {
      await createProduct.mutateAsync(data);
      toast.success('Produto criado com sucesso!');
      router.push('/products');
    } catch (error: unknown) {
      const description = isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error
        : undefined;

      toast.error('Erro ao criar produto', {
        description: description || 'Verifique os dados e tente novamente.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto</Label>
          <Input id="name" {...register('name')} placeholder="Ex: Notebook Dell" />
          {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register('sku')} placeholder="Ex: NOTE-DELL-001" />
          {errors.sku && <span className="text-sm text-red-500">{errors.sku.message}</span>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Descrição</Label>
          <Input id="description" {...register('description')} placeholder="Breve descrição do produto" />
          {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Preço</Label>
          <Input id="price" type="number" step="0.01" {...register('price')} />
          {errors.price && <span className="text-sm text-red-500">{errors.price.message}</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="barcode">Código de Barras</Label>
          <Input id="barcode" {...register('barcode')} placeholder="Opcional" />
          {errors.barcode && <span className="text-sm text-red-500">{errors.barcode.message}</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimumStock">Estoque Mínimo</Label>
          <Input id="minimumStock" type="number" {...register('minimumStock')} />
          {errors.minimumStock && <span className="text-sm text-red-500">{errors.minimumStock.message}</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitMeasure">Unidade de Medida</Label>
          <select 
            id="unitMeasure" 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            {...register('unitMeasure')}
          >
            <option value="1">Unidade (UN)</option>
            <option value="2">Quilograma (KG)</option>
            <option value="3">Litro (L)</option>
            <option value="4">Caixa (CX)</option>
            <option value="5">Peça (PC)</option>
          </select>
          {errors.unitMeasure && <span className="text-sm text-red-500">{errors.unitMeasure.message}</span>}
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="categoryId">Categoria</Label>
          <select
            id="categoryId"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            {...register('categoryId')}
            disabled={isLoadingCategories || categories.length === 0}
          >
            {categories.length === 0 ? (
              <option value="">Nenhuma categoria disponível</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
          {errors.categoryId && <span className="text-sm text-red-500">{errors.categoryId.message}</span>}
          {isCategoriesError && (
            <span className="text-sm text-red-500">
              Não foi possível carregar as categorias da API.
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.push('/products')} disabled={createProduct.isPending}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={createProduct.isPending || isLoadingCategories || categories.length === 0}
        >
          {createProduct.isPending ? 'Salvando...' : 'Salvar Produto'}
        </Button>
      </div>
    </form>
  );
}
