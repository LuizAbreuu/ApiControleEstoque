import { api } from '@/services/api';
import { 
  LowStockReportItem, 
  ExpiredReportItem, 
  ExpiringReportItem, 
  MovementReportItem 
} from '../types/report.types';

export const reportService = {
  async getLowStock(): Promise<LowStockReportItem[]> {
    const response = await api.get<LowStockReportItem[]>('/api/reports/low-stock');
    return response.data;
  },

  async getExpired(): Promise<ExpiredReportItem[]> {
    const response = await api.get<ExpiredReportItem[]>('/api/reports/expired');
    return response.data;
  },

  async getExpiring(days: number = 30): Promise<ExpiringReportItem[]> {
    const response = await api.get<ExpiringReportItem[]>(`/api/reports/expiring?days=${days}`);
    return response.data;
  },

  async getMovements(startDate?: string, endDate?: string): Promise<MovementReportItem[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get<MovementReportItem[]>(`/api/reports/movements?${params.toString()}`);
    return response.data;
  },

  async exportExcel(reportType: string): Promise<void> {
    const response = await api.get(`/api/reports/export/${reportType}`, {
      responseType: 'blob', // Importante para arquivos binários
    });
    
    // Criar um link para download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
