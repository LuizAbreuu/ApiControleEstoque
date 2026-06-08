import { useQuery } from '@tanstack/react-query';
import { batchesService } from '../services/batchesService';

export const useBatches = () => {
  return useQuery({
    queryKey: ['batches'],
    queryFn: () => batchesService.getAllBatches(),
  });
};

export const useExpiredBatches = () => {
  return useQuery({
    queryKey: ['batches', 'expired'],
    queryFn: () => batchesService.getExpiredBatches(),
  });
};
