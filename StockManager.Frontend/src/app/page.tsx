import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redireciona a raiz para o dashboard. O AuthGuard no layout do dashboard cuidará de redirecionar para o login se não estiver autenticado.
  redirect('/dashboard');
}
