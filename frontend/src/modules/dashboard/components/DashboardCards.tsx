import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PackageSearch, AlertTriangle, ClockAlert, Package } from 'lucide-react';

interface DashboardCardsProps {
  metrics: {
    totalProducts: number;
    totalLowStock: number;
    totalExpired: number;
  };
}

export function DashboardCards({ metrics }: DashboardCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            Itens cadastrados no catálogo
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-500">
            Estoque Baixo
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalLowStock}</div>
          <p className="text-xs text-muted-foreground">
            Produtos abaixo do mínimo
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-600 dark:text-red-500">
            Lotes Vencidos
          </CardTitle>
          <ClockAlert className="h-4 w-4 text-red-600 dark:text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalExpired}</div>
          <p className="text-xs text-muted-foreground">
            Lotes que já expiraram
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-500">
            Ação Rápida
          </CardTitle>
          <PackageSearch className="h-4 w-4 text-blue-600 dark:text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium mt-1">Verifique o Estoque</div>
          <p className="text-xs text-muted-foreground mt-1">
            Realize ajustes em produtos críticos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
