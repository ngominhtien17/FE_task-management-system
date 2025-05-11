// routes/protected-route.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

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
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
}