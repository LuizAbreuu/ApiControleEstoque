'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductDto } from '../types/dashboard.types';

interface DashboardChartsProps {
  lowStockProducts: ProductDto[];
}

export function DashboardCharts({ lowStockProducts }: DashboardChartsProps) {
  // Pegamos os top 5 produtos com menor estoque relativo ao mínimo
  const chartData = [...lowStockProducts]
    .sort((a, b) => (a.currentStock - a.minimumStock) - (b.currentStock - b.minimumStock))
    .slice(0, 5)
    .map((product) => ({
      name: product.name,
      Atual: product.currentStock,
      Mínimo: product.minimumStock,
    }));

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Produtos mais críticos</CardTitle>
        <CardDescription>Comparativo de estoque atual vs estoque mínimo exigido.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="Atual" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                <Bar dataKey="Mínimo" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Nenhum produto crítico no momento.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
