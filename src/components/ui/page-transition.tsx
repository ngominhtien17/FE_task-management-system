// components/ui/page-transition.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLoading } from "@/hooks/use-loading";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const location = useLocation();
  const { startLoading, stopLoading } = useLoading();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
      startLoading();
      
      // Small delay to match the fade out animation
      setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
        
        // Small delay to ensure the new content is ready
        setTimeout(() => {
          stopLoading();
        }, 300);
      }, 300);
    }
  }, [location, displayLocation, startLoading, stopLoading]);

  return (
    <div
      className={cn(
        className,
        "transition-opacity duration-300 ease-in-out",
        transitionStage === "fadeIn" ? "opacity-100" : "opacity-0"
      )}
    >
      {children}
    </div>
  );
}