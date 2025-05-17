import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Home, Users, FolderTree, CheckSquare, Calendar, FileText, Kanban, List,
  PlusCircle, Users2, FolderPlus, HelpCircle, Layers, BarChart3, Settings, User,
  ChevronRight, ChevronLeft, ChevronDown, Package
} from "lucide-react";

// Định nghĩa kiểu dữ liệu với TypeScript
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
  badge?: number;
  isChild?: boolean;
  children?: Array<{
    icon: React.ReactNode;
    label: string;
    href: string;
    badge?: number;
    exactPath?: boolean;
  }>;
  isOpen?: boolean;
  onToggle?: () => void;
  exactPath?: boolean;
  isParentMenu?: boolean;
}

// Thành phần NavItem với cơ chế hiển thị nâng cao cho các phần tử menu con
const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  href, 
  isCollapsed, 
  badge, 
  isChild = false,
  children,
  isOpen,
  onToggle,
  exactPath = false,
  isParentMenu = false
}) => {
  const location = useLocation();
  
  // Cải thiện logic xác định trạng thái active
  const isActive = useMemo(() => {
    const currentPath = location.pathname;
    
    // Trường hợp cho menu cha "Quản lý công việc" - luôn active khi ở bất kỳ trang /task nào
    if (isParentMenu && href === '/task') {
      return currentPath === '/task' || currentPath.startsWith('/task/');
    }
    
    // Xử lý trường hợp so khớp chính xác cho các menu con
    if (exactPath) {
      return currentPath === href;
    }
    
    // Trường hợp đặc biệt cho Danh sách công việc
    if (href === '/task' && !isParentMenu) {
      return (currentPath === '/task' || currentPath === '/task/') &&
             !currentPath.match(/^\/task\/[a-zA-Z]/);
    }
    
    // Kiểm tra path cho Kanban và các trang con khác
    if (href === '/task/kanban') {
      return currentPath === '/task/kanban';
    }
    
    // Các trường hợp khác sử dụng matchPath để xác định chính xác active state
    return currentPath === href || 
           (!exactPath && currentPath.startsWith(href) && href !== '/dashboard' && href !== '/task');
  }, [location.pathname, href, exactPath, isParentMenu]);
  
  const hasChildren = children && children.length > 0;
  
  // CSS classes cơ bản và hiệu ứng hover với scale
  const baseItemClasses = "transition-all duration-200 hover:scale-[1.03]";
  
  // Xử lý khi menu đang thu gọn
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full mb-1">
              <NavLink
                to={hasChildren ? "#" : href}
                onClick={hasChildren ? onToggle : undefined}
                className={cn(
                  baseItemClasses,
                  "relative flex h-10 w-10 items-center justify-center rounded-md",
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700"
                )}
              >
                {icon}
                
                {badge && badge > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
                <span className="sr-only">{label}</span>
              </NavLink>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-blue-700 font-medium text-white">
            {label}
            {hasChildren && (
              <div className="mt-1 ml-2 space-y-1">
                {children.map((child, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Hiển thị menu con khi menu mở rộng
  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={onToggle}
          className={cn(
            baseItemClasses,
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
            isActive 
              ? "bg-blue-600 text-white shadow-sm" 
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0">{icon}</span>
            <span className="truncate">{label}</span>
          </div>
          {badge && badge > 0 && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white mr-1">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
          <ChevronDown
            size={16}
            className={cn(
              "transition-transform duration-300",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </button>
        
        <div
          className={cn(
            "ml-4 pl-2 border-l border-gray-200 overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className={cn(
            "space-y-1 py-1 transition-all duration-300",
            isOpen ? "translate-y-0" : "-translate-y-3"
          )}>
            {children.map((child, index) => {
              // Xác định trạng thái active cho từng menu con một cách độc lập
              const childIsActive = (() => {
                const currentPath = location.pathname;
                
                // Xử lý trường hợp so khớp chính xác
                if (child.exactPath) {
                  return currentPath === child.href;
                }
                
                // Trường hợp đặc biệt cho Danh sách công việc
                if (child.href === '/task') {
                  return (currentPath === '/task' || currentPath === '/task/') &&
                         !currentPath.match(/^\/task\/[a-zA-Z]/);
                }
                
                // Trường hợp đặc biệt cho Bảng Kanban
                if (child.href === '/task/kanban') {
                  return currentPath === '/task/kanban';
                }
                
                // Các trang con khác
                return currentPath === child.href;
              })();
              
              return (
                <NavLink
                  key={index}
                  to={child.href}
                  className={cn(
                    baseItemClasses,
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    childIsActive 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  )}
                >
                  <span className="flex-shrink-0">{child.icon}</span>
                  <span className="truncate">{child.label}</span>
                  {child.badge && child.badge > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
                      {child.badge > 99 ? '99+' : child.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Mã cho trạng thái mở rộng (menu thông thường)
  // Sử dụng class function để kiểm soát trạng thái active chính xác
  return (
    <NavLink
      to={href}
      className={({ isActive: routerActive }) => {
        // Áp dụng logic kiểm tra tùy chỉnh cho menu cụ thể
        let finalActive = routerActive;
        
        // Xử lý các trường hợp đặc biệt
        if (isParentMenu && href === '/task') {
          const currentPath = location.pathname;
          finalActive = currentPath === '/task' || currentPath.startsWith('/task/');
        }
        
        if (exactPath) {
          finalActive = location.pathname === href;
        }
        
        return cn(
          baseItemClasses,
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium relative",
          isChild && "pl-10",
          finalActive 
            ? "bg-blue-600 text-white shadow-sm" 
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        );
      }}
    >
      {isChild && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      )}
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
      {badge && badge > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  );
};

// Định nghĩa kiểu dữ liệu cho MainSidebar
interface MainSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isMobile: boolean;
}

// Thành phần MainSidebar với trạng thái và hiển thị nâng cao
export const MainSidebar: React.FC<MainSidebarProps> = ({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobile 
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(["task"]));

  // Mock data cho huy hiệu
  const mockBadges: Record<string, number> = {
    tasks: 5,
    resources: 2,
  };

  // Xử lý đồng bộ trạng thái mobile
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  // Đóng sheet khi điều hướng trên thiết bị di động
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Hàm xử lý đóng/mở menu
  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // Cấu hình điều hướng với cấu trúc phân cấp
  const navigationItems = [
    { icon: <Home size={20} />, label: "Trang chủ", href: "/dashboard" },
    { 
      icon: <Users size={20} />, 
      label: "Quản lý người dùng", 
      href: "/users",
      isParentMenu: true,  // Đánh dấu đây là menu cha
      children: [
        { icon: <List size={18} />, label: "Danh sách người dùng", href: "/users" },
        { icon: <PlusCircle size={18} />, label: "Tạo tài khoản mới", href: "/users/create" },
        { icon: <Users2 size={18} />, label: "Phân quyền hàng loạt", href: "/users/batch-permission" },
        { icon: <FolderPlus size={18} />, label: "Nhập từ file", href: "/users/import" }
      ]
    },
    { icon: <FolderTree size={20} />, label: "Cấu trúc tổ chức", href: "/organization" },
    { 
      icon: <CheckSquare size={20} />, 
      label: "Quản lý công việc", 
      href: "/task", 
      badge: mockBadges.tasks,
      isParentMenu: true,  // Đánh dấu đây là menu cha
      children: [
        { icon: <List size={18} />, label: "Danh sách công việc", href: "/task" },
        { icon: <Kanban size={18} />, label: "Bảng Kanban", href: "/task/kanban" },
        { icon: <PlusCircle size={18} />, label: "Tạo công việc mới", href: "/task/create" },
        { icon: <Users2 size={18} />, label: "Phân công hàng loạt", href: "/task/batch-assign" },
        { icon: <FolderPlus size={18} />, label: "Quản lý danh mục", href: "/task/categories" },
        { icon: <HelpCircle size={18} />, label: "Hướng dẫn quy trình", href: "/task/workflow" }
      ]
    },
    { icon: <User size={20} />, label: "Quản lý nhóm", href: "/groups" },
    { icon: <Package size={20} />, label: "Quản lý tài nguyên", href: "/resources", badge: mockBadges.resources },
    { icon: <BarChart3 size={20} />, label: "Báo cáo thống kê", href: "/reports" },
    { icon: <Settings size={20} />, label: "Cài đặt", href: "/settings" },
  ];

  // Nội dung thanh điều hướng
  const sidebarContent = (
    <div className={cn("flex h-full flex-col gap-1", isCollapsed ? "items-center" : "")}>
      {/* Logo và tiêu đề */}
      <div className={cn("flex h-16 items-center border-b border-gray-100", 
        isCollapsed ? "justify-center" : "px-4")}>
        {!isCollapsed && (
          <NavLink to="/" className="flex items-center gap-2 py-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-blue-700">Quản Lý Công Việc</span>
          </NavLink>
        )}
        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
            <Layers className="h-5 w-5" />
          </div>
        )}
      </div>
      
      {/* Vùng cuộn danh sách điều hướng */}
      <ScrollArea className="flex-1 px-2 py-3">
        <div className={cn(
          "flex flex-col gap-1", 
          isCollapsed ? "items-center" : ""
        )}>
          {navigationItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isCollapsed={isCollapsed}
              badge={item.badge}
              children={item.children}
              isOpen={expandedMenus.has(item.href.split('/')[1])}
              onToggle={() => toggleMenu(item.href.split('/')[1])}
              exactPath={item.href === '/task' && !item.isParentMenu} // Áp dụng exactPath cho menu con
              isParentMenu={item.isParentMenu} // Truyền thuộc tính isParentMenu
            />
          ))}
        </div>
      </ScrollArea>
      
      {/* Nút điều khiển thu gọn - với tính năng trực quan cao */}
      <div className={cn(
        "mt-auto border-t border-gray-100 p-3",
        isCollapsed ? "w-full flex justify-center" : ""
      )}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "flex w-full items-center justify-center rounded-md py-2 transition-all duration-200 hover:scale-[1.03]",
            "bg-blue-50 text-blue-600 hover:bg-blue-100",
            // Đảm bảo nút luôn có thể nhìn thấy được
            isCollapsed && "bg-blue-100 hover:bg-blue-200"
          )}
        >
          {isCollapsed ? 
            <ChevronRight className="h-5 w-5" /> : 
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Thu gọn menu</span>
            </div>
          }
        </button>
      </div>
    </div>
  );

  // Render cho thiết bị di động
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-64 border-r border-gray-100 bg-white p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Render cho desktop
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-30 h-[calc(100vh-64px)] border-r border-gray-100 bg-white transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {sidebarContent}
    </aside>
  );
};