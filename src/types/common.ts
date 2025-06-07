// src/types/common.ts
export interface BaseEntity {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  export interface PaginationResponse<T> {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
  
  export type LoadingState = 'idle' | 'pending' | 'succeeded' | 'failed';