// routes/modules/users.routes.tsx
import type { RouteObject } from "react-router-dom";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-loaded Users Pages
// const UserListPage = lazy(() => import("@/pages/users/user-list"));
// const UserDetailsPage = lazy(() => import("@/pages/users/user-details"));
// const UserCreatePage = lazy(() => import("@/pages/users/user-create"));
// const UserEditPage = lazy(() => import("@/pages/users/user-edit"));

// Loading Fallback
const UsersSkeleton = () => (
  <div className="w-full space-y-4">
    <Skeleton className="h-12 w-full" />
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

// Placeholder Component cho các trang chưa phát triển
const UserPlaceholder = ({ title }: { title: string }) => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p>Nội dung trang {title.toLowerCase()} sẽ được phát triển sau.</p>
  </div>
);

// Tùy vào mức độ phát triển của dự án, bạn có thể sử dụng placeholders hoặc components thực

// Users Routes
export const usersRoutes: RouteObject[] = [
  {
    path: "users",
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<UsersSkeleton />}>
            <UserPlaceholder title="Danh sách người dùng" />
            {/* <UserListPage /> */}
          </Suspense>
        ),
      },
      {
        path: "create",
        element: (
          <Suspense fallback={<UsersSkeleton />}>
            <UserPlaceholder title="Tạo người dùng mới" />
            {/* <UserCreatePage /> */}
          </Suspense>
        ),
      },
      {
        path: ":id",
        element: (
          <Suspense fallback={<UsersSkeleton />}>
            <UserPlaceholder title="Chi tiết người dùng" />
            {/* <UserDetailsPage /> */}
          </Suspense>
        ),
      },
      {
        path: ":id/edit",
        element: (
          <Suspense fallback={<UsersSkeleton />}>
            <UserPlaceholder title="Chỉnh sửa người dùng" />
            {/* <UserEditPage /> */}
          </Suspense>
        ),
      },
    ],
  },
];