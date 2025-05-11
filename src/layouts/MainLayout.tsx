// src/layouts/components/MainHeader.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Menu, 
  ChevronLeft, 
  Search,
  User as UserIcon,
  LogOut
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
// import { User } from "@/types/auth";

interface MainHeaderProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  onLogout: () => void;
  user: unknown | null;
}

export function MainHeader({ 
  toggleSidebar, 
  isSidebarCollapsed, 
  onLogout,
  user
}: MainHeaderProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-40 flex items-center px-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="mr-2"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <Menu /> : <ChevronLeft />}
        </Button>
        
        <div className="text-xl font-semibold flex items-center gap-2">
          <span className="text-primary">Hệ thống quản lý công việc</span>
        </div>
      </div>
      
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Tìm kiếm..." 
            className="w-full pl-8 bg-muted/40"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={user?.customSettings?.profileImage || ""} 
                  alt={user?.fullName || "User"} 
                />
                <AvatarFallback>{user ? getInitials(user.fullName) : "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{user?.fullName || "Người dùng"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Tài khoản</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}