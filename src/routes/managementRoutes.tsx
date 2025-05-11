// src/routes/managementRoutes.tsx
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute, UsersPage, OrganizationPage, TasksPage, GroupsPage, ResourcesPage } from './components/RouteComponents';

/**
 * Định nghĩa các tuyến đường liên quan đến chức năng quản lý
 * Bao gồm quản lý người dùng, cấu trúc tổ chức, công việc, nhóm và tài nguyên
 * Tất cả đều được bảo vệ và yêu cầu xác thực
 */
export const managementRoutes: RouteObject[] = [
  // Quản lý người dùng
  {
    path: 'users',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <UsersPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  // Cấu trúc tổ chức
  {
    path: 'organization',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <OrganizationPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  // Quản lý công việc
  {
    path: 'tasks',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <TasksPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  // Quản lý nhóm
  {
    path: 'groups',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <GroupsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  // Quản lý tài nguyên
  {
    path: 'resources',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ResourcesPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
];