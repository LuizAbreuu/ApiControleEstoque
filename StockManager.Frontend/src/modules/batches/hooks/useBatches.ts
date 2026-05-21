import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { batchService } from '../services/batch.service';

export const useBatches = () => {
  return useQuery({
    queryKey: ['batches'],
    queryFn: batchService.getAll,
  });
};

export const useProductBatches = (productId: string) => {
  return useQuery({
    queryKey: ['batches', 'product', productId],
    queryFn: () => batchService.getByProductId(productId),
    enabled: !!productId,
  });
};

export const useCreateBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: batchService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};
