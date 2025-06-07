// src/components/ui/breadcrumb/breadcrumb-context.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { BreadcrumbContextValue, BreadcrumbItem } from './types';

// Tạo context với giá trị mặc định
const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  items: [],
  setItems: () => {},
  addItem: () => {},
  removeItem: () => {},
});

/**
 * Hook tùy chỉnh để sử dụng BreadcrumbContext
 */
export const useBreadcrumb = () => useContext(BreadcrumbContext);

/**
 * Provider cho BreadcrumbContext - cung cấp dữ liệu breadcrumb cho toàn ứng dụng
 */
export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BreadcrumbItem[]>([
    { label: 'Trang chủ', href: '/dashboard', current: false }
  ]);

  // Thêm mục mới vào breadcrumb
  const addItem = useCallback((item: BreadcrumbItem) => {
    setItems(prevItems => {
      // Kiểm tra nếu mục đã tồn tại, cập nhật thay vì thêm mới
      const existingItemIndex = prevItems.findIndex(i => i.href === item.href);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = { ...item, current: false };
        
        // Đánh dấu mục cuối cùng là mục hiện tại
        if (updatedItems.length > 0) {
          updatedItems[updatedItems.length - 1].current = true;
        }
        
        return updatedItems;
      }
      
      // Cập nhật mục hiện tại cho tất cả các mục
      const newItems = prevItems.map(i => ({ ...i, current: false }));
      
      // Thêm mục mới và đánh dấu là mục hiện tại
      return [...newItems, { ...item, current: true }];
    });
  }, []);

  // Xóa mục khỏi breadcrumb dựa trên href
  const removeItem = useCallback((href: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.href !== href);
      
      // Đánh dấu mục cuối cùng là mục hiện tại
      if (newItems.length > 0) {
        newItems[newItems.length - 1].current = true;
      }
      
      return newItems;
    });
  }, []);

  // Giá trị của context
  const contextValue: BreadcrumbContextValue = {
    items,
    setItems,
    addItem,
    removeItem,
  };

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {children}
    </BreadcrumbContext.Provider>
  );
};