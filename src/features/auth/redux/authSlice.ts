// src/features/auth/redux/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../api/authService';
import { User } from '@/types/auth';

// Interface định nghĩa trạng thái của Auth
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// State khởi tạo
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async Thunk action để đăng nhập
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe = false }: 
    { email: string; password: string; rememberMe?: boolean }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.login({ email, password });
      
      // Lưu token vào localStorage hoặc sessionStorage tùy thuộc vào rememberMe
      if (rememberMe) {
        localStorage.setItem('auth_token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refresh_token', response.refreshToken);
        }
      } else {
        sessionStorage.setItem('auth_token', response.token);
        if (response.refreshToken) {
          sessionStorage.setItem('refresh_token', response.refreshToken);
        }
      }
      
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng nhập'
      );
    }
  }
);

// Async Thunk action để lấy thông tin user hiện tại
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Không thể lấy thông tin người dùng'
      );
    }
  }
);

// Async Thunk action để đăng xuất
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      
      // Xóa token từ localStorage và sessionStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('refresh_token');
      
      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng xuất'
      );
    }
  }
);

// Slice cho Auth
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action để xóa thông báo lỗi
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý trạng thái login.pending
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Xử lý trạng thái login.fulfilled
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      // Xử lý trạng thái login.rejected
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      
      // Xử lý trạng thái getCurrentUser.pending
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Xử lý trạng thái getCurrentUser.fulfilled
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      // Xử lý trạng thái getCurrentUser.rejected
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      
      // Xử lý trạng thái logout.pending
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      // Xử lý trạng thái logout.fulfilled
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      // Xử lý trạng thái logout.rejected
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        // Vẫn logout ở client side kể cả khi API lỗi
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

// Export các actions và reducer
export const { clearError } = authSlice.actions;
export default authSlice.reducer;