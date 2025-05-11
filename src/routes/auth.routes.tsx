// routes/auth.routes.tsx
import { Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthLayout } from "@/layouts/auth-layout";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-loaded Auth Pages
const LoginPage = lazy(() => import("@/pages/auth/login"));
// Thêm các pages khác như Register, ForgotPassword, ResetPassword nếu cần

// Loading Fallback 
const AuthSkeleton = () => (
  <div className="w-full max-w-md mx-auto space-y-4 p-4">
    <Skeleton className="h-8 w-3/4 mx-auto" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
);

// Auth Routes Children
const authRoutesChildren: RouteObject[] = [
  {
    path: "login",
    element: (
      <Suspense fallback={<AuthSkeleton />}>
        <LoginPage />
      </Suspense>
    ),
  },
  // Thêm các route khác ở đây, ví dụ:
  // {
  //   path: "register",
  //   element: (
  //     <Suspense fallback={<AuthSkeleton />}>
  //       <RegisterPage />
  //     </Suspense>
  //   ),
  // },
  {
    path: "*",
    element: <Navigate to="/auth/login" replace />
  }
];

// Auth Routes Configuration
export const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: authRoutesChildren,
  }
];