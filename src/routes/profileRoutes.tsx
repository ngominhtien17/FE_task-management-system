// src/routes/profileRoutes.tsx
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute, ProfilePage } from './components/RouteComponents';

/**
 * Định nghĩa tuyến đường liên quan đến hồ sơ người dùng
 * Có thể mở rộng để bao gồm các trang con như chỉnh sửa hồ sơ, đổi mật khẩu, v.v.
 */
export const profileRoutes: RouteObject[] = [
  {
    path: 'profile',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ProfilePage />
        </MainLayout>
      </ProtectedRoute>
    ),
    // Chuẩn bị cho việc mở rộng với các trang hồ sơ con trong tương lai
    // children: [
    //   { path: 'edit', element: <EditProfilePage /> },
    //   { path: 'password', element: <ChangePasswordPage /> },
    //   { path: 'preferences', element: <UserPreferencesPage /> },
    // ]
  },
];