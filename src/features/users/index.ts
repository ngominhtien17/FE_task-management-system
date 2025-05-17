
// src/features/users/index.ts
// Export các hàm tiện ích và các thành phần chính của module người dùng
import { UserStatus, PasswordStrength } from './types';
import type { User,  Role, Permission, Department, Position }from './types';
import { mockUsers, mockRoles, mockPermissions, mockDepartments, mockPositions, searchUsers } from './utils/mockData';

// Export từ thành phần
export { 
  UserStatusBadge, 
  UserAvatar, 
  DeactivateUserDialog,
  UserRoleSelector,
  UserPermissionSelector
} from './components';

// Export từ trang
export { default as UserListPage } from './pages/UserListPage';
export { default as UserCreatePage } from './pages/UserCreatePage';
export { default as UserDetailPage } from './pages/UserDetailPage';
export { default as BatchPermissionPage } from './pages/BatchPermissionPage';
export { default as UserImportPage } from './pages/UserImportPage';

// Export từ kiểu dữ liệu
export type { User, Role, Permission, Department, Position };
export { UserStatus, PasswordStrength };

// Export hàm tiện ích
export { searchUsers };
export const getRoles = () => mockRoles;
export const getPermissions = () => mockPermissions;
export const getUsers = () => mockUsers;
export const getDepartments = () => mockDepartments;
export const getPositions = () => mockPositions;