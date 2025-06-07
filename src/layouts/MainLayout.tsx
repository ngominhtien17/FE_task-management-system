// src/layouts/MainLayout.tsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { MainHeader } from "./components/MainHeader";
import { MainSidebar } from "./components/MainSidebar";
import { AppBreadcrumb } from "@/common/components/breadcrumb";
import { BreadcrumbProvider } from "@/common/components/breadcrumb";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // UI state variables
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <BreadcrumbProvider>
      <div className="min-h-screen bg-background">
        <MainHeader
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
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
            {/* Thêm thành phần AppBreadcrumb vào đây */}
            <AppBreadcrumb className="mb-4" />
            
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </BreadcrumbProvider>
  );
}