// src/components/breadcrumb/types.ts

/**
 * Định nghĩa cấu trúc dữ liệu cho mỗi mục trong breadcrumb
 */
export interface BreadcrumbItem {
  /** Nhãn hiển thị cho người dùng */
  label: string;
  
  /** Đường dẫn điều hướng khi nhấp vào mục */
  href: string;
  
  /** Xác định mục hiện tại (mục cuối cùng) */
  current?: boolean;
}

/**
 * Context cho phép các thành phần con truy cập dữ liệu breadcrumb
 */
export interface BreadcrumbContextValue {
  /** Các mục breadcrumb hiện tại */
  items: BreadcrumbItem[];
  
  /** Cập nhật các mục breadcrumb */
  setItems: (items: BreadcrumbItem[]) => void;
  
  /** Thêm mục vào breadcrumb */
  addItem: (item: BreadcrumbItem) => void;
  
  /** Xóa mục khỏi breadcrumb */
  removeItem: (href: string) => void;
}

/**
 * Ánh xạ định danh đường dẫn sang nhãn hiển thị thân thiện
 */
export interface RouteMapping {
  /** 
   * Ánh xạ giữa phân đoạn đường dẫn và nhãn tương ứng
   * Ví dụ: { "users": "Quản lý người dùng", "task": "Quản lý công việc" }
   */
  [path: string]: string;
}