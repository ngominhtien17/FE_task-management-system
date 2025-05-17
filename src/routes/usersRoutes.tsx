// src/routes/usersRoutes.tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute, LazyLoadWrapper } from './components/RouteComponents';

// Lazy load các component
const UserListPage = lazy(() => import('../features/users/pages/UserListPage'));
const UserCreatePage = lazy(() => import('../features/users/pages/UserCreatePage'));
const UserDetailPage = lazy(() => import('../features/users/pages/UserDetailPage'));
const BatchPermissionPage = lazy(() => import('../features/users/pages/BatchPermissionPage'));
const UserImportPage = lazy(() => import('../features/users/pages/UserImportPage'));

/**
 * Định nghĩa các tuyến đường liên quan đến chức năng quản lý người dùng
 * Bao gồm danh sách người dùng, tạo người dùng mới, chi tiết người dùng và phân quyền hàng loạt
 */
export const usersRoutes: RouteObject[] = [
    {
        path: 'users',
        element: (
            <ProtectedRoute>
            <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            // Trang danh sách người dùng (mặc định)
            {
                index: true,
                element: (
                    <LazyLoadWrapper>
                    <UserListPage />
                    </LazyLoadWrapper>
                ),
            },
            // Trang tạo tài khoản người dùng mới
            {
                path: 'create',
                element: (
                    <LazyLoadWrapper>
                    <UserCreatePage />
                    </LazyLoadWrapper>
                ),
            },
            // Trang chi tiết người dùng
            {
                path: 'detail/:id',
                element: (
                    <LazyLoadWrapper>
                    <UserDetailPage />
                    </LazyLoadWrapper>
                ),
            },
            // Trang phân quyền hàng loạt
            {
                path: 'batch-permission',
                element: (
                    <LazyLoadWrapper>
                    <BatchPermissionPage />
                    </LazyLoadWrapper>
                ),
            },
            // Trang nhập người dùng từ file
            {
                path: 'import',
                element: (
                    <LazyLoadWrapper>
                    <UserImportPage />
                    </LazyLoadWrapper>
                ),
            },
        ],
    },
];