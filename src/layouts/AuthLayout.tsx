// src/layouts/auth-layout.tsx
import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/common/utils/utils";
import { LottieAnimation } from "@/common/components/ui/LottieAnimation";
import animationData from "../assets/animations/login-animation.json";
import WavesParticlesBackground from "../common/components/ui/wavesParticlesBackground"

type AuthLayoutProps = {
  className?: string;
  primaryColor?: string;
};

export function AuthLayout({
  className,
  primaryColor = "#ffffff",
}: AuthLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-100 relative overflow-hidden" ref={containerRef}>
      {/* Background wave */}
      <div className="absolute bottom-0 w-full h-1/3 bg-indigo-400/20 rounded-t-[50%]">
        <div className="absolute inset-0 -z-10">
          <WavesParticlesBackground primaryColor={primaryColor} />
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-blue-100 w-2 h-2 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            }}
          />
        ))}
      </div>
      
      {/* Login Card */}
      <div className="w-full max-w-5xl mx-4 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row z-10">
        {/* Left Side - Animation */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <LottieAnimation 
              animationData={animationData} 
              className="w-full"
            />
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className={cn(
          "w-full md:w-1/2 p-6 sm:p-10 flex items-center justify-center",
          className
        )}>
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}