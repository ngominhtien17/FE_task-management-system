// src/routes/dashboardRoutes.tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute, LazyLoadWrapper } from './components/RouteComponents';

// Áp dụng tải component trễ (lazy loading) để tối ưu hiệu suất
const Dashboard = lazy(() => import('@/pages/dashboard'));

/**
 * Định nghĩa tuyến đường cho trang chính và dashboard
 * Tuyến đường này được bảo vệ và yêu cầu xác thực
 */
export const dashboardRoutes: RouteObject[] = [
  // Tuyến đường trang chính (/)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <LazyLoadWrapper>
            <Dashboard />
          </LazyLoadWrapper>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  // Tuyến đường dashboard (/dashboard)
  {
    path: 'dashboard',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <LazyLoadWrapper>
            <Dashboard />
          </LazyLoadWrapper>
        </MainLayout>
      </ProtectedRoute>
    ),
  },
];