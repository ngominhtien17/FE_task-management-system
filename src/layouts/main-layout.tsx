// layouts/main-layout.tsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { MainHeader } from "./main-header";
import { MainSidebar } from "./main-sidebar";
import { cn } from "@/lib/utils";

export interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    
    // Set initial state
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
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
        className={cn(
          "pt-16 min-h-[calc(100vh-64px)] bg-muted/20 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "ml-16" : "ml-60"
        )}
      >
        <div className="container p-6">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}