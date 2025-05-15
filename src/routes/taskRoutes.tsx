// src/routes/taskRoutes.tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute, LazyLoadWrapper } from './components/RouteComponents';

// Lazy load các component trong module task để tối ưu hiệu suất
const TaskListPage = lazy(() => import('../features/tasks/pages/TaskListPage'));
const TaskDetailPage = lazy(() => import('../features/tasks/pages/TaskDetailPage'));
const TaskCreatePage = lazy(() => import('../features/tasks/pages/TaskCreatePage'));
const TaskKanbanPage = lazy(() => import('../features/tasks/pages/TaskKanbanPage'));

/**
 * Định nghĩa các tuyến đường chi tiết cho module Quản lý Công việc
 * Cấu trúc phân cấp cho phép điều hướng dễ dàng giữa các tính năng con 
 * trong hệ thống quản lý công việc
 */
// Áp dụng tải component trễ (lazy loading) để tối ưu hiệu suất

export const taskRoutes: RouteObject[] = [
  {
    path: 'task',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      // Trang danh sách công việc (mặc định)
      {
        index: true,
        element: (
          <LazyLoadWrapper>
            <TaskListPage />
          </LazyLoadWrapper>
        ),
      },
      // Trang chi tiết công việc
      {
        path: 'detail/:id',
        element: (
          <LazyLoadWrapper>
            <TaskDetailPage />
          </LazyLoadWrapper>
        ),
      },
      // Trang tạo công việc mới
      {
        path: 'create',
        element: (
          <LazyLoadWrapper>
            <TaskCreatePage />
          </LazyLoadWrapper>
        ),
      },
      // Trang xem công việc dạng Kanban
      {
        path: 'kanban',
        element: (
          <LazyLoadWrapper>
            <TaskKanbanPage />
          </LazyLoadWrapper>
        ),
      },
    ],
  },
];