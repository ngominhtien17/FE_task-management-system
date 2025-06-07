import type { LoadingState } from "@/types";

// src/features/auth/types/authTypes.ts
export interface User {
    _id: string;
    userId: string;
    username: string;
    fullName: string;
    email: string;
    status: 'ACTIVE' | 'INACTIVE';
    customSettings?: {
      profileImage?: string;
      theme?: string;
      language?: string;
    };
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    message: string;
    user: User;
    roles: string[];
    accessToken: string;
  }
  
  export interface AuthState {
    user: User | null;
    roles: string[];
    isAuthenticated: boolean;
    loading: LoadingState;
    error: string | null;
  }
  
  export interface RefreshTokenResponse {
    accessToken: string;
  }