// src/components/ui/breadcrumb/index.ts
// Re-export các thành phần UI từ shadcn/ui
export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
  } from "@/common/components/ui/breadcrumb";
export * from './breadcrumb-context';
export * from './use-generator';
export * from './app-breadcrumb';
export * from './types';
export { AppBreadcrumb, StaticBreadcrumb } from './app-breadcrumb';