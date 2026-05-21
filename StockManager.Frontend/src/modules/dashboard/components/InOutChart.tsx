'use client';

import { useChartData } from '../hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  entradas: {
    label: "Entradas",
    color: "hsl(var(--primary))",
  },
  saidas: {
    label: "Saídas",
    color: "hsl(var(--destructive))",
  },
};

export function InOutChart() {
  const { data, isLoading } = useChartData();

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>Fluxo de Estoque</CardTitle>
        <CardDescription>Entradas e Saídas nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Carregando gráfico...
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[200px] h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data || []} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className="text-xs"
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="entradas" fill="var(--color-entradas)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" fill="var(--color-saidas)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
