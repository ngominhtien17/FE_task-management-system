// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import các nhóm tuyến đường theo chức năng
import { authRoutes } from './authRoutes';
import { dashboardRoutes } from './dashboardRoutes';
import { managementRoutes } from './managementRoutes';
import { reportRoutes } from './reportRoutes';
import { settingsRoutes } from './settingsRoutes';
import { profileRoutes } from './profileRoutes';
import { otherRoutes } from './otherRoutes';
import { taskRoutes } from './taskRoutes';

/**
 * AppRouter - Component định tuyến chính của ứng dụng
 * 
 * Tích hợp các module tuyến đường phân tách theo chức năng, tạo thành một
 * hệ thống định tuyến tổng thể, có cấu trúc và dễ bảo trì.
 * 
 * Thiết kế này áp dụng nguyên tắc "Separation of Concerns" (Phân tách mối quan tâm)
 * giúp tối ưu hóa khả năng mở rộng và quản lý code.
 */
export function AppRouter() {
  // Tạo router từ các nhóm tuyến đường được phân tách theo chức năng
  const router = createBrowserRouter([
    // Xác thực - Đăng nhập, quên mật khẩu, đặt lại mật khẩu
    authRoutes,
    
    // Dashboard - Trang chính và dashboard
    ...dashboardRoutes,
    
    // Quản lý - Người dùng, tổ chức, công việc, nhóm, tài nguyên
    ...managementRoutes,

    // Quản lý công việc
    ...taskRoutes,

    // Báo cáo - Các báo cáo thống kê
    ...reportRoutes,
    
    // Cài đặt - Tùy chọn hệ thống và trợ giúp
    ...settingsRoutes,
    
    // Hồ sơ - Trang cá nhân người dùng
    ...profileRoutes,
    
    // Tuyến đường khác - Trang mặc định, 404, v.v.
    ...otherRoutes,
  ]);

  // Cung cấp router cho ứng dụng
  return <RouterProvider router={router} />;
}