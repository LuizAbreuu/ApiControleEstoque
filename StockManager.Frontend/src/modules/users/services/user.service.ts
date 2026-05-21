import { api } from '@/services/api';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/user.types';

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/api/users');
    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`/api/users/${id}`);
    return response.data;
  },

  async create(data: CreateUserRequest): Promise<User> {
    const response = await api.post<User>('/api/users', data);
    return response.data;
  },

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await api.put<User>(`/api/users/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/users/${id}`);
  },
  
  async toggleStatus(id: string): Promise<void> {
    await api.patch(`/api/users/${id}/toggle-status`);
  }
};
