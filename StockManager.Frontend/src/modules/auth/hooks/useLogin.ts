import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { LoginFormValues } from '../schemas/login.schema';
import { useAuthStore } from '@/stores/auth.store';

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginFormValues) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push('/dashboard');
    },
  });
};
