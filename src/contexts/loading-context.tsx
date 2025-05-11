// contexts/loading-context.tsx
import React, { createContext, useState, useCallback } from "react";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  setProgress: (progress: number) => void;
  progress: number;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setProgress(0);
  }, []);

  const stopLoading = useCallback(() => {
    setProgress(100);
    // Delay turning off loading state to allow animation to complete
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 500);
  }, []);

  const value: LoadingContextType = {
    isLoading,
    startLoading,
    stopLoading,
    progress,
    setProgress,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}