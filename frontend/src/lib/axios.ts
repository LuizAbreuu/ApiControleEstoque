import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
export const API_BASE_URL = configuredApiUrl || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const { isAuthenticated, logout } = useAuthStore.getState();

      if (isAuthenticated) {
        logout();
      }

      if (typeof window !== 'undefined') {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
