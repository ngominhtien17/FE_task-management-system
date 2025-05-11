// layouts/layout-transition.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthLayout } from "./auth-layout";
import { MainLayout } from "./MainLayout";
import { PageTransition } from "@/components/ui/page-transition";
import { useLoading } from "@/hooks/use-loading";

interface LayoutTransitionProps {
  children: React.ReactNode;
}

export function LayoutTransition({ children }: LayoutTransitionProps) {
  const location = useLocation();
  const [currentLayout, setCurrentLayout] = useState<"auth" | "main">("main");
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    // Determine layout based on path
    if (location.pathname.startsWith("/auth")) {
      if (currentLayout !== "auth") {
        startLoading();
        setCurrentLayout("auth");
        setTimeout(stopLoading, 600);
      }
    } else {
      if (currentLayout !== "main") {
        startLoading();
        setCurrentLayout("main");
        setTimeout(stopLoading, 600);
      }
    }
  }, [location.pathname, currentLayout, startLoading, stopLoading]);

  // Render appropriate layout based on current path
  return (
    <PageTransition>
      {currentLayout === "auth" ? (
        <AuthLayout>{children}</AuthLayout>
      ) : (
        <MainLayout>{children}</MainLayout>
      )}
    </PageTransition>
  );
}