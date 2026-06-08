'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SettingsPage() {
  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>
              Gerencie as configurações básicas do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input id="companyName" defaultValue="Stock Manager Enterprise" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">E-mail de Contato</Label>
              <Input id="contactEmail" defaultValue="suporte@stockmanager.com" />
            </div>
            <div className="pt-4">
              <Button onClick={handleSave}>Salvar Alterações</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
