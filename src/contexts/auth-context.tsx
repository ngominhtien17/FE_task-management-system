import React, { createContext, useContext, useState, useEffect } from "react";

// Định nghĩa kiểu dữ liệu cho user
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Định nghĩa kiểu dữ liệu cho AuthContext
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

// Tạo context với giá trị mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook để sử dụng context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra xem người dùng đã đăng nhập chưa khi component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        // Kiểm tra localStorage hoặc sessionStorage xem có token không
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        
        if (token) {
          // Trong môi trường thực, bạn sẽ gọi API để xác thực token
          // và lấy thông tin người dùng
          
          // Mô phỏng fetch user data
          const userData: User = {
            id: "1",
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            role: "Admin",
          };
          
          setUser(userData);
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setUser(null);
        // Xóa token nếu có lỗi
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Hàm đăng nhập
  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Trong môi trường thực, bạn sẽ gọi API đăng nhập ở đây
      // Mô phỏng API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mô phỏng xác thực thành công
      if (email === "demo@example.com" && password === "password") {
        const token = "mock_jwt_token";
        
        // Lưu token vào localStorage hoặc sessionStorage tùy thuộc vào rememberMe
        if (rememberMe) {
          localStorage.setItem('auth_token', token);
        } else {
          sessionStorage.setItem('auth_token', token);
        }
        
        // Mô phỏng fetch user data
        const userData: User = {
          id: "1",
          name: "Nguyễn Văn A",
          email: email,
          role: "Admin",
        };
        
        setUser(userData);
      } else {
        throw new Error("Email hoặc mật khẩu không chính xác");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi đăng nhập");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Trong môi trường thực, bạn có thể gọi API để invalidate token
      
      // Xóa token
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      
      // Reset state
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Tính toán isAuthenticated
  const isAuthenticated = !!user;

  // Giá trị context
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}