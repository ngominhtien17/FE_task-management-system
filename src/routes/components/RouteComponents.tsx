// src/routes/components/RouteComponents.tsx
import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';


/**
 * Thành phần bảo vệ tuyến đường yêu cầu xác thực
 * Kiểm tra trạng thái xác thực và chuyển hướng nếu cần
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // const { isAuthenticated, isLoading } = useAuth();
  // giả lập đăng nhập đã xác thực
  const isAuthenticated = true;
  const isLoading = false;

  // Hiển thị trạng thái tải trong quá trình kiểm tra xác thực
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Chuyển hướng đến trang đăng nhập nếu chưa xác thực
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Hiển thị nội dung được bảo vệ
  return <>{children}</>;
};

/**
 * Thành phần bọc tải trễ
 * Triển khai Suspense với hiệu ứng loading tùy chỉnh
 */
interface LazyLoadWrapperProps {
  children: React.ReactNode;
  height?: string;
}

export const LazyLoadWrapper = ({ children, height = "h-96" }: LazyLoadWrapperProps) => (
  <Suspense fallback={
    <div className={`flex items-center justify-center ${height}`}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  }>
    {children}
  </Suspense>
);

/**
 * Tạo các tuyến đường tĩnh dành cho mục đích thiết kế UI
 * Sẽ được thay thế bằng các trang thực sự trong quá trình phát triển sau này
 */
export const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p>Trang {title.toLowerCase()} đang được phát triển.</p>
  </div>
);

// Placeholder components for future implementation
export const ForgotPasswordPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Quên mật khẩu</h1>
    <p>Trang đặt lại mật khẩu sẽ được phát triển sau.</p>
  </div>
);

export const ResetPasswordPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Đặt lại mật khẩu</h1>
    <p>Trang đặt lại mật khẩu sẽ được phát triển sau.</p>
  </div>
);

export const UsersPage = () => <PlaceholderPage title="Quản lý người dùng" />;
export const OrganizationPage = () => <PlaceholderPage title="Cấu trúc tổ chức" />;
export const TasksPage = () => <PlaceholderPage title="Quản lý công việc" />;
export const GroupsPage = () => <PlaceholderPage title="Quản lý nhóm" />;
export const ResourcesPage = () => <PlaceholderPage title="Quản lý tài nguyên" />;
export const ReportsPage = () => <PlaceholderPage title="Báo cáo thống kê" />;
export const SettingsPage = () => <PlaceholderPage title="Cài đặt" />;
export const HelpPage = () => <PlaceholderPage title="Trợ giúp" />;
export const ProfilePage = () => <PlaceholderPage title="Trang cá nhân" />;

export const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-6xl font-bold text-primary">404</h1>
    <p className="text-xl mb-6">Không tìm thấy trang bạn yêu cầu</p>
    <button onClick={() => window.history.back()} className="bg-primary text-white px-4 py-2 rounded-lg">
      Quay lại
    </button>
  </div>
);