// src/routes/authRoutes.tsx
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LazyLoadWrapper, ForgotPasswordPage, ResetPasswordPage } from './components/RouteComponents';

// Lazy-load AuthPage để tối ưu hiệu suất tải trang
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));

/**
 * Định nghĩa tuyến đường cho phân hệ xác thực
 * Bao gồm đăng nhập, quên mật khẩu và đặt lại mật khẩu
 */
export const authRoutes: RouteObject = {
  path: 'auth',
  element: <AuthLayout />,
  children: [
    {
      path: 'login',
      element: (
        <LazyLoadWrapper height="h-full">
          <LoginPage />
        </LazyLoadWrapper>
      ),
    },
    {
      path: 'forgot-password',
      element: <ForgotPasswordPage />,
    },
    {
      path: 'reset-password',
      element: <ResetPasswordPage />,
    },
    // Mặc định chuyển hướng đến đăng nhập nếu truy cập /auth
    {
      index: true,
      element: <Navigate to="/auth/login" replace />,
    }
  ],
};