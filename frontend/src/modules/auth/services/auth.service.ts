import { api } from '@/lib/axios';
import { LoginFormData } from '../schemas/auth.schema';
import { AuthResponse, User } from '../types';

interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<LoginApiResponse>('/auth/login', data);

    return {
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
      user: response.data.user,
    };
  },
};
