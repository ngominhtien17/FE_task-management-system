// features/auth/types.ts
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
  }
  
  // features/auth/api/authApi.ts
  import { User, LoginCredentials } from '../types';
  
  // Mock API functions - sẽ được thay thế bằng API thực tế sau
  export const authApi = {
    login: async (credentials: LoginCredentials): Promise<User> => {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email === "demo@example.com" && credentials.password === "password") {
        const userData: User = {
          id: "1",
          name: "Nguyễn Văn A",
          email: credentials.email,
          role: "Admin",
        };
        
        // Lưu token vào localStorage hoặc sessionStorage tùy thuộc vào rememberMe
        const token = "mock_jwt_token";
        if (credentials.rememberMe) {
          localStorage.setItem('auth_token', token);
        } else {
          sessionStorage.setItem('auth_token', token);
        }
        
        return userData;
      }
      
      throw new Error("Email hoặc mật khẩu không chính xác");
    },
    
    logout: async (): Promise<void> => {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Xóa token
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    },
    
    checkAuth: async (): Promise<User | null> => {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Kiểm tra token
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (token) {
        // Mô phỏng fetch user data
        const userData: User = {
          id: "1",
          name: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          role: "Admin",
        };
        
        return userData;
      }
      
      return null;
    }
  };
  
  // features/auth/slice.ts
  import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
  import { AuthState, LoginCredentials, User } from './types';
  import { authApi } from './api/authApi';
  
  // Initial state
  const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
  
  // Async thunks
  export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
      try {
        const user = await authApi.login(credentials);
        return user;
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Đăng nhập thất bại');
      }
    }
  );
  
  export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
      try {
        await authApi.logout();
        return;
      } catch (error) {
        return rejectWithValue('Đăng xuất thất bại');
      }
    }
  );
  
  export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
      try {
        const user = await authApi.checkAuth();
        return user;
      } catch (error) {
        return rejectWithValue('Xác thực thất bại');
      }
    }
  );
  
  // Auth slice
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      // Login
      builder.addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      });
      builder.addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
      
      // Logout
      builder.addCase(logout.pending, (state) => {
        state.isLoading = true;
      });
      builder.addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
      builder.addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
      
      // Check Auth
      builder.addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
      builder.addCase(checkAuth.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      });
      builder.addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
    },
  });
  
  export const { clearError } = authSlice.actions;
  export const authReducer = authSlice.reducer;
  
  // features/auth/hooks/useAuth.ts
  import { useCallback } from 'react';
  import { useAppSelector, useAppDispatch } from '@/hooks';
  import { LoginCredentials } from '../types';
  import { login, logout, checkAuth } from '../slice';
  
  export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isLoading, error } = useAppSelector(state => state.auth);
    
    const loginUser = useCallback(
      async (credentials: LoginCredentials) => {
        return dispatch(login(credentials)).unwrap();
      },
      [dispatch]
    );
    
    const logoutUser = useCallback(
      async () => {
        return dispatch(logout()).unwrap();
      },
      [dispatch]
    );
    
    const checkAuthStatus = useCallback(
      async () => {
        return dispatch(checkAuth()).unwrap();
      },
      [dispatch]
    );
    
    return {
      user,
      isAuthenticated,
      isLoading,
      error,
      login: loginUser,
      logout: logoutUser,
      checkAuth: checkAuthStatus,
    };
  };
  
  // features/auth/index.ts
  export * from './types';
  export * from './slice';
  export * from './hooks/useAuth';