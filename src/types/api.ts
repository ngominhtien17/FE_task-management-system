// src/types/api.ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
  
export interface ApiError {
  error: string;
  statusCode?: number;
}