import { BatchList } from '@/modules/batches/components/BatchList';

export default function BatchesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Lotes</h1>
        <p className="text-muted-foreground">
          Visão geral de todos os lotes e validades do sistema.
        </p>
      </div>

      <BatchList />
    </div>
  );
}
