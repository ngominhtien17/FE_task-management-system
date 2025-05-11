// src/layouts/components/MainSidebar.tsx
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  FolderTree,
  CheckSquare,
  BarChart3,
  Settings,
  HelpCircle,
  User,
  Package,
  Layers
} from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
  isActive?: boolean;
}

const NavItem = ({ icon, label, href, isCollapsed, isActive }: NavItemProps) => {
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to={href}
              className={({ isActive }) =>
                cn(
                  "flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              {icon}
              <span className="sr-only">{label}</span>
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

interface MainSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
}

export function MainSidebar({ isCollapsed, setIsCollapsed, isMobile }: MainSidebarProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Handle mobile menu states
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  // Close the mobile sheet when route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const navigationItems = [
    { icon: <Home size={20} />, label: "Trang chính", href: "/dashboard" },
    { icon: <Users size={20} />, label: "Quản lý người dùng", href: "/users" },
    { icon: <FolderTree size={20} />, label: "Cấu trúc tổ chức", href: "/organization" },
    { icon: <CheckSquare size={20} />, label: "Quản lý công việc", href: "/tasks" },
    { icon: <User size={20} />, label: "Quản lý nhóm", href: "/groups" },
    { icon: <Package size={20} />, label: "Quản lý tài nguyên", href: "/resources" },
    { icon: <BarChart3 size={20} />, label: "Báo cáo thống kê", href: "/reports" },
    { icon: <Settings size={20} />, label: "Cài đặt", href: "/settings" },
    { icon: <HelpCircle size={20} />, label: "Trợ giúp", href: "/help" },
  ];

  const sidebarContent = (
    <div className={cn("flex h-full flex-col gap-2", isCollapsed ? "items-center" : "")}>
      <div className={cn("flex h-16 items-center", isCollapsed ? "justify-center" : "px-4")}>
        {!isCollapsed && (
          <NavLink to="/" className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Task System</span>
          </NavLink>
        )}
        {isCollapsed && (
          <Layers className="h-6 w-6 text-primary" />
        )}
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className={cn("flex flex-col gap-1", isCollapsed ? "items-center" : "")}>
          {navigationItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isCollapsed={isCollapsed}
              isActive={location.pathname === item.href}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  // For mobile: use Sheet component
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-60 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // For desktop: render the sidebar directly
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-30 h-[calc(100vh-64px)] border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {sidebarContent}
    </aside>
  );
}