import { api } from '@/services/api';
import { DashboardMetrics, StockMovement, ChartData } from '../types/dashboard.types';

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    // Como os endpoints são separados, agregamos aqui ou assumimos que o backend 
    // fornecerá um endpoint de resumo no futuro. Por hora, simulamos as chamadas:
    
    try {
      // Idealmente, a API teria um GET /api/dashboard/metrics
      // const res = await api.get<DashboardMetrics>('/dashboard/metrics');
      // return res;

      // Mock temporário caso os endpoints exatos ainda não existam ou retornem arrays muito grandes
      return {
        totalProducts: 142,
        lowStockProducts: 12,
        expiringBatches: 5,
        expiredBatches: 2,
      };
    } catch (error) {
      console.error('Erro ao buscar métricas', error);
      throw error;
    }
  },

  getRecentMovements: async (): Promise<StockMovement[]> => {
    try {
      // const res = await api.get<StockMovement[]>('/reports/movements?limit=5');
      // return res;
      
      return [
        { id: '1', productId: 'p1', productName: 'Notebook Dell', type: 'Entry', quantity: 50, date: new Date().toISOString(), userName: 'Admin' },
        { id: '2', productId: 'p2', productName: 'Mouse Logitech', type: 'Output', quantity: 5, date: new Date().toISOString(), userName: 'João' },
        { id: '3', productId: 'p3', productName: 'Teclado Mecânico', type: 'Entry', quantity: 20, date: new Date().toISOString(), userName: 'Admin' },
      ];
    } catch (error) {
      console.error('Erro ao buscar movimentações', error);
      throw error;
    }
  },

  getChartData: async (): Promise<ChartData[]> => {
    return [
      { name: 'Jan', entradas: 400, saidas: 240 },
      { name: 'Fev', entradas: 300, saidas: 139 },
      { name: 'Mar', entradas: 200, saidas: 980 },
      { name: 'Abr', entradas: 278, saidas: 390 },
      { name: 'Mai', entradas: 189, saidas: 480 },
      { name: 'Jun', entradas: 239, saidas: 380 },
    ];
  }
};
