// src/routes/reportRoutes.tsx
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute, ReportsPage } from './components/RouteComponents';

/**
 * Định nghĩa tuyến đường cho chức năng báo cáo và thống kê
 * Cấu trúc này cho phép mở rộng thêm các trang báo cáo con nếu cần thiết
 */
export const reportRoutes: RouteObject[] = [
  {
    path: 'reports',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ReportsPage />
        </MainLayout>
      </ProtectedRoute>
    ),
    // Chuẩn bị cho việc mở rộng với các trang báo cáo con trong tương lai
    // children: [
    //   { path: 'daily', element: <DailyReportPage /> },
    //   { path: 'monthly', element: <MonthlyReportPage /> },
    //   { path: 'custom', element: <CustomReportPage /> },
    // ]
  },
];