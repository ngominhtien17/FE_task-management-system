// src/features/users/pages/UserDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeftIcon, ClockIcon, AlertTriangleIcon } from 'lucide-react';

import { UserStatus, Role } from '../types';
import type { User, Permission } from '../types';
import { mockUsers, mockRoles, mockPermissions, mockDepartments, mockPositions } from '../utils/mockData';

// Schema xác thực form thông tin cá nhân
const userInfoSchema = z.object({
  fullName: z.string().min(3, 'Họ tên phải có ít nhất 3 ký tự'),
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phoneNumber: z.string().optional(),
  departmentId: z.string().min(1, 'Vui lòng chọn đơn vị'),
  positionId: z.string().min(1, 'Vui lòng chọn vị trí'),
  managerId: z.string().optional(),
});

// Schema xác thực form phân quyền
const permissionSchema = z.object({
  roleIds: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một vai trò'),
  permissionIds: z.array(z.string()).optional(),
});

type UserInfoValues = z.infer<typeof userInfoSchema>;
type PermissionValues = z.infer<typeof permissionSchema>;

// Lịch sử hoạt động mẫu
interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  performedBy: string;
  performedAt: string;
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    userId: 'user-02',
    action: 'ROLE_ASSIGNED',
    details: 'Vai trò "Trưởng bộ môn" được gán cho người dùng',
    performedBy: 'Nguyễn Văn A',
    performedAt: '2023-05-12T10:30:00Z'
  },
  {
    id: 'log-2',
    userId: 'user-02',
    action: 'PERMISSION_CHANGED',
    details: 'Thêm quyền "Xem tất cả công việc"',
    performedBy: 'Nguyễn Văn A',
    performedAt: '2023-05-12T10:31:00Z'
  },
  {
    id: 'log-3',
    userId: 'user-02',
    action: 'USER_UPDATED',
    details: 'Cập nhật thông tin người dùng',
    performedBy: 'Trần Thị B',
    performedAt: '2023-05-10T14:15:00Z'
  },
  {
    id: 'log-4',
    userId: 'user-02',
    action: 'USER_LOGIN',
    details: 'Đăng nhập thành công',
    performedBy: 'Trần Thị B',
    performedAt: '2023-05-09T08:30:00Z'
  },
  {
    id: 'log-5',
    userId: 'user-02',
    action: 'PASSWORD_CHANGED',
    details: 'Thay đổi mật khẩu',
    performedBy: 'Trần Thị B',
    performedAt: '2023-05-01T09:45:00Z'
  }
];

