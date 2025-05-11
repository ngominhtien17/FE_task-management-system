// src/routes/settingsRoutes.tsx
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute, SettingsPage, HelpPage } from './components/RouteComponents';

/**
 * Định nghĩa tuyến đường liên quan đến cài đặt và hỗ trợ
 * Hỗ trợ phân cấp con cho các tùy chọn cài đặt khác nhau trong tương lai
 */
export const settingsRoutes: RouteObject[] = [
  // Trang cài đặt
  {
    path: 'settings',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <SettingsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
    // Chuẩn bị cho việc mở rộng với các trang cài đặt con trong tương lai
    // children: [
    //   { path: 'account', element: <AccountSettingsPage /> },
    //   { path: 'security', element: <SecuritySettingsPage /> },
    //   { path: 'notifications', element: <NotificationSettingsPage /> },
    // ]
  },
  // Trang trợ giúp
  {
    path: 'help',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <HelpPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
];