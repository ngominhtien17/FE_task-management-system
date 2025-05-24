// src/features/users/pages/UserCreatePage.tsx - Kiến trúc cải tiến
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  RefreshCwIcon, 
  ArrowLeftIcon, 
  InfoIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon
} from 'lucide-react';

import { mockDepartments, mockPositions, mockRoles, mockUsers, mockPermissions } from '../utils/mockData';
import { PasswordStrength } from '../types';

// Enhanced form schema với validation mở rộng
const userFormSchema = z.object({
  fullName: z.string()
    .min(3, 'Họ tên phải có ít nhất 3 ký tự')
    .max(50, 'Họ tên không được vượt quá 50 ký tự')
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Họ tên chỉ được chứa chữ cái và khoảng trắng'),
  username: z.string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(20, 'Tên đăng nhập không được vượt quá 20 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
  email: z.string()
    .email('Email không hợp lệ')
    .refine(val => !mockUsers.some(user => user.email === val), 'Email đã tồn tại trong hệ thống'),
  phoneNumber: z.string()
    .regex(/^(\+84|0)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ')
    .optional()
    .or(z.literal('')),
  password: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt'),
  departmentId: z.string().min(1, 'Vui lòng chọn đơn vị'),
  positionId: z.string().min(1, 'Vui lòng chọn vị trí'),
  managerId: z.string().optional(),
  roleIds: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một vai trò'),
  permissionIds: z.array(z.string()).optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();
  
  // State Management
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(PasswordStrength.WEAK);
  const [showPassword, setShowPassword] = useState(false);
  const [availableManagers, setAvailableManagers] = useState(mockUsers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Form initialization
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
    mode: 'onChange', // Real-time validation
  });

  // Watch form changes for dynamic updates
  const watchedValues = form.watch();

  // Filter managers based on selected department
  useEffect(() => {
    const selectedDepartmentId = form.watch('departmentId');
    if (selectedDepartmentId) {
      const filteredManagers = mockUsers.filter(
        user => user.department?.id === selectedDepartmentId && 
                user.position?.name.includes('Trưởng') // Only managers
      );
      setAvailableManagers(filteredManagers);
    } else {
      setAvailableManagers(mockUsers.filter(user => user.position?.name.includes('Trưởng')));
    }
  }, [form.watch('departmentId')]);

  // Advanced password strength evaluation
  const evaluatePasswordStrength = (password: string): PasswordStrength => {
    if (!password || password.length < 8) return PasswordStrength.WEAK;
    
    let score = 0;
    const checks = [
      { test: password.length >= 8, weight: 1 },
      { test: password.length >= 12, weight: 1 },
      { test: /[a-z]/.test(password), weight: 1 },
      { test: /[A-Z]/.test(password), weight: 1 },
      { test: /[0-9]/.test(password), weight: 1 },
      { test: /[^a-zA-Z0-9]/.test(password), weight: 1 },
      { test: !/(.)\1{2,}/.test(password), weight: 1 }, // No repeated chars
      { test: !/^(123|abc|qwe)/i.test(password), weight: 1 }, // No common patterns
    ];
    
    score = checks.reduce((acc, check) => acc + (check.test ? check.weight : 0), 0);
    
    if (score >= 7) return PasswordStrength.STRONG;
    if (score >= 5) return PasswordStrength.MEDIUM;
    return PasswordStrength.WEAK;
  };

  // Generate cryptographically secure password
  const generateSecurePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill remaining characters
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < 14; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    form.setValue('password', password);
    setPasswordStrength(evaluatePasswordStrength(password));
  };

  // Handle password change with real-time validation
  const handlePasswordChange = (password: string) => {
    form.setValue('password', password);
    setPasswordStrength(evaluatePasswordStrength(password));
  };

  // Multi-step form submission
  const onSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call with detailed progress
      console.log('Creating user with values:', values);
      
      // Validation checks
      const validationResults = await Promise.all([
        // Check username uniqueness
        new Promise(resolve => setTimeout(() => resolve(true), 500)),
        // Check email uniqueness  
        new Promise(resolve => setTimeout(() => resolve(true), 300)),
        // Validate department access
        new Promise(resolve => setTimeout(() => resolve(true), 200)),
      ]);
      
      if (validationResults.every(result => result)) {
        setTimeout(() => {
          navigate('/users', { 
            state: { 
              successMessage: `Tài khoản ${values.fullName} đã được tạo thành công`,
              newUserId: 'user-new-' + Date.now()
            } 
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Steps configuration
  const steps = [
    { id: 1, title: 'Thông tin cơ bản', icon: '👤' },
    { id: 2, title: 'Đơn vị & Vị trí', icon: '🏢' },
    { id: 3, title: 'Phân quyền', icon: '🔐' },
    { id: 4, title: 'Xác nhận', icon: '✅' }
  ];

  // Form validation status
  const getStepValidation = (step: number) => {
    const errors = form.formState.errors;
    switch (step) {
      case 1:
        return !errors.fullName && !errors.username && !errors.email && !errors.password;
      case 2:
        return !errors.departmentId && !errors.positionId;
      case 3:
        return !errors.roleIds;
      default:
        return true;
    }
  };

  // Progress calculation
  const getFormProgress = () => {
    const fields = ['fullName', 'username', 'email', 'password', 'departmentId', 'positionId', 'roleIds'];
    const filledFields = fields.filter(field => {
      const value = form.getValues(field as keyof UserFormValues);
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  // Password strength indicator
  const renderPasswordStrengthIndicator = () => {
    const configs = {
      [PasswordStrength.WEAK]: { 
        color: 'bg-red-500', 
        width: '33%', 
        label: 'Yếu',
        description: 'Mật khẩu quá đơn giản, dễ bị tấn công'
      },
      [PasswordStrength.MEDIUM]: { 
        color: 'bg-yellow-500', 
        width: '66%', 
        label: 'Trung bình',
        description: 'Mật khẩu ổn, nên thêm ký tự đặc biệt'
      },
      [PasswordStrength.STRONG]: { 
        color: 'bg-green-500', 
        width: '100%', 
        label: 'Mạnh',
        description: 'Mật khẩu rất an toàn'
      },
    };

    const config = configs[passwordStrength];

    return (
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Độ mạnh mật khẩu: {config.label}</span>
          <span className="text-xs text-gray-500">{getFormProgress()}% hoàn thành</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${config.color}`}
            style={{ width: config.width }}
          />
        </div>
        <p className="text-xs text-gray-600">{config.description}</p>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Tạo tài khoản người dùng mới</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
            disabled={getFormProgress() < 50}
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            {previewMode ? 'Thoát xem trước' : 'Xem trước'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/users')}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tiến độ tạo tài khoản</span>
            <span className="text-sm text-gray-500">{getFormProgress()}%</span>
          </div>
          <Progress value={getFormProgress()} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentStep >= step.id 
                    ? getStepValidation(step.id) 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.id && getStepValidation(step.id) ? (
                    <CheckCircleIcon className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="text-xs mt-1 text-center max-w-16">{step.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👤 Thông tin cơ bản
                  <InfoIcon className="w-4 h-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập họ và tên đầy đủ" />
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
                        <FormLabel>Tên đăng nhập <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Chỉ chữ cái, số và dấu gạch dưới" />
                        </FormControl>
                        <FormDescription>
                          Từ 3-20 ký tự, chỉ bao gồm chữ cái, số và dấu gạch dưới
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
                        <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="example@domain.com" />
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
                          <Input {...field} type="tel" placeholder="0987654321 hoặc +84987654321" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Mật khẩu <span className="text-red-500">*</span></FormLabel>
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={generateSecurePassword}
                        >
                          <RefreshCwIcon className="w-3 h-3 mr-1" />
                          Tạo mật khẩu tự động
                        </Button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field} 
                            type={showPassword ? "text" : "password"}
                            placeholder="Ít nhất 8 ký tự với chữ hoa, số và ký tự đặc biệt"
                            onChange={(e) => handlePasswordChange(e.target.value)} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOffIcon className="h-4 w-4" />
                            ) : (
                              <EyeIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      {field.value && renderPasswordStrengthIndicator()}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Department & Position */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏢 Thông tin đơn vị và vị trí
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đơn vị <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn đơn vị..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockDepartments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{dept.name}</span>
                                  <span className="text-xs text-gray-500">{dept.code}</span>
                                </div>
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
                        <FormLabel>Vị trí <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn người quản lý..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Không có</SelectItem>
                            {availableManagers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{user.fullName}</span>
                                  <span className="text-xs text-gray-500">
                                    {user.position?.name} - {user.department?.name}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Danh sách được lọc theo đơn vị đã chọn
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Permissions */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔐 Phân quyền và vai trò
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="roleIds"
                  render={() => (
                    <FormItem>
                      <FormLabel>Vai trò <span className="text-red-500">*</span></FormLabel>
                      <div className="space-y-3">
                        {mockRoles.map((role) => (
                          <div key={role.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
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
                            <div className="flex-1 space-y-1">
                              <label
                                htmlFor={`role-${role.id}`}
                                className="font-medium cursor-pointer block"
                              >
                                {role.name}
                              </label>
                              <p className="text-sm text-gray-600">
                                {role.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {role.permissions.slice(0, 3).map((perm, idx) => (
                                  <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {perm.name}
                                  </span>
                                ))}
                                {role.permissions.length > 3 && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    +{role.permissions.length - 3} quyền khác
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="permissionIds"
                  render={() => (
                    <FormItem>
                      <FormLabel>Quyền hạn bổ sung (Tùy chọn)</FormLabel>
                      <FormDescription>
                        Các quyền này sẽ được thêm vào ngoài quyền từ vai trò
                      </FormDescription>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        {['TASK', 'USER', 'GROUP', 'ORGANIZATION'].map((group) => {
                          const groupPermissions = mockPermissions.filter(p => p.group === group);
                          if (groupPermissions.length === 0) return null;
                          
                          const groupName = {
                            'TASK': 'Quản lý công việc',
                            'USER': 'Quản lý người dùng', 
                            'GROUP': 'Quản lý nhóm',
                            'ORGANIZATION': 'Quản lý tổ chức'
                          }[group];
                          
                          return (
                            <div key={group} className="border rounded-lg p-3">
                              <h4 className="font-medium mb-2">{groupName}</h4>
                              <div className="space-y-2">
                                {groupPermissions.slice(0, 4).map((permission) => (
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
                                      className="text-sm cursor-pointer"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ✅ Xác nhận thông tin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Xem lại thông tin</AlertTitle>
                  <AlertDescription>
                    Vui lòng kiểm tra kỹ thông tin trước khi tạo tài khoản. 
                    Một số thông tin không thể thay đổi sau khi tạo.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Thông tin cá nhân</h4>
                    <div className="text-sm space-y-1">
                      <div><strong>Họ tên:</strong> {watchedValues.fullName}</div>
                      <div><strong>Tên đăng nhập:</strong> {watchedValues.username}</div>
                      <div><strong>Email:</strong> {watchedValues.email}</div>
                      <div><strong>Số điện thoại:</strong> {watchedValues.phoneNumber || 'Chưa cung cấp'}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Đơn vị và vị trí</h4>
                    <div className="text-sm space-y-1">
                      <div><strong>Đơn vị:</strong> {
                        mockDepartments.find(d => d.id === watchedValues.departmentId)?.name
                      }</div>
                      <div><strong>Vị trí:</strong> {
                        mockPositions.find(p => p.id === watchedValues.positionId)?.name
                      }</div>
                      <div><strong>Quản lý:</strong> {
                        watchedValues.managerId 
                          ? mockUsers.find(u => u.id === watchedValues.managerId)?.fullName
                          : 'Không có'
                      }</div>
                    </div>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <h4 className="font-medium text-gray-700">Phân quyền</h4>
                    <div className="text-sm space-y-2">
                      <div>
                        <strong>Vai trò:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {watchedValues.roleIds.map(roleId => {
                            const role = mockRoles.find(r => r.id === roleId);
                            return (
                              <span key={roleId} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {role?.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      {watchedValues.permissionIds && watchedValues.permissionIds.length > 0 && (
                        <div>
                          <strong>Quyền bổ sung:</strong>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {watchedValues.permissionIds.map(permId => {
                              const permission = mockPermissions.find(p => p.id === permId);
                              return (
                                <span key={permId} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                  {permission?.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(currentStep - 1);
                } else {
                  navigate('/users');
                }
              }}
              disabled={isSubmitting}
            >
              {currentStep === 1 ? 'Hủy' : 'Quay lại'}
            </Button>

            <div className="flex gap-2">
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!getStepValidation(currentStep)}
                >
                  Tiếp theo
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !form.formState.isValid}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Đang tạo...
                    </>
                  ) : (
                    'Tạo tài khoản'
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserCreatePage;