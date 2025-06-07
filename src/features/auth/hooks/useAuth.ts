// src/features/auth/hooks/useAuth.ts
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loginAsync,
  logoutAsync,
  checkAuthAsync,
  clearError,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../slices';
import type { LoginRequest } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [hasInitialized, setHasInitialized] = useState(false);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await dispatch(loginAsync(credentials));
      return result;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    const result = await dispatch(logoutAsync());
    return result;
  }, [dispatch]);

  const checkAuth = useCallback(async () => {
    const result = await dispatch(checkAuthAsync());
    return result;
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      console.log('🔄 useAuth: Initializing...', { 
        hasToken: !!token, 
        isAuthenticated, 
        loading, 
        hasInitialized 
      });
      
      if (token && !isAuthenticated && loading === 'idle' && !hasInitialized) {
        console.log('🔄 useAuth: Token found, checking auth...');
        try {
          const result = await checkAuth();
          console.log('✅ useAuth: Auth check completed:', result);
        } catch (error) {
          console.error('🔴 useAuth: Auth check failed:', error);
        }
      }
      
      setHasInitialized(true);
    };

    initializeAuth();
  }, [checkAuth, isAuthenticated, loading, hasInitialized]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    auth,
    hasInitialized,
    login,
    logout,
    checkAuth,
    clearError: clearAuthError,
  };
};