// src/routes/protected-route.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component HOC bảo vệ routes, yêu cầu xác thực để truy cập
 * @param children Nội dung route cần bảo vệ
 * @param redirectTo Đường dẫn chuyển hướng nếu chưa xác thực (mặc định: /auth/login)
 */
export function ProtectedRoute({ 
  children, 
  redirectTo = "/auth/login" 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  const location = useLocation();
  
  // Nếu đang loading, hiển thị loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  // Nếu chưa xác thực, redirect đến trang login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  
  // Nếu đã xác thực, render children
  return <>{children}</>;
}