'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginFormData } from '@/modules/auth/schemas/auth.schema';
import { authService } from '@/modules/auth/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package2, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      const response = await authService.login(data);
      login(response.token, response.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error(err);

      if (isAxiosError(err)) {
        setError(err.response?.data?.error || 'Não foi possível conectar à API.');
        return;
      }

      setError('Não foi possível realizar o login. Tente novamente.');
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Package2 className="size-6" />
          </div>
          <span className="text-xl font-bold">Stock Manager Web</span>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
            <CardDescription>
              Faça login com seu e-mail e senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@empresa.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <span className="text-sm text-destructive">{errors.email.message}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    {...register('password')} 
                  />
                  {errors.password && (
                    <span className="text-sm text-destructive">{errors.password.message}</span>
                  )}
                </div>
                
                {error && (
                  <div className="text-sm font-medium text-destructive text-center">
                    {error}
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Entrar no sistema
                </Button>

                <div className="rounded-md border border-dashed bg-muted/60 p-3 text-xs text-muted-foreground">
                  Ambiente local seedado: <strong>admin@stockmanager.com</strong> / <strong>Admin@123</strong>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          Ao clicar em entrar, você concorda com nossos <a href="#">Termos de Serviço</a> e{' '}
          <a href="#">Política de Privacidade</a>.
        </div>
      </div>
    </div>
  );
}
