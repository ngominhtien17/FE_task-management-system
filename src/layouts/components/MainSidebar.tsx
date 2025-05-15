// src/layouts/components/MainSidebar.tsx
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Home, Users, FolderTree, CheckSquare, 
  BarChart3, Settings, HelpCircle, User, 
  Package, Layers, ChevronRight, ChevronLeft
} from "lucide-react";

// Định nghĩa kiểu dữ liệu với TypeScript
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
  badge?: number;
}

// Thành phần NavItem với cơ chế hiển thị nâng cao
const NavItem: React.FC<NavItemProps> = ({ icon, label, href, isCollapsed, badge }) => {
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to={href}
              className={({ isActive }) =>
                cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-md transition-all",
                  // Áp dụng cơ chế tương phản cưỡng bức với nền có màu sắc
                  isActive 
                    ? "bg-blue-600 text-white" 
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700",
                  // Đảm bảo hiệu ứng shadow để tăng cường chiều sâu
                  isActive && "shadow-md shadow-blue-200"
                )
              }
            >
              {icon}
              
              {badge && badge > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
              <span className="sr-only">{label}</span>
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-blue-700 font-medium text-white">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Mã cho trạng thái mở rộng
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative",
          isActive 
            ? "bg-blue-600 text-white shadow-sm" 
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        )
      }
    >
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

  // Cấu hình điều hướng
  const navigationItems: Array<{
    icon: React.ReactNode;
    label: string;
    href: string;
    badge?: number;
  }> = [
    { icon: <Home size={20} />, label: "Trang chủ", href: "/dashboard" },
    { icon: <Users size={20} />, label: "Quản lý người dùng", href: "/users" },
    { icon: <FolderTree size={20} />, label: "Cấu trúc tổ chức", href: "/organization" },
    { icon: <CheckSquare size={20} />, label: "Quản lý công việc", href: "/task", badge: mockBadges.tasks },
    { icon: <User size={20} />, label: "Quản lý nhóm", href: "/groups" },
    { icon: <Package size={20} />, label: "Quản lý tài nguyên", href: "/resources", badge: mockBadges.resources },
    { icon: <BarChart3 size={20} />, label: "Báo cáo thống kê", href: "/reports" },
    { icon: <Settings size={20} />, label: "Cài đặt", href: "/settings" },
    { icon: <HelpCircle size={20} />, label: "Trợ giúp", href: "/help" },
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
            "flex w-full items-center justify-center rounded-md py-2 transition-all",
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