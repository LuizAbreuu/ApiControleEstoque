import { useQuery, useMutation } from '@tanstack/react-query';
import { reportService } from '../services/report.service';

export const reportKeys = {
  all: ['reports'] as const,
  lowStock: () => [...reportKeys.all, 'low-stock'] as const,
  expired: () => [...reportKeys.all, 'expired'] as const,
  expiring: (days: number) => [...reportKeys.all, 'expiring', days] as const,
  movements: (start?: string, end?: string) => [...reportKeys.all, 'movements', start, end] as const,
};

export function useLowStockReport() {
  return useQuery({
    queryKey: reportKeys.lowStock(),
    queryFn: () => reportService.getLowStock(),
  });
}

export function useExpiredReport() {
  return useQuery({
    queryKey: reportKeys.expired(),
    queryFn: () => reportService.getExpired(),
  });
}

export function useExpiringReport(days: number = 30) {
  return useQuery({
    queryKey: reportKeys.expiring(days),
    queryFn: () => reportService.getExpiring(days),
  });
}

export function useMovementsReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: reportKeys.movements(startDate, endDate),
    queryFn: () => reportService.getMovements(startDate, endDate),
  });
}

export function useExportReport() {
  return useMutation({
    mutationFn: (reportType: string) => reportService.exportExcel(reportType),
  });
}
