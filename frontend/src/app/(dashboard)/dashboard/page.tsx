'use client';

import { useDashboardMetrics } from '@/modules/dashboard/hooks/useDashboard';
import { DashboardCards } from '@/modules/dashboard/components/DashboardCards';
import { DashboardCharts } from '@/modules/dashboard/components/DashboardCharts';
import { DashboardRecentMovements } from '@/modules/dashboard/components/DashboardRecentMovements';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { metrics, lowStockProducts, expiredBatches, isLoading } = useDashboardMetrics();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu estoque corporativo.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-[300px] col-span-2 rounded-xl" />
            <Skeleton className="h-[300px] col-span-2 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          <DashboardCards metrics={metrics} />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCharts lowStockProducts={lowStockProducts} />
            <DashboardRecentMovements expiredBatches={expiredBatches} />
          </div>
        </>
      )}
    </div>
  );
}