// Các hàm tiện ích
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [conflictingPermissions, setConflictingPermissions] = useState<string[]>([]);
  
  // Khởi tạo form thông tin cá nhân
  const userInfoForm = useForm<UserInfoValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      phoneNumber: '',
      departmentId: '',
      positionId: '',
      managerId: '',
    },
  });
  
  // Khởi tạo form phân quyền
  const permissionForm = useForm<PermissionValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      roleIds: [],
      permissionIds: [],
    },
  });
  
  // Tải dữ liệu người dùng khi component được tạo
  useEffect(() => {
    if (id) {
      // Tìm người dùng trong dữ liệu mẫu
      const foundUser = mockUsers.find(user => user.id === id);
      
      if (foundUser) {
        setUser(foundUser);
        
        // Đặt giá trị mặc định cho form thông tin cá nhân
        userInfoForm.reset({
          fullName: foundUser.fullName,
          username: foundUser.username,
          email: foundUser.email,
          phoneNumber: foundUser.phoneNumber || '',
          departmentId: foundUser.department?.id || '',
          positionId: foundUser.position?.id || '',
          managerId: foundUser.manager?.id || '',
        });
        
        // Đặt giá trị mặc định cho form phân quyền
        permissionForm.reset({
          roleIds: foundUser.roles.map(role => role.id),
          permissionIds: foundUser.permissions?.map(perm => perm.id) || [],
        });
        
        // Tải lịch sử hoạt động
        setActivityLogs(mockActivityLogs.filter(log => log.userId === id));
      } else {
        // Không tìm thấy người dùng
        console.error(`Không tìm thấy người dùng với ID: ${id}`);
        navigate('/users');
      }
    }
  }, [id, navigate]);
  
  // Kiểm tra xung đột quyền
  useEffect(() => {
    const selectedRoleIds = permissionForm.watch('roleIds');
    const selectedPermissionIds = permissionForm.watch('permissionIds') || [];
    
    // Lấy các quyền từ vai trò đã chọn
    const rolePermissions: Permission[] = selectedRoleIds.flatMap(roleId => {
      const role = mockRoles.find(role => role.id === roleId);
      return role ? role.permissions : [];
    });
    
    // Danh sách quyền mặc định từ vai trò
    const defaultPermissionIds = rolePermissions.map(perm => perm.id);
    
    // Kiểm tra xung đột
    const conflicts: string[] = [];
    if (selectedRoleIds.includes('role-02')) { // Trưởng bộ môn
      if (selectedPermissionIds.includes('perm-01')) { // Xem tất cả công việc
        conflicts.push(
          'Quyền "Xem tất cả công việc" xung đột với vai trò Trưởng bộ môn (chỉ nên xem công việc trong bộ môn).'
        );
      }
    }
    
    setConflictingPermissions(conflicts);
  }, [permissionForm.watch('roleIds'), permissionForm.watch('permissionIds')]);
  
  // Xử lý lưu thông tin cá nhân
  const onSaveUserInfo = (values: UserInfoValues) => {
    console.log('Lưu thông tin cá nhân:', values);
    
    // TODO: Gọi API cập nhật thông tin người dùng
    
    // Cập nhật thông tin người dùng trong state
    if (user) {
      const updatedUser = {
        ...user,
        fullName: values.fullName,
        username: values.username,
        email: values.email,
        phoneNumber: values.phoneNumber,
        department: mockDepartments.find(dept => dept.id === values.departmentId),
        position: mockPositions.find(pos => pos.id === values.positionId),
        manager: mockUsers.find(u => u.id === values.managerId) || undefined,
      };
      
      setUser(updatedUser);
    }
  };
  
  // Xử lý lưu phân quyền
  const onSavePermissions = (values: PermissionValues) => {
    console.log('Lưu phân quyền:', values);
    
    // TODO: Gọi API cập nhật quyền người dùng
    
    // Cập nhật quyền người dùng trong state
    if (user) {
      const updatedUser = {
        ...user,
        roles: values.roleIds.map(
          roleId => mockRoles.find(role => role.id === roleId)!
        ),
        permissions: values.permissionIds?.map(
          permId => mockPermissions.find(perm => perm.id === permId)!
        ),
      };
      
      setUser(updatedUser);
    }
  };
  
  // Xử lý vô hiệu hóa tài khoản
  const handleDeactivateUser = () => {
    console.log(`Vô hiệu hóa tài khoản: ${user?.fullName} với lý do: ${deactivateReason}`);
    setIsDeactivateDialogOpen(false);
    
    // TODO: Gọi API vô hiệu hóa tài khoản
    
    // Cập nhật trạng thái người dùng trong state
    if (user) {
      const updatedUser = {
        ...user,
        status: UserStatus.INACTIVE,
      };
      
      setUser(updatedUser);
    }
  };
  
  // Nếu không tìm thấy người dùng
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-2">Không tìm thấy người dùng</h2>
          <Button onClick={() => navigate('/users')}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">Trang chủ</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/users">Quản lý người dùng</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Chi tiết: {user.fullName}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Chi tiết người dùng: {user.fullName}</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/users')}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>
      
      {/* Thông tin cơ bản */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user.fullName}</h2>
              <p className="text-gray-600">
                {user.email} | {user.phoneNumber || 'Chưa cập nhật số điện thoại'}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-gray-600 mr-2">{user.department?.name || 'Chưa phân bộ môn'}</span>
                <span className="mx-2">|</span>
                <Badge 
                  variant={user.status === UserStatus.ACTIVE ? 'default' : 'destructive'}
                  className={user.status === UserStatus.ACTIVE ? 'bg-green-500' : ''}
                >
                  {user.status === UserStatus.ACTIVE ? 'Đang hoạt động' : 'Không hoạt động'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="permissions">Phân quyền</TabsTrigger>
          <TabsTrigger value="activity">Lịch sử hoạt động</TabsTrigger>
        </TabsList>
        
        {/* Tab Thông tin cá nhân */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...userInfoForm}>
                <form onSubmit={userInfoForm.handleSubmit(onSaveUserInfo)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={userInfoForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên<span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userInfoForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên đăng nhập<span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userInfoForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userInfoForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userInfoForm.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Đơn vị<span className="text-red-500">*</span></FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn đơn vị..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockDepartments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userInfoForm.control}
                      name="positionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vị trí<span className="text-red-500">*</span></FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn vị trí..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockPositions.map((position) => (
                                <SelectItem key={position.id} value={position.id}>
                                  {position.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userInfoForm.control}
                      name="managerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quản lý trực tiếp</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn người quản lý..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockUsers
                                .filter(u => u.id !== user.id) // Loại bỏ người dùng hiện tại
                                .map((u) => (
                                  <SelectItem key={u.id} value={u.id}>
                                    {u.fullName} - {u.position?.name || ''}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => userInfoForm.reset()}
                    >
                      Hủy
                    </Button>
                    <Button type="submit">
                      Lưu thay đổi
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab Phân quyền */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý vai trò</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...permissionForm}>
                <form onSubmit={permissionForm.handleSubmit(onSavePermissions)}>
                  <FormField
                    control={permissionForm.control}
                    name="roleIds"
                    render={() => (
                      <FormItem>
                        <div className="space-y-4">
                          {mockRoles.map((role) => (
                            <div key={role.id} className="space-y-2">
                              <div className="flex items-start space-x-2">
                                <Checkbox
                                  id={`role-${role.id}`}
                                  checked={permissionForm.watch('roleIds').includes(role.id)}
                                  onCheckedChange={(checked) => {
                                    const roleIds = permissionForm.watch('roleIds');
                                    if (checked) {
                                      permissionForm.setValue('roleIds', [...roleIds, role.id]);
                                    } else {
                                      permissionForm.setValue('roleIds', roleIds.filter(id => id !== role.id));
                                    }
                                  }}
                                />
                                <div className="space-y-1 leading-none">
                                  <div className="flex items-center">
                                    <label
                                      htmlFor={`role-${role.id}`}
                                      className="font-medium cursor-pointer"
                                    >
                                      {role.name}
                                    </label>
                                    <ClockIcon className="h-4 w-4 ml-2 text-gray-400" />
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {role.description}
                                  </p>
                                </div>
                              </div>
                              
                              {permissionForm.watch('roleIds').includes(role.id) && (
                                <div className="pl-6 pt-2">
                                  <div className="text-sm text-gray-600">
                                    {role.permissions.slice(0, 4).map((perm, idx) => (
                                      <div key={idx} className="flex items-center">
                                        <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                          <span className="text-green-600">✓</span>
                                        </div>
                                        <span>{perm.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-8">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle>Quyền hạn đặc biệt</CardTitle>
                    </CardHeader>
                    
                    <FormField
                      control={permissionForm.control}
                      name="permissionIds"
                      render={() => (
                        <FormItem>
                          <div className="space-y-4">
                            {/* Nhóm quyền theo group */}
                            {['TASK', 'USER', 'GROUP', 'ORGANIZATION', 'RESOURCE', 'SETTINGS'].map((group, groupIdx) => {
                              const groupPermissions = mockPermissions.filter(p => p.group === group);
                              if (groupPermissions.length === 0) return null;
                              
                              const groupName = (() => {
                                switch (group) {
                                  case 'TASK': return 'Quản lý công việc';
                                  case 'USER': return 'Quản lý người dùng';
                                  case 'GROUP': return 'Quản lý nhóm';
                                  case 'ORGANIZATION': return 'Quản lý tổ chức';
                                  case 'RESOURCE': return 'Quản lý tài nguyên';
                                  case 'SETTINGS': return 'Quản lý cấu hình';
                                  default: return group;
                                }
                              })();
                              
                              const isExpanded = group === 'TASK'; // Mặc định mở rộng nhóm đầu tiên
                              
                              return (
                                <div key={groupIdx} className="border rounded-md">
                                  <div className="p-3 font-medium">
                                    {isExpanded ? '▾' : '▸'} {groupName}
                                  </div>
                                  
                                  {isExpanded && (
                                    <div className="px-3 pb-3 space-y-2">
                                      {groupPermissions.map((permission) => (
                                        <div key={permission.id} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`permission-${permission.id}`}
                                            checked={permissionForm.watch('permissionIds')?.includes(permission.id) || false}
                                            onCheckedChange={(checked) => {
                                              const permissionIds = permissionForm.watch('permissionIds') || [];
                                              if (checked) {
                                                permissionForm.setValue('permissionIds', [...permissionIds, permission.id]);
                                              } else {
                                                permissionForm.setValue('permissionIds', permissionIds.filter(id => id !== permission.id));
                                              }
                                            }}
                                          />
                                          <label
                                            htmlFor={`permission-${permission.id}`}
                                            className="cursor-pointer text-sm"
                                          >
                                            {permission.name}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                          {conflictingPermissions.length > 0 && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                              {conflictingPermissions.map((conflict, idx) => (
                                <div key={idx} className="flex items-start">
                                  <AlertTriangleIcon className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                                  <span className="text-amber-800 text-sm">{conflict}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => permissionForm.reset()}
                    >
                      Hủy
                    </Button>
                    <Button type="submit">
                      Lưu thay đổi
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab Lịch sử hoạt động */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              {activityLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có hoạt động nào được ghi nhận
                </div>
              ) : (
                <div className="space-y-4">
                  {activityLogs.map((log, index) => (
                    <div key={log.id} className="pb-4">
                      <div className="flex items-start">
                        <div className="mr-3 bg-gray-100 p-2 rounded-full">
                          <ClockIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                {(() => {
                                  switch (log.action) {
                                    case 'ROLE_ASSIGNED': return 'Gán vai trò';
                                    case 'PERMISSION_CHANGED': return 'Thay đổi quyền';
                                    case 'USER_UPDATED': return 'Cập nhật thông tin';
                                    case 'USER_LOGIN': return 'Đăng nhập';
                                    case 'PASSWORD_CHANGED': return 'Thay đổi mật khẩu';
                                    default: return log.action;
                                  }
                                })()}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(log.performedAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Thực hiện bởi: {log.performedBy}
                          </p>
                        </div>
                      </div>
                      {index < activityLogs.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Nút thao tác */}
      <div className="flex justify-end space-x-4 mt-6">
        {user.status === UserStatus.ACTIVE ? (
          <Button 
            variant="destructive" 
            onClick={() => setIsDeactivateDialogOpen(true)}
          >
            Vô hiệu hóa tài khoản
          </Button>
        ) : (
          <Button 
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            Kích hoạt tài khoản
          </Button>
        )}
        
        <Button 
          variant="outline"
          onClick={() => {
            // Hiển thị hộp thoại đổi mật khẩu
            console.log('Đổi mật khẩu cho người dùng:', user.fullName);
          }}
        >
          Đổi mật khẩu
        </Button>
      </div>
      
      {/* Modal vô hiệu hóa tài khoản */}
      <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vô hiệu hóa tài khoản</DialogTitle>
            <DialogDescription>
              Bạn đang vô hiệu hóa tài khoản:
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="font-medium">{user.fullName} ({user.email})</p>
            <p>{user.department?.name}</p>
            
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Lý do vô hiệu hóa<span className="text-red-500">*</span>
              </label>
              <textarea 
                className="w-full min-h-24 p-2 border rounded-md"
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
              />
            </div>
            
            <div className="mt-2 flex items-start">
              <div className="text-amber-600 text-sm">
                <p>⚠️ Lưu ý: Tài khoản sẽ không thể đăng nhập sau khi bị vô hiệu hóa.</p>
                <p>Tất cả phiên làm việc hiện tại sẽ bị chấm dứt.</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeactivateDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeactivateUser}
              disabled={!deactivateReason.trim()}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetailPage;