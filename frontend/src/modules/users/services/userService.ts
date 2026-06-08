import { api } from '@/lib/axios';
import { User, UserListResponse } from '../types/user.types';
import { UserFormData } from '../schemas/user.schema';

export const userService = {
  async getUsers(pageNumber: number = 1, pageSize: number = 10): Promise<UserListResponse> {
    const response = await api.get<UserListResponse>('/users', {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  async createUser(data: UserFormData): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async updateUser(id: string, data: UserFormData): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },
};
