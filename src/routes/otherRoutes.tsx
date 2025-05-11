// src/routes/otherRoutes.tsx
import { Navigate} from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { NotFoundPage } from './components/RouteComponents';

/**
 * Định nghĩa các tuyến đường bổ sung, bao gồm tuyến đường trang chủ mặc định,
 * chuyển hướng và trang 404 không tìm thấy
 */
export const otherRoutes: RouteObject[] = [
  // Điều hướng mặc định - Khi ở môi trường phát triển UI, chuyển hướng đến trang đăng nhập
  {
    path: '/',
    index: true,
    element: <Navigate to="/auth/login" replace />,
  },
  
  // Tuyến đường 404 - Hiển thị khi không tìm thấy trang
  {
    path: '*',
    element: <NotFoundPage />,
  },
];