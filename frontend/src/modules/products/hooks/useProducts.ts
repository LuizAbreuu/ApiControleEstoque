import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { CreateProductInput } from '../schemas/product.schema';

export function useProducts(pageNumber: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ['products', pageNumber, pageSize],
    queryFn: () => productService.getProducts(pageNumber, pageSize),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
