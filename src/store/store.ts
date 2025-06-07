// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '@/features/auth/slices';
import { userSlice } from '@/features/users/slices';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    users: userSlice.reducer,
    // Thêm các slice khác ở đây khi phát triển
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
