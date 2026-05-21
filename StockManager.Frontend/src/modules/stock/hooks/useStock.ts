import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stockService } from '../services/stock.service';
import { 
  StockEntryRequest, 
  StockOutputRequest, 
  StockAdjustmentRequest, 
  StockDisposalRequest 
} from '../types/stock.types';

export const stockKeys = {
  all: ['stock-history'] as const,
  history: () => [...stockKeys.all, 'list'] as const,
  productHistory: (productId: string) => [...stockKeys.all, 'product', productId] as const,
};

export function useStockHistory() {
  return useQuery({
    queryKey: stockKeys.history(),
    queryFn: () => stockService.getHistory(),
  });
}

export function useProductStockHistory(productId: string) {
  return useQuery({
    queryKey: stockKeys.productHistory(productId),
    queryFn: () => stockService.getProductHistory(productId),
    enabled: !!productId,
  });
}

export function useStockEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StockEntryRequest) => stockService.entry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}

export function useStockOutput() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StockOutputRequest) => stockService.output(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}

export function useStockAdjustment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StockAdjustmentRequest) => stockService.adjustment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}

export function useStockDisposal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: StockDisposalRequest) => stockService.disposal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}
