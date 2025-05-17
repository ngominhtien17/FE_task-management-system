// src/features/users/pages/UserCreatePage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RefreshCwIcon, ArrowLeftIcon } from 'lucide-react';
import { mockDepartments, mockPositions, mockRoles, mockUsers,mockPermissions } from '../utils/mockData';
import { PasswordStrength } from '../types';

// Schema xác thực form
const userFormSchema = z.object({
  fullName: z.string().min(3, 'Họ tên phải có ít nhất 3 ký tự'),
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .refine(val => /^[a-zA-Z0-9_]+$/.test(val), 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
  email: z.string().email('Email không hợp lệ'),
  phoneNumber: z.string().optional(),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  departmentId: z.string().min(1, 'Vui lòng chọn đơn vị'),
  positionId: z.string().min(1, 'Vui lòng chọn vị trí'),
  managerId: z.string().optional(),
  roleIds: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một vai trò'),
  permissionIds: z.array(z.string()).optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(PasswordStrength.WEAK);
  const [availableManagers, setAvailableManagers] = useState(mockUsers);
  
  // Khởi tạo form với React Hook Form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      departmentId: '',
      positionId: '',
      managerId: '',
      roleIds: [],
      permissionIds: [],
    },
  });
  
  // Xử lý khi chọn đơn vị để lọc danh sách quản lý
  useEffect(() => {
    const selectedDepartmentId = form.watch('departmentId');
    if (selectedDepartmentId) {
      // Lọc danh sách quản lý theo đơn vị được chọn
      const filteredManagers = mockUsers.filter(
        user => user.department?.id === selectedDepartmentId
      );
      setAvailableManagers(filteredManagers);
    } else {
      setAvailableManagers(mockUsers);
    }
  }, [form.watch('departmentId')]);
  
  // Đánh giá độ mạnh của mật khẩu
  const evaluatePasswordStrength = (password: string): PasswordStrength => {
    if (!password || password.length < 8) return PasswordStrength.WEAK;
    
    let score = 0;
    
    // Kiểm tra độ dài
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Kiểm tra chữ thường
    if (/[a-z]/.test(password)) score += 1;
    
    // Kiểm tra chữ hoa
    if (/[A-Z]/.test(password)) score += 1;
    
    // Kiểm tra số
    if (/[0-9]/.test(password)) score += 1;
    
    // Kiểm tra ký tự đặc biệt
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    if (score >= 5) return PasswordStrength.STRONG;
    if (score >= 3) return PasswordStrength.MEDIUM;
    return PasswordStrength.WEAK;
  };
  
  // Tạo mật khẩu ngẫu nhiên
  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    const passwordLength = 12;
    let password = '';
    
    // Đảm bảo có ít nhất một ký tự từ mỗi loại
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*()_+'[Math.floor(Math.random() * 12)];
    
    // Thêm các ký tự ngẫu nhiên cho đến khi đạt đủ độ dài
    for (let i = 4; i < passwordLength; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Xáo trộn password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    form.setValue('password', password);
    setPasswordStrength(evaluatePasswordStrength(password));
  };
  
  // Xử lý thay đổi mật khẩu
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    form.setValue('password', newPassword);
    setPasswordStrength(evaluatePasswordStrength(newPassword));
  };
  
  // Xử lý khi submit form
  const onSubmit = (values: UserFormValues) => {
    console.log('Form values:', values);
    
    // Thực hiện tạo người dùng thông qua API
    // Đây là nơi bạn sẽ gọi API để tạo người dùng mới
    
    // Hiển thị thông báo thành công và chuyển hướng về trang danh sách
    setTimeout(() => {
      navigate('/users');
    }, 1500);
  };
  
  // Hiển thị thông tin độ mạnh mật khẩu
  const renderPasswordStrengthInfo = () => {
    switch (passwordStrength) {
      case PasswordStrength.STRONG:
        return (
          <div className="flex items-center mt-1 text-green-600 text-sm">
            <span className="font-medium">Mật khẩu mạnh</span>
          </div>
        );
      case PasswordStrength.MEDIUM:
        return (
          <div className="flex items-center mt-1 text-yellow-600 text-sm">
            <span className="font-medium">Mật khẩu trung bình</span>
            <span className="ml-2">Nên bao gồm ký tự đặc biệt và chữ in hoa</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center mt-1 text-red-600 text-sm">
            <span className="font-medium">Mật khẩu yếu</span>
            <span className="ml-2">Cần ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</span>
          </div>
        );
    }
  };
  
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
          <BreadcrumbLink>Tạo tài khoản mới</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tạo tài khoản mới</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/users')}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Thông tin cơ bản */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Chỉ bao gồm chữ cái, số và dấu gạch dưới
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Mật khẩu<span className="text-red-500">*</span></FormLabel>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={generateRandomPassword}
                      >
                        <RefreshCwIcon className="w-3 h-3 mr-1" />
                        Tạo mật khẩu ngẫu nhiên
                      </Button>
                    </div>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="password" 
                        onChange={handlePasswordChange} 
                      />
                    </FormControl>
                    {renderPasswordStrengthInfo()}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Thông tin đơn vị và vị trí */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Thông tin đơn vị và vị trí</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                        {availableManagers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.fullName} - {user.position?.name || ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Phân quyền */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Phân quyền</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="roleIds"
                render={() => (
                  <FormItem>
                    <FormLabel>Vai trò<span className="text-red-500">*</span></FormLabel>
                    <div className="space-y-2">
                      {mockRoles.map((role) => (
                        <div key={role.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={`role-${role.id}`}
                            checked={form.watch('roleIds').includes(role.id)}
                            onCheckedChange={(checked) => {
                              const roleIds = form.watch('roleIds');
                              if (checked) {
                                form.setValue('roleIds', [...roleIds, role.id]);
                              } else {
                                form.setValue('roleIds', roleIds.filter(id => id !== role.id));
                              }
                            }}
                          />
                          <div className="space-y-1 leading-none">
                            <label
                              htmlFor={`role-${role.id}`}
                              className="font-medium cursor-pointer"
                            >
                              {role.name}
                            </label>
                            <p className="text-sm text-gray-500">
                              {role.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="permissionIds"
                render={() => (
                  <FormItem className="mt-6">
                    <FormLabel>Quyền hạn bổ sung</FormLabel>
                    <div className="mt-2">
                      <div className="border rounded-md">
                        {/* Nhóm quyền theo group */}
                        {['TASK', 'USER', 'GROUP', 'ORGANIZATION', 'RESOURCE', 'SETTINGS'].map((group) => {
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
                          
                          return (
                            <div key={group} className="p-3 border-b last:border-b-0">
                              <div className="font-medium mb-2">{groupName}</div>
                              <div className="space-y-2 pl-2">
                                {groupPermissions.map((permission) => (
                                  <div key={permission.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`permission-${permission.id}`}
                                      checked={form.watch('permissionIds')?.includes(permission.id) || false}
                                      onCheckedChange={(checked) => {
                                        const permissionIds = form.watch('permissionIds') || [];
                                        if (checked) {
                                          form.setValue('permissionIds', [...permissionIds, permission.id]);
                                        } else {
                                          form.setValue('permissionIds', permissionIds.filter(id => id !== permission.id));
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
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <FormDescription className="mt-2">
                      Các quyền bổ sung sẽ được áp dụng ngoài quyền mặc định của vai trò
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Nút submit */}
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/users')}
            >
              Hủy
            </Button>
            <Button type="submit">
              Tạo tài khoản
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserCreatePage;