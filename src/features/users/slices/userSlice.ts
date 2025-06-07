// src/features/users/slices/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../services';
import type { UserState, UserEntity, CreateUserRequest, UpdateUserRequest } from '../types';

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: 'idle',
  error: null,
};

// Async thunks
export const getUsersAsync = createAsyncThunk(
  'users/getUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await userAPI.getUsers();
      return users;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Lấy danh sách người dùng thất bại');
    }
  }
);

export const createUserAsync = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserRequest, { rejectWithValue }) => {
    try {
      const response = await userAPI.createUser(userData);
      return response.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Tạo người dùng thất bại');
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: string; userData: UpdateUserRequest }, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateUser(id, userData);
      return response.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Cập nhật người dùng thất bại');
    }
  }
);

// Slice
export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Users
      .addCase(getUsersAsync.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(getUsersAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.users = action.payload;
        state.error = null;
      })
      .addCase(getUsersAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Create User
      .addCase(createUserAsync.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Update User
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?._id === action.payload._id) {
          state.currentUser = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearUsersError, setCurrentUser, clearCurrentUser } = userSlice.actions;

// Selectors
export const selectUsers = (state: { users: UserState }) => state.users.users;
export const selectCurrentUser = (state: { users: UserState }) => state.users.currentUser;
export const selectUsersLoading = (state: { users: UserState }) => state.users.loading;
export const selectUsersError = (state: { users: UserState }) => state.users.error;