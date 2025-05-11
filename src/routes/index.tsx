// routes/index.tsx
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { appRoutes } from "./app.routes";

// Root Routes Configuration
const rootRoutes: RouteObject[] = [
  // Redirect từ root đến dashboard
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  // Các auth routes
  ...authRoutes,
  // Các app routes
  ...appRoutes
];

// Create Browser Router
const router = createBrowserRouter(rootRoutes);

/**
 * AppRouter Component
 * Điểm truy cập chính cho hệ thống định tuyến
 */
export function AppRouter() {
  return <RouterProvider router={router} />;
}