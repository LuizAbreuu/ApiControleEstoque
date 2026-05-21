import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: dashboardService.getMetrics,
  });
};

export const useRecentMovements = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-movements'],
    queryFn: dashboardService.getRecentMovements,
  });
};

export const useChartData = () => {
  return useQuery({
    queryKey: ['dashboard', 'chart-data'],
    queryFn: dashboardService.getChartData,
  });
};
