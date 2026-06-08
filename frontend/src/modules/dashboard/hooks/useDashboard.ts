import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export const useDashboardMetrics = () => {
  const productsQuery = useQuery({
    queryKey: ['products', 'summary'],
    queryFn: () => dashboardService.getProducts()
  });

  const lowStockQuery = useQuery({
    queryKey: ['reports', 'low-stock'],
    queryFn: () => dashboardService.getLowStock()
  });

  const expiredQuery = useQuery({
    queryKey: ['reports', 'expired'],
    queryFn: () => dashboardService.getExpiredBatches()
  });

  const isLoading = productsQuery.isLoading || lowStockQuery.isLoading || expiredQuery.isLoading;
  const isError = productsQuery.isError || lowStockQuery.isError || expiredQuery.isError;

  return {
    metrics: {
      totalProducts: productsQuery.data?.totalCount || 0,
      totalLowStock: lowStockQuery.data?.length || 0,
      totalExpired: expiredQuery.data?.length || 0,
    },
    lowStockProducts: lowStockQuery.data || [],
    expiredBatches: expiredQuery.data || [],
    isLoading,
    isError,
    queries: {
      products: productsQuery,
      lowStock: lowStockQuery,
      expired: expiredQuery
    }
  };
};
