// src/layouts/MainLayout.tsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MainHeader } from "./components/MainHeader";
import { MainSidebar } from "./components/MainSidebar";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  
  // UI state variables
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mock user data for UI display
  const mockUser = {
    id: "1",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "Admin",
    avatar: "",
    customSettings: {
      profileImage: "",
      theme: "light",
      language: "vi",
    }
  };

  // Handle responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Set up event listener
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    // Giả lập quá trình đăng xuất
    console.log("Đăng xuất thành công");
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader
        toggleSidebar={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        onLogout={handleLogout}
        user={mockUser}
      />

      <MainSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobile={isMobile}
      />

      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarCollapsed 
            ? isMobile 
              ? "pl-0" 
              : "pl-16" 
            : "pl-60"
        }`}
      >
        <div className="container p-4 md:p-6">

            {children || <Outlet />}

        </div>
      </main>
    </div>
  );
}