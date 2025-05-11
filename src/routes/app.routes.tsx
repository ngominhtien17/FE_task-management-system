// routes/app.routes.tsx
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { ProtectedRoute } from "./protected-route";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-loaded Pages
const DashboardPage = lazy(() => import("@/pages/dashboard/dashboard"));
// Các page khác sẽ được thêm vào như tasks, users, reports, ...

// Loading Fallback
const PageSkeleton = () => (
  <div className="w-full space-y-4">
    <Skeleton className="h-12 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Skeleton className="h-64 rounded-md" />
      <Skeleton className="h-64 rounded-md" />
      <Skeleton className="h-64 rounded-md" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

// Placeholder Components cho các trang chưa phát triển
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p>Nội dung trang {title.toLowerCase()} sẽ được phát triển sau.</p>
  </div>
);

// App Routes Children
const appRoutesChildren: RouteObject[] = [
  {
    path: "dashboard",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <DashboardPage />
      </Suspense>
    ),
  },
  // Các route module Users
  {
    path: "users",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PlaceholderPage title="Quản lý người dùng" />
      </Suspense>
    ),
  },
  // Các route module Organization
  {
    path: "organization",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PlaceholderPage title="Cấu trúc tổ chức" />
      </Suspense>
    ),
  },
  // Các route module Tasks
  {
    path: "tasks",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PlaceholderPage title="Quản lý công việc" />
      </Suspense>
    ),
  },
  // Các route module Reports
  {
    path: "reports",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PlaceholderPage title="Báo cáo thống kê" />
      </Suspense>
    ),
  },
  // Các route module Groups
  {
    path: "groups",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PlaceholderPage title="Quản lý nhóm" />
      </Suspense>
    ),
  },
  // Các route module Resources
  {
    path: "resources",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PlaceholderPage title="Quản lý tài nguyên" />
      </Suspense>
    ),
  },
  // Các route module Settings
  {
    path: "settings",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PlaceholderPage title="Cài đặt hệ thống" />
      </Suspense>
    ),
  },
  // Các route module Help
  {
    path: "help",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PlaceholderPage title="Trợ giúp" />
      </Suspense>
    ),
  },
  // Fallback route
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />
  }
];

// App Routes Configuration with Protected Layout
export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      // <ProtectedRoute>
        <MainLayout />
      // </ProtectedRoute>
    ),
    children: appRoutesChildren,
  }
];