import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';
import { ReportFilterParams } from '../types/reports';

export function useLowStockReport(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports', 'low-stock', params],
    queryFn: () => reportsService.getLowStockReport(params),
  });
}

export function useExpiringBatchesReport(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports', 'expiring-batches', params],
    queryFn: () => reportsService.getExpiringBatchesReport(params),
  });
}
