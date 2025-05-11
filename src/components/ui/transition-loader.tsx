// components/ui/transition-loader.tsx
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLoading } from "@/hooks/use-loading";

export function TransitionLoader() {
  const { isLoading, progress, setProgress } = useLoading();

  // Simulating progress incrementing while loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading && progress < 90) {
      interval = setInterval(() => {
        const increment = Math.floor(Math.random() * 10) + 1;
        const newProgress = Math.min(progress + increment, 90);
        setProgress(newProgress);
      }, 200);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, progress, setProgress]);

  if (!isLoading && progress === 0) return null;

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-opacity duration-500",
        progress === 100 ? "opacity-0" : "opacity-100"
      )}
    >
      <div 
        className="h-1 bg-primary origin-left"
        style={{ width: `${progress}%`, transition: "width 0.3s ease-in-out" }}
      />
    </div>
  );
}