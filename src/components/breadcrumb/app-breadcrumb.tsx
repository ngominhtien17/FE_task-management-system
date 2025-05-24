// src/components/breadcrumb/app-breadcrumb.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useBreadcrumbGenerator } from './use-generator';
import type { RouteMapping, BreadcrumbItem as BreadcrumbItemType } from './types';

interface AppBreadcrumbProps {
  /** Class bổ sung cho thành phần */
  className?: string;
  
  /** Bản đồ ánh xạ tùy chỉnh từ đường dẫn sang nhãn */
  routeMapping?: RouteMapping;
  
  /** Các mục breadcrumb tùy chỉnh */
  items?: BreadcrumbItemType[];
  
  /** Đường dẫn gốc */
  rootPath?: string;
  
  /** Nhãn cho đường dẫn gốc */
  rootLabel?: string;
}

/**
 * AppBreadcrumb - Thành phần tổng hợp sử dụng thành phần shadcn/ui
 * 
 * Thành phần này tự động tạo breadcrumb dựa trên URL hiện tại
 * và cho phép tùy chỉnh hiển thị thông qua props
 */
export const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({
  className,
  routeMapping,
  items,
  rootPath,
  rootLabel,
}) => {
  const navigate = useNavigate();
  
  // Sử dụng hook để tạo các mục breadcrumb
  const breadcrumbItems = useBreadcrumbGenerator({
    customRouteMapping: routeMapping,
    customItems: items,
    rootPath,
    rootLabel,
  });

  // Không hiển thị nếu không có mục nào hoặc chỉ có mục gốc
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  // Render breadcrumb sử dụng thành phần shadcn/ui
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.current ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                  }}
                  href={item.href}
                >
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

/**
 * StaticBreadcrumb - Thành phần tĩnh hiển thị breadcrumb cho trang
 * Sử dụng khi cần hiển thị breadcrumb tùy chỉnh hoàn toàn
 */
interface StaticBreadcrumbProps {
  /** Tiêu đề trang */
  title: string;
  
  /** Đường dẫn cha (tùy chọn) */
  parentPath?: string;
  
  /** Nhãn đường dẫn cha (tùy chọn) */
  parentLabel?: string;
  
  /** Class bổ sung */
  className?: string;
}

export const StaticBreadcrumb: React.FC<StaticBreadcrumbProps> = ({
  title,
  parentPath,
  parentLabel,
  className,
}) => {
  const navigate = useNavigate();
  
  // Xây dựng các mục breadcrumb tĩnh
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {/* Trang chủ */}
        <BreadcrumbItem>
          <BreadcrumbLink 
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
            href="/dashboard"
          >
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        {/* Đường dẫn cha (nếu có) */}
        {parentPath && parentLabel && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={(e) => {
                  e.preventDefault();
                  navigate(parentPath);
                }}
                href={parentPath}
              >
                {parentLabel}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        
        {/* Trang hiện tại */}
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};