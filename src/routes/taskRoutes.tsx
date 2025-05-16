// src/routes/taskRoutes.tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute, LazyLoadWrapper } from './components/RouteComponents';

// Lazy load các component
const TaskListPage = lazy(() => import('../features/tasks/pages/TaskListPage'));
const TaskDetailPage = lazy(() => import('../features/tasks/pages/TaskDetailPage'));
const TaskCreatePage = lazy(() => import('../features/tasks/pages/TaskCreatePage'));
const TaskKanbanPage = lazy(() => import('../features/tasks/pages/TaskKanbanPage'));
const CategoryManagementPage = lazy(() => import('../features/tasks/pages/CategoryManagementPage'));
const TaskProgressUpdatePage = lazy(() => import('../features/tasks/pages/TaskProgressUpdatePage'));
const TaskCompletionReportPage = lazy(() => import('../features/tasks/pages/TaskCompletionReportPage'));
const TaskExtensionRequestPage = lazy(() => import('../features/tasks/pages/TaskExtensionRequestPage'));
const TaskEvaluationPage = lazy(() => import('../features/tasks/pages/TaskEvaluationPage'));
const FeedbackResponsePage = lazy(() => import('../features/tasks/pages/FeedbackResponsePage'));
const BatchAssignmentPage = lazy(() => import('../features/tasks/pages/BatchAssignmentPage'));
const TaskWorkflowGuidePage = lazy(() => import('../features/tasks/pages/TaskWorkflowGuidePage'));

export const taskRoutes: RouteObject[] = [
  {
    path: 'task',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      // Trang chính và tổng quan
      {
        index: true,
        element: (
          <LazyLoadWrapper>
            <TaskListPage />
          </LazyLoadWrapper>
        ),
      },
      // Trang hướng dẫn luồng làm việc
      {
        path: 'workflow',
        element: (
          <LazyLoadWrapper>
            <TaskWorkflowGuidePage />
          </LazyLoadWrapper>
        ),
      },
      // Quản lý và hiển thị danh sách
      {
        path: 'list',
        element: (
          <LazyLoadWrapper>
            <TaskListPage />
          </LazyLoadWrapper>
        ),
      },
      {
        path: 'kanban',
        element: (
          <LazyLoadWrapper>
            <TaskKanbanPage />
          </LazyLoadWrapper>
        ),
      },
      // Trang quản lý chi tiết
      {
        path: 'detail/:id',
        element: (
          <LazyLoadWrapper>
            <TaskDetailPage />
          </LazyLoadWrapper>
        ),
      },
      // Tạo và phân công
      {
        path: 'create',
        element: (
          <LazyLoadWrapper>
            <TaskCreatePage />
          </LazyLoadWrapper>
        ),
      },
      {
        path: 'batch-assign',
        element: (
          <LazyLoadWrapper>
            <BatchAssignmentPage />
          </LazyLoadWrapper>
        ),
      },
      // Quản lý danh mục
      {
        path: 'categories',
        element: (
          <LazyLoadWrapper>
            <CategoryManagementPage />
          </LazyLoadWrapper>
        ),
      },
      // Luồng cập nhật tiến độ
      {
        path: 'progress/:id',
        element: (
          <LazyLoadWrapper>
            <TaskProgressUpdatePage />
          </LazyLoadWrapper>
        ),
      },
      // Luồng hoàn thành
      {
        path: 'complete/:id',
        element: (
          <LazyLoadWrapper>
            <TaskCompletionReportPage />
          </LazyLoadWrapper>
        ),
      },
      // Luồng xin gia hạn
      {
        path: 'extend/:id',
        element: (
          <LazyLoadWrapper>
            <TaskExtensionRequestPage />
          </LazyLoadWrapper>
        ),
      },
      // Luồng đánh giá và phản hồi
      {
        path: 'evaluate/:id',
        element: (
          <LazyLoadWrapper>
            <TaskEvaluationPage />
          </LazyLoadWrapper>
        ),
      },
      {
        path: 'feedback/:id',
        element: (
          <LazyLoadWrapper>
            <FeedbackResponsePage />
          </LazyLoadWrapper>
        ),
      },
    ],
  },
];