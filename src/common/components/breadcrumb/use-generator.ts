// src/components/breadcrumb/use-generator.ts
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { BreadcrumbItem, RouteMapping } from './types';

/**
 * Ánh xạ mặc định từ đường dẫn URL sang nhãn hiển thị thân thiện
 */
const defaultRouteMapping: RouteMapping = {
  'dashboard': 'Trang chủ',
  'users': 'Quản lý người dùng',
  'task': 'Quản lý công việc',
  'create': 'Tạo mới',
  'detail': 'Chi tiết',
  'kanban': 'Bảng Kanban',
  'workflow': 'Hướng dẫn quy trình',
  'batch-assign': 'Phân công hàng loạt',
  'batch-permission': 'Phân quyền hàng loạt',
  'categories': 'Quản lý danh mục',
  'import': 'Nhập từ file',
  'progress': 'Cập nhật tiến độ',
  'complete': 'Hoàn thành công việc',
  'extend': 'Yêu cầu gia hạn',
  'evaluate': 'Đánh giá',
  'feedback': 'Phản hồi',
  'profile': 'Trang cá nhân',
  'reports': 'Báo cáo thống kê',
  'settings': 'Cài đặt',
  'help': 'Trợ giúp',
  'organization': 'Cấu trúc tổ chức',
  'groups': 'Quản lý nhóm',
  'resources': 'Quản lý tài nguyên'
};

/**
 * Tùy chọn cho hook useBreadcrumbGenerator
 */
interface BreadcrumbGeneratorOptions {
  /** Bản đồ ánh xạ tùy chỉnh từ đường dẫn sang nhãn */
  customRouteMapping?: RouteMapping;
  
  /** Các tuyến đường tùy chỉnh ghi đè */
  customItems?: BreadcrumbItem[];
  
  /** Đường dẫn gốc (mặc định: /dashboard) */
  rootPath?: string;
  
  /** Nhãn cho đường dẫn gốc (mặc định: Trang chủ) */
  rootLabel?: string;
}

/**
 * Hook tạo các mục breadcrumb dựa trên đường dẫn URL hiện tại
 * 
 * @param options Tùy chọn cấu hình
 * @returns Mảng các mục breadcrumb
 */
export function useBreadcrumbGenerator(options: BreadcrumbGeneratorOptions = {}): BreadcrumbItem[] {
  const {
    customRouteMapping = {},
    customItems = [],
    rootPath = '/dashboard',
    rootLabel = 'Trang chủ'
  } = options;
  
  const location = useLocation();
  
  // Kết hợp bản đồ tuyến đường mặc định với tùy chỉnh
  const routeMapping = useMemo(
    () => ({ ...defaultRouteMapping, ...customRouteMapping }),
    [customRouteMapping]
  );
  
  // Tạo các mục breadcrumb từ URL hiện tại
  const breadcrumbItems = useMemo(() => {
    // Nếu có tuyến đường tùy chỉnh, sử dụng chúng
    if (customItems.length > 0) {
      return customItems;
    }
    
    // Phân tách đường dẫn URL hiện tại
    const currentPath = location.pathname;
    
    // Trường hợp đặc biệt cho trang chủ
    if (currentPath === '/' || currentPath === rootPath) {
      return [{ label: rootLabel, href: rootPath, current: true }];
    }
    
    // Phân tách đường dẫn thành các phân đoạn
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // Xây dựng các mục breadcrumb
    const items: BreadcrumbItem[] = [
      { label: rootLabel, href: rootPath, current: false }
    ];
    
    // Xây dựng các mục breadcrumb từ các phân đoạn đường dẫn
    pathSegments.reduce((accumPath, segment, index) => {
      // Kiểm tra xem segment có phải là ID (ví dụ: detail/123)
      const isIdSegment = /^\d+$/.test(segment);
      
      // Nếu là ID, không tạo mục breadcrumb mới mà cập nhật href của mục trước đó
      if (isIdSegment && items.length > 0) {
        const prevItem = items[items.length - 1];
        prevItem.href = `${prevItem.href}/${segment}`;
        return `${accumPath}/${segment}`;
      }
      
      // Xây dựng đường dẫn tích lũy
      const path = `${accumPath}/${segment}`;
      
      // Thêm mục mới
      const label = routeMapping[segment] || 
                    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
                    
      items.push({
        label,
        href: path,
        current: index === pathSegments.length - 1
      });
      
      return path;
    }, '');
    
    return items;
  }, [location.pathname, customItems, rootPath, rootLabel, routeMapping]);
  
  return breadcrumbItems;
}