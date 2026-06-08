import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stockService } from '../services/stockService';
import { StockEntryDto, StockOutputDto } from '../types/stock';

export const useStockHistory = () => {
  return useQuery({
    queryKey: ['stock-history'],
    queryFn: () => stockService.getHistory(),
  });
};

export const useRegisterEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StockEntryDto) => stockService.registerEntry(data),
    onSuccess: () => {
      // Invalida a query de history (mesmo que seja mock agora, é uma boa prática deixar pronto)
      queryClient.invalidateQueries({ queryKey: ['stock-history'] });
      // Invalida a query de products, pois o estoque pode ter mudado
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Invalida lotes (batches) pois um novo lote pode ter entrado
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};

export const useRegisterOutput = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StockOutputDto) => stockService.registerOutput(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-history'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};
