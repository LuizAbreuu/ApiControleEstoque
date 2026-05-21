import { ReportViews } from '@/modules/reports/components/ReportViews';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios Gerenciais</h1>
        <p className="text-muted-foreground">
          Acompanhe os principais indicadores de estoque, validades e exporte dados.
        </p>
      </div>

      <ReportViews />
    </div>
  );
}
