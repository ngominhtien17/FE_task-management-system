// src/features/auth/slices/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../services';
import type { AuthState, LoginRequest, User } from '../types';

const initialState: AuthState = {
  user: null,
  roles: [],
  isAuthenticated: false,
  loading: 'idle',
  error: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      
      // Lưu access token vào localStorage
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
      }
      
      return {
        user: response.user,
        roles: response.roles,
        message: response.message,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đăng nhập thất bại');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      localStorage.removeItem('accessToken');
      return null;
    } catch (error: unknown) {
      // Vẫn logout ở client side ngay cả khi API call thất bại
      localStorage.removeItem('accessToken');
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đăng xuất thất bại');
    }
  }
);

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('Không có token');
      }
      
      const response = await authAPI.checkAuth();
      return {
        user: response.user,
        roles: response.roles,
      };
    } catch (error: unknown) {
      localStorage.removeItem('accessToken');
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Kiểm tra xác thực thất bại');
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.refreshToken();
      localStorage.setItem('accessToken', response.accessToken);
      return response.accessToken;
    } catch (error: unknown) {
      localStorage.removeItem('accessToken');
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Làm mới token thất bại');
    }
  }
);

// Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    resetAuth: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.user = action.payload.user;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.roles = [];
      })
      // Logout
      .addCase(logoutAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = 'idle';
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
        // Vẫn logout ở client side
        state.user = null;
        state.roles = [];
        state.isAuthenticated = false;
      })
      // Check Auth
      .addCase(checkAuthAsync.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.user = action.payload.user;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.roles = [];
      })
      // Refresh Token
      .addCase(refreshTokenAsync.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.roles = [];
      });
  },
});

export const { clearError, updateUser, resetAuth } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRoles = (state: { auth: AuthState }) => state.auth.roles;
