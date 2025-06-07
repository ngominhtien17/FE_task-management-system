// FILE 4: src/common/services/mockApi.ts
// ================================================================================
import type { LoginRequest, LoginResponse } from '@/features/auth/types';

const MOCK_DELAY = 800;

const mockUsers = [
  {
    _id: "6658b1234567890123456789",
    userId: "admin-001",
    username: "admin",
    fullName: "Quản trị viên hệ thống",
    email: "admin@tdtu.edu.vn",
    status: "ACTIVE" as const,
    customSettings: {
      profileImage: "",
      theme: "light",
      language: "vi",
    }
  },
  {
    _id: "6658b1234567890123456790",
    userId: "lecturer-001", 
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@tdtu.edu.vn",
    status: "ACTIVE" as const,
  }
];

const mockCredentials = [
  { username: "admin", password: "admin123" },
  { username: "nguyenvana", password: "password123" },
  { username: "demo", password: "demo123" }
];

export const mockAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    const validCredential = mockCredentials.find(
      cred => cred.username === credentials.username && cred.password === credentials.password
    );
    
    if (!validCredential) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }
    
    const user = mockUsers.find(u => u.username === credentials.username);
    
    if (!user) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }
    
    const roles = user.username === 'admin' ? ['ADMIN'] : ['LECTURER', 'USER'];
    
    return {
      message: "Đăng nhập thành công",
      user,
      roles,
      accessToken: `mock_token_${Date.now()}_${user.userId}`
    };
  },

  logout: async (): Promise<{ message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { message: "Đăng xuất thành công" };
  },

  checkAuth: async (): Promise<{ user: LoginResponse['user']; roles: string[] }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const token = localStorage.getItem('accessToken');
    console.log('🔍 mockAPI.checkAuth: Checking token:', token ? 'Present' : 'Missing');
    
    if (!token || !token.startsWith('mock_token_')) {
      throw new Error('Token không hợp lệ hoặc đã hết hạn');
    }
    
    try {
      // Extract userId from mock token: mock_token_timestamp_userId
      const parts = token.split('_');
      const userId = parts[3];
      const user = mockUsers.find(u => u.userId === userId);
      
      if (!user) {
        throw new Error('Không tìm thấy người dùng');
      }
      
      const roles = user.username === 'admin' ? ['ADMIN'] : ['LECTURER', 'USER'];
      
      console.log('✅ mockAPI.checkAuth: User found:', user.fullName);
      return { user, roles };
    } catch (error) {
      console.error('🔴 mockAPI.checkAuth: Error parsing token:', error);
      throw new Error('Token không hợp lệ');
    }
  }
};
