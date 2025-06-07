// src/features/auth/pages/LoginPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, LockIcon, AlertCircle, User } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Checkbox } from "@/common/components/ui/checkbox";
import { useAuth } from "../hooks";
import type { LoginRequest } from "../types";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated, clearError } = useAuth();
  
  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginRequest & { rememberMe: boolean }>({
    username: "",
    password: "",
    rememberMe: false,
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when form data changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, clearError, error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }

    try {
      const result = await login({
        username: formData.username.trim(),
        password: formData.password,
      });
      
      if (result.meta.requestStatus === 'fulfilled') {
        // Login successful, navigation will be handled by useEffect
        console.log('Login successful');
      }
    } catch (err) {
      // Error is handled by Redux state
      console.error('Login failed:', err);
    }
  };

  const isLoading = loading === 'pending';

  return (
    <div className="flex flex-col items-center w-full">
      {/* Logo */}
      <div className="w-20 h-20 rounded-lg flex items-center justify-center mb-6">
        <div className="w-full h-full flex items-center justify-center">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="56" height="56" rx="8" fill="#2047b8" fillOpacity="0.1"/>
            <path d="M28 16C21.373 16 16 21.373 16 28C16 34.627 21.373 40 28 40C34.627 40 40 34.627 40 28C40 21.373 34.627 16 28 16Z" stroke="#2047b8" strokeWidth="2"/>
            <path d="M28 22C25.791 22 24 23.791 24 26C24 28.209 25.791 30 28 30C30.209 30 32 28.209 32 26C32 23.791 30.209 22 28 22Z" fill="#2047b8"/>
            <path d="M20 38C20 34.686 23.582 32 28 32C32.418 32 36 34.686 36 38" stroke="#2047b8" strokeWidth="2"/>
          </svg>
        </div>
      </div>
      
      {/* Heading */}
      <div className="text-center space-y-1 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          QUẢN LÝ CÔNG VIỆC
        </h1>
        <h2 className="text-base font-medium text-gray-600">
          Khoa Công nghệ thông tin
        </h2>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        {/* Username field */}
        <div className="space-y-1.5">
          <Label 
            htmlFor="username" 
            className="text-sm font-medium text-gray-700"
          >
            Tên đăng nhập
          </Label>
          <div className="relative">
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              className="h-12 pl-10 pr-4 text-[15px] border-gray-200 rounded-lg bg-gray-50 focus:bg-white"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            <User 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              size={18} 
            />
          </div>
        </div>
        
        {/* Password field */}
        <div className="space-y-1.5">
          <Label 
            htmlFor="password" 
            className="text-sm font-medium text-gray-700"
          >
            Mật khẩu
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="h-12 pl-10 pr-10 text-[15px] border-gray-200 rounded-lg bg-gray-50 focus:bg-white"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            <LockIcon 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              size={18} 
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors disabled:cursor-not-allowed"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        {/* Remember me and Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe}
              onCheckedChange={handleCheckboxChange}
              className="h-4 w-4 rounded data-[state=checked]:bg-blue-600 border-gray-300"
              disabled={isLoading}
            />
            <Label 
              htmlFor="rememberMe" 
              className="text-sm text-gray-600 cursor-pointer"
            >
              Ghi nhớ đăng nhập
            </Label>
          </div>
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => navigate("/auth/forgot-password")}
            disabled={isLoading}
          >
            Quên mật khẩu?
          </button>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded border-l-3 border-red-500 text-sm">
            <AlertCircle size={16} />
            <p className="font-normal">{error}</p>
          </div>
        )}
        
        {/* Login button */}
        <Button 
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !formData.username.trim() || !formData.password.trim()}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "ĐĂNG NHẬP"
          )}
        </Button>
        
        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-sm text-gray-400 font-medium">hoặc</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        
        {/* SSO Login */}
        <Button 
          type="button"
          variant="outline"
          className="w-full h-12 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <KeyRound size={18} className="text-blue-600" />
          Đăng nhập SSO
        </Button>
        
        {/* Security indicator */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-2">
          <LockIcon size={12} />
          <span>Kết nối bảo mật SSL</span>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;