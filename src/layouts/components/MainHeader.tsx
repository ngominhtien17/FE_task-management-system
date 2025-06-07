// src/layouts/components/MainHeader.tsx
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { 
  Bell, 
  Menu, 
  ChevronLeft, 
  Search,
  UserIcon,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/common/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";

interface MainHeaderProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export function MainHeader({ 
  toggleSidebar, 
  isSidebarCollapsed, 
}: MainHeaderProps) {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
    } catch (error) {
      console.error('Logout failed:', error);
      // Force navigation even if logout API fails
      navigate("/auth/login");
    }
  };

  const getInitials = (name: string = "") => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const isLoggingOut = loading === 'pending';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-40 flex items-center px-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="mr-2 text-blue-700 hover:bg-blue-50"
          aria-label={isSidebarCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
        >
          {isSidebarCollapsed ? <Menu /> : <ChevronLeft />}
        </Button>
        
        <ArrowLeft 
          className="h-6 w-6 mr-2 text-blue-700 cursor-pointer hover:text-blue-800" 
          onClick={() => navigate(-1)}
        />
        
        <div className="text-xl font-semibold flex items-center gap-2">
          <span className="text-blue-700 hidden md:inline-block">Hệ thống quản lý công việc</span>
          <span className="text-blue-700 md:hidden">Task System</span>
        </div>
      </div>
      
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Tìm kiếm..." 
            className="w-full pl-10 bg-gray-50 border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 rounded-lg h-10"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative text-gray-600 hover:bg-blue-50">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-blue-50 p-0">
              <Avatar className="h-9 w-9 border-2 border-blue-100">
                <AvatarImage 
                  src={user?.customSettings?.profileImage} 
                  alt={user?.fullName || "User"} 
                />
                <AvatarFallback className="bg-blue-600 text-white font-medium">
                  {user ? getInitials(user.fullName) : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-3 bg-blue-50 rounded-t-md">
              <p className="text-sm font-medium text-gray-800">{user?.fullName || "Người dùng"}</p>
              <p className="text-xs text-gray-500">{user?.email || ""}</p>
              <p className="text-xs text-blue-600 font-medium mt-1">{user?.status || ""}</p>
            </div>
            <DropdownMenuSeparator />
            <div className="p-1">
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 p-2 rounded-md"
                onClick={() => navigate('/profile')}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Tài khoản cá nhân</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-600 p-2 rounded-md mt-1"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}