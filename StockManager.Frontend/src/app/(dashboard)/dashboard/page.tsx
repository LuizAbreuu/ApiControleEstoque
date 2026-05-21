import { MetricCards } from '@/modules/dashboard/components/MetricCards';
import { InOutChart } from '@/modules/dashboard/components/InOutChart';
import { RecentMovementsTable } from '@/modules/dashboard/components/RecentMovementsTable';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do controle de estoque e alertas.
        </p>
      </div>

      <MetricCards />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <InOutChart />
        <RecentMovementsTable />
      </div>
    </div>
  );
}
