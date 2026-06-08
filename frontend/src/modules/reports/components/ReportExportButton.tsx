'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState } from 'react';

interface ReportExportButtonProps<T extends object> {
  data: T[];
  filename: string;
}

export function ReportExportButton<T extends object>({ data, filename }: ReportExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    if (!data || data.length === 0) return;
    
    setIsExporting(true);

    try {
      const firstRow = data[0] as Record<string, unknown>;
      const headers = Object.keys(firstRow);
      
      const csvContent = [
        headers.join(','),
        ...data.map((row) => {
          const rowRecord = row as Record<string, unknown>;

          return (
          headers.map((fieldName) => {
            let field = rowRecord[fieldName] === null || rowRecord[fieldName] === undefined ? '' : rowRecord[fieldName];
            if (typeof field === 'string') {
              field = `"${field.replace(/"/g, '""')}"`;
            }
            return field;
          }).join(',')
        );
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport} 
      disabled={isExporting || data.length === 0}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      {isExporting ? 'Exportando...' : 'Exportar CSV'}
    </Button>
  );
}
