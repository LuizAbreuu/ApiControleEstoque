import { StockOperations } from '@/modules/stock/components/StockOperations';
import { StockHistoryTable } from '@/modules/stock/components/StockHistoryTable';

export default function StockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Movimentação de Estoque</h1>
        <p className="text-muted-foreground">
          Gerencie entradas, saídas, ajustes e descartes.
        </p>
      </div>

      <StockOperations />
      
      <StockHistoryTable />
    </div>
  );
}
