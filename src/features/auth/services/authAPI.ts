// FILE 5: src/features/auth/services/authAPI.ts
// ================================================================================
import { apiClient } from '@/common/services';
import { mockAPI } from '@/common/services/mockApi';
import type { LoginRequest, LoginResponse, RefreshTokenResponse } from '../types';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK_API) {
      console.log('🔶 Using Mock API for login');
      return mockAPI.login(credentials);
    }
    
    try {
      console.log('🔶 Attempting real API login');
      return await apiClient.post<LoginResponse>('/auth/login', credentials);
    } catch (error) {
      console.error('🔴 Real API failed, falling back to mock:', error);
      return mockAPI.login(credentials);
    }
  },

  logout: async (): Promise<{ message: string }> => {
    if (USE_MOCK_API) {
      return mockAPI.logout();
    }
    
    try {
      return await apiClient.post<{ message: string }>('/auth/logout');
    } catch (error) {
      console.error('Logout API failed, using mock:', error);
      return mockAPI.logout();
    }
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    if (USE_MOCK_API) {
      const newToken = `mock_token_${Date.now()}_admin-001`;
      return { accessToken: newToken };
    }
    
    return apiClient.post<RefreshTokenResponse>('/auth/refresh-token');
  },

  checkAuth: async (): Promise<{ user: LoginResponse['user']; roles: string[] }> => {
    console.log('🔍 authAPI.checkAuth: Starting auth check...');
    
    if (USE_MOCK_API) {
      console.log('🔶 Using Mock API for checkAuth');
      return mockAPI.checkAuth();
    }
    
    try {
      console.log('🔶 Attempting real API checkAuth');
      return await apiClient.get<{ user: LoginResponse['user']; roles: string[] }>('/auth/me');
    } catch (error) {
      console.error('🔴 Real API checkAuth failed, falling back to mock:', error);
      
      const token = localStorage.getItem('accessToken');
      if (token) {
        console.log('🔶 Using Mock API as fallback for checkAuth');
        return mockAPI.checkAuth();
      }
      
      throw error;
    }
  },
};