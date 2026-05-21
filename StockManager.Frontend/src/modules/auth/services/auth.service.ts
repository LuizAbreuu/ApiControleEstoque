import { api } from '@/services/api';
import { LoginResponse } from '../types/auth.types';
import { LoginFormValues } from '../schemas/login.schema';

export const authService = {
  login: async (credentials: LoginFormValues): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/api/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
  },
};
