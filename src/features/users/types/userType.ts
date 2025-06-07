// src/features/users/types/userTypes.ts
import type { BaseEntity, LoadingState } from '@/types';

export interface UserEntity extends BaseEntity {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  roles: string[];
}

export interface CreateUserRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UpdateUserRequest {
  fullName?: string;
  username?: string;
  email?: string;
  roles?: string[];
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UserState {
  users: UserEntity[];
  currentUser: UserEntity | null;
  loading: LoadingState;
  error: string | null;
}