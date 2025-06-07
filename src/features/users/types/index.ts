// src/features/users/types/index.ts

export type Department = {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentId?: string;
};

export type Position = {
  id: string;
  name: string;
  code: string;
  description?: string;
  departmentId?: string;
};

/**
 * Vai trò trong hệ thống
 */
export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
};

/**
 * Quyền hạn trong hệ thống
 */
export type Permission = {
  id: string;
  name: string;
  code: string;
  description: string;
  group: string;
};

/**
 * Trạng thái người dùng
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  LOCKED = 'LOCKED'
}

/**
 * Mức độ mạnh của mật khẩu
 */
export enum PasswordStrength {
  WEAK = 'WEAK',
  MEDIUM = 'MEDIUM',
  STRONG = 'STRONG'
}

/**
 * Thông tin người dùng
 */
export type User = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  department?: Department;
  position?: Position;
  roles: Role[];
  permissions?: Permission[];
  manager?: User;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Thông tin tạo người dùng mới
 */
export type CreateUserDto = {
  fullName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  password: string;
  departmentId: string;
  positionId: string;
  managerId?: string;
  roleIds: string[];
  permissionIds?: string[];
};

/**
 * Thông tin cập nhật người dùng
 */
export type UpdateUserDto = Partial<Omit<CreateUserDto, 'password'>>;

/**
 * Tham số tìm kiếm người dùng
 */
export type UserSearchParams = {
  keyword?: string;
  departmentId?: string;
  roles?: string[];
  status?: UserStatus;
  createdAtFrom?: string;
  createdAtTo?: string;
  page?: number;
  pageSize?: number;
};

/**
 * Kết quả phân trang
 */
export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Lý do vô hiệu hóa tài khoản
 */
export type DeactivationReason = {
  userId: string;
  reason: string;
  deactivatedBy: string;
  deactivatedAt: string;
};

export type { UserEntity, CreateUserRequest, UpdateUserRequest, UserState } from './userType';