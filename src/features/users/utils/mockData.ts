// src/features/users/utils/mockData.ts
import type { User, Role, Permission } from '../types';
import { UserStatus } from '../types';
import type { Department, Position } from '../types/department';

// Dữ liệu mô phỏng cho các đơn vị
export const mockDepartments: Department[] = [
  { id: 'dept-01', name: 'Phòng Đào tạo', code: 'PDT', description: 'Quản lý công tác đào tạo' },
  { id: 'dept-02', name: 'Bộ môn Công nghệ phần mềm', code: 'CNPM', description: 'Bộ môn Công nghệ phần mềm', parentId: 'dept-05' },
  { id: 'dept-03', name: 'Bộ môn Kỹ thuật phần mềm', code: 'KTPM', description: 'Bộ môn Kỹ thuật phần mềm', parentId: 'dept-05' },
  { id: 'dept-04', name: 'Bộ môn Hệ thống thông tin', code: 'HTTT', description: 'Bộ môn Hệ thống thông tin', parentId: 'dept-05' },
  { id: 'dept-05', name: 'Khoa Công nghệ thông tin', code: 'CNTT', description: 'Khoa Công nghệ thông tin' },
  { id: 'dept-06', name: 'Bộ môn Mạng máy tính', code: 'MMT', description: 'Bộ môn Mạng máy tính', parentId: 'dept-05' },
];

// Dữ liệu mô phỏng cho các vị trí
export const mockPositions: Position[] = [
  { id: 'pos-01', name: 'Trưởng phòng', code: 'TP', departmentId: 'dept-01' },
  { id: 'pos-02', name: 'Trưởng khoa', code: 'TK', departmentId: 'dept-05' },
  { id: 'pos-03', name: 'Trưởng bộ môn', code: 'TBM', departmentId: 'dept-02' },
  { id: 'pos-04', name: 'Giảng viên', code: 'GV' },
  { id: 'pos-05', name: 'Chuyên viên', code: 'CV' },
  { id: 'pos-06', name: 'Trưởng nhóm dự án', code: 'TNDA' },
];

// Dữ liệu mô phỏng cho các quyền hạn
export const mockPermissions: Permission[] = [
  { id: 'perm-01', name: 'Xem tất cả công việc', code: 'VIEW_ALL_TASKS', description: 'Xem tất cả công việc trong hệ thống', group: 'TASK' },
  { id: 'perm-02', name: 'Tạo công việc mới', code: 'CREATE_TASK', description: 'Tạo công việc mới', group: 'TASK' },
  { id: 'perm-03', name: 'Phân công công việc', code: 'ASSIGN_TASK', description: 'Phân công công việc cho người khác', group: 'TASK' },
  { id: 'perm-04', name: 'Phê duyệt công việc', code: 'APPROVE_TASK', description: 'Phê duyệt công việc', group: 'TASK' },
  { id: 'perm-05', name: 'Xóa công việc', code: 'DELETE_TASK', description: 'Xóa công việc', group: 'TASK' },
  { id: 'perm-06', name: 'Quản lý người dùng', code: 'MANAGE_USERS', description: 'Quản lý người dùng trong hệ thống', group: 'USER' },
  { id: 'perm-07', name: 'Quản lý đơn vị', code: 'MANAGE_DEPARTMENTS', description: 'Quản lý đơn vị trong hệ thống', group: 'ORGANIZATION' },
  { id: 'perm-08', name: 'Quản lý nhóm', code: 'MANAGE_GROUPS', description: 'Quản lý nhóm làm việc', group: 'GROUP' },
  { id: 'perm-09', name: 'Quản lý tài nguyên', code: 'MANAGE_RESOURCES', description: 'Quản lý tài nguyên trong hệ thống', group: 'RESOURCE' },
  { id: 'perm-10', name: 'Quản lý cấu hình', code: 'MANAGE_SETTINGS', description: 'Quản lý cấu hình hệ thống', group: 'SETTINGS' },
];

// Dữ liệu mô phỏng cho các vai trò
export const mockRoles: Role[] = [
  { 
    id: 'role-01', 
    name: 'Ban lãnh đạo khoa', 
    description: 'Quyền quản lý và giám sát toàn bộ hoạt động của khoa', 
    permissions: mockPermissions, 
    isSystem: true 
  },
  { 
    id: 'role-02', 
    name: 'Trưởng bộ môn', 
    description: 'Quyền quản lý nhân sự và công việc trong phạm vi bộ môn', 
    permissions: mockPermissions.filter(p => ['perm-01', 'perm-02', 'perm-03', 'perm-04', 'perm-06'].includes(p.id)),
    isSystem: true 
  },
  { 
    id: 'role-03', 
    name: 'Giảng viên', 
    description: 'Quyền tiếp nhận và thực hiện công việc được giao', 
    permissions: mockPermissions.filter(p => ['perm-01', 'perm-02'].includes(p.id)),
    isSystem: true 
  },
  { 
    id: 'role-04', 
    name: 'Cán bộ', 
    description: 'Quyền tiếp nhận và thực hiện công việc hành chính', 
    permissions: mockPermissions.filter(p => ['perm-01', 'perm-02'].includes(p.id)),
    isSystem: true 
  },
  { 
    id: 'role-05', 
    name: 'Trưởng nhóm dự án', 
    description: 'Quyền quản lý dự án và các thành viên tham gia', 
    permissions: mockPermissions.filter(p => ['perm-01', 'perm-02', 'perm-03', 'perm-04'].includes(p.id)),
    isSystem: true 
  },
];

// Tạo dữ liệu người dùng mẫu
export const mockUsers: User[] = [
  {
    id: 'user-01',
    fullName: 'Nguyễn Văn A',
    username: 'nguyenva',
    email: 'nva@abc.com',
    phoneNumber: '0901234567',
    department: mockDepartments.find(d => d.code === 'PDT'),
    position: mockPositions.find(p => p.code === 'TP'),
    roles: [mockRoles.find(r => r.name === 'Ban lãnh đạo khoa')!],
    status: UserStatus.ACTIVE,
    createdAt: '2023-01-01T08:00:00Z',
    updatedAt: '2023-01-01T08:00:00Z',
  },
  {
    id: 'user-02',
    fullName: 'Trần Thị B',
    username: 'tranthib',
    email: 'ttb@abc.com',
    phoneNumber: '0912345678',
    department: mockDepartments.find(d => d.code === 'KTPM'),
    position: mockPositions.find(p => p.code === 'TBM'),
    roles: [mockRoles.find(r => r.name === 'Trưởng bộ môn')!],
    status: UserStatus.ACTIVE,
    createdAt: '2023-01-02T09:00:00Z',
    updatedAt: '2023-01-02T09:00:00Z',
  },
  {
    id: 'user-03',
    fullName: 'Lê Văn C',
    username: 'levanc',
    email: 'lvc@abc.com',
    phoneNumber: '0923456789',
    department: mockDepartments.find(d => d.code === 'CNPM'),
    position: mockPositions.find(p => p.code === 'GV'),
    roles: [mockRoles.find(r => r.name === 'Giảng viên')!],
    status: UserStatus.ACTIVE,
    createdAt: '2023-01-03T10:00:00Z',
    updatedAt: '2023-01-03T10:00:00Z',
  },
  {
    id: 'user-04',
    fullName: 'Phạm Thị D',
    username: 'phamthid',
    email: 'ptd@abc.com',
    phoneNumber: '0934567890',
    department: mockDepartments.find(d => d.code === 'HTTT'),
    position: mockPositions.find(p => p.code === 'GV'),
    roles: [mockRoles.find(r => r.name === 'Giảng viên')!],
    status: UserStatus.ACTIVE,
    createdAt: '2023-01-04T11:00:00Z',
    updatedAt: '2023-01-04T11:00:00Z',
  },
  {
    id: 'user-05',
    fullName: 'Vũ Minh E',
    username: 'vuminhe',
    email: 'vme@abc.com',
    phoneNumber: '0945678901',
    department: mockDepartments.find(d => d.code === 'MMT'),
    position: mockPositions.find(p => p.code === 'GV'),
    roles: [mockRoles.find(r => r.name === 'Giảng viên')!],
    status: UserStatus.ACTIVE,
    createdAt: '2023-01-05T12:00:00Z',
    updatedAt: '2023-01-05T12:00:00Z',
  },
  {
    id: 'user-06',
    fullName: 'Hoàng Văn F',
    username: 'hoangvanf',
    email: 'hvf@abc.com',
    phoneNumber: '0956789012',
    department: mockDepartments.find(d => d.code === 'PDT'),
    position: mockPositions.find(p => p.code === 'CV'),
    roles: [mockRoles.find(r => r.name === 'Cán bộ')!],
    status: UserStatus.INACTIVE,
    createdAt: '2023-01-06T13:00:00Z',
    updatedAt: '2023-01-06T13:00:00Z',
  },
  {
    id: 'user-07',
    fullName: 'Dương Thị G',
    username: 'duongthig',
    email: 'dtg@abc.com',
    phoneNumber: '0967890123',
    department: mockDepartments.find(d => d.code === 'CNPM'),
    position: mockPositions.find(p => p.code === 'TNDA'),
    roles: [mockRoles.find(r => r.name === 'Trưởng nhóm dự án')!],
    status: UserStatus.PENDING,
    createdAt: '2023-01-07T14:00:00Z',
    updatedAt: '2023-01-07T14:00:00Z',
  },
  {
    id: 'user-08',
    fullName: 'Phan Văn H',
    username: 'phanvanh',
    email: 'pvh@abc.com',
    phoneNumber: '0978901234',
    department: mockDepartments.find(d => d.code === 'KTPM'),
    position: mockPositions.find(p => p.code === 'GV'),
    roles: [mockRoles.find(r => r.name === 'Giảng viên')!],
    status: UserStatus.LOCKED,
    createdAt: '2023-01-08T15:00:00Z',
    updatedAt: '2023-01-08T15:00:00Z',
  },
];

// Hàm mô phỏng tìm kiếm người dùng theo tham số
export const searchUsers = (params: any = {}): { data: User[], total: number, page: number, pageSize: number, totalPages: number } => {
  const { 
    keyword = '', 
    departmentId, 
    roles = [], 
    status,
    page = 1, 
    pageSize = 10 
  } = params;

  // Lọc người dùng theo các tham số
  let filteredUsers = [...mockUsers];
  
  // Tìm kiếm theo từ khóa
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.fullName.toLowerCase().includes(lowerKeyword) ||
      user.username.toLowerCase().includes(lowerKeyword) ||
      user.email.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // Lọc theo phòng ban
  if (departmentId) {
    filteredUsers = filteredUsers.filter(user => user.department?.id === departmentId);
  }
  
  // Lọc theo vai trò
  if (roles.length > 0) {
    filteredUsers = filteredUsers.filter(user => 
      user.roles.some(role => roles.includes(role.id))
    );
  }
  
  // Lọc theo trạng thái
  if (status) {
    filteredUsers = filteredUsers.filter(user => user.status === status);
  }
  
  // Tính toán phân trang
  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  return {
    data: paginatedUsers,
    total,
    page,
    pageSize,
    totalPages
  };
};