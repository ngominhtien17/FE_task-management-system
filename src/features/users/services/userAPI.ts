// src/features/users/services/userAPI.ts
import { apiClient } from '@/common/services';
import type { UserEntity, CreateUserRequest, UpdateUserRequest } from '../types';

export const userAPI = {
  getUsers: async (): Promise<UserEntity[]> => {
    return apiClient.get<UserEntity[]>('/users/get');
  },

  createUser: async (userData: CreateUserRequest): Promise<{ message: string; user: UserEntity }> => {
    return apiClient.post<{ message: string; user: UserEntity }>('/users/create', userData);
  },

  updateUser: async (id: string, userData: UpdateUserRequest): Promise<{ message: string; user: UserEntity }> => {
    return apiClient.put<{ message: string; user: UserEntity }>(`/users/update/${id}`, userData);
  },
};
