// src/features/users/pages/BatchPermissionPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';

import { UserStatus } from '../types';
type Department = {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentId?: string;
};
import type { User } from '../types'

import { mockUsers, mockDepartments, mockRoles, searchUsers } from '../utils/mockData';

type StepProps = {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  title: string;
};

// Component hiển thị bước trong quy trình phân quyền hàng loạt
const StepIndicator: React.FC<StepProps> = ({ step, isActive, isCompleted, title }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
          isActive ? 'bg-blue-600 text-white font-medium' : 
          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}
      >
        {step}
      </div>
      <div className={`text-sm ${isActive ? 'font-medium' : 'text-gray-500'}`}>
        {title}
      </div>
    </div>
  );
};

const BatchPermissionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    departmentId: '',
    page: 1,
    pageSize: 10
  });

  // Tìm kiếm người dùng dựa trên tham số hiện tại
  const searchResult = useMemo(() => {
    return searchUsers({
      keyword: searchParams.keyword,
      departmentId: searchParams.departmentId || undefined,
      page: searchParams.page,
      pageSize: searchParams.pageSize
    });
  }, [searchParams]);

  // Nếu có danh sách người dùng được chọn trước đó từ trang UserListPage
  useEffect(() => {
    if (location.state?.selectedUserIds) {
      setSelectedUsers(location.state.selectedUserIds);
    }
  }, [location.state]);

  // Xử lý chọn/bỏ chọn tất cả người dùng
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(searchResult.data.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Xử lý chọn/bỏ chọn một người dùng
  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    setSearchParams(prev => ({ ...prev, page: 1 }));
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  // Chuyển sang bước tiếp theo
  const handleNextStep = () => {
    if (currentStep === 1 && selectedUsers.length === 0) {
      // Hiển thị thông báo lỗi
      alert('Vui lòng chọn ít nhất một người dùng');
      return;
    }
    
    if (currentStep === 2 && selectedRoles.length === 0 && selectedPermissions.length === 0) {
      // Hiển thị thông báo lỗi
      alert('Vui lòng chọn ít nhất một vai trò hoặc quyền hạn');
      return;
    }
    
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Hoàn thành quá trình phân quyền hàng loạt
      console.log('Phân quyền hàng loạt cho users:', selectedUsers);
      console.log('Vai trò đã chọn:', selectedRoles);
      console.log('Quyền hạn đã chọn:', selectedPermissions);
      
      // TODO: Gọi API cập nhật quyền hàng loạt
      
      // Chuyển về trang danh sách người dùng
      navigate('/users', { 
        state: { 
          successMessage: 'Phân quyền hàng loạt thành công' 
        } 
      });
    }
  };

  // Quay lại bước trước
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/users');
    }
  };

  // Lấy thông tin đã chọn
  const getSelectedUsersInfo = () => {
    const users = mockUsers.filter(user => selectedUsers.includes(user.id));
    
    // Nhóm người dùng theo phòng ban
    const departmentGroups: { [key: string]: number } = {};
    users.forEach(user => {
      const deptName = user.department?.name || 'Chưa phân bộ môn';
      departmentGroups[deptName] = (departmentGroups[deptName] || 0) + 1;
    });
    
    return {
      users,
      departmentGroups
    };
  };

  const selectedUsersInfo = getSelectedUsersInfo();

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
          <BreadcrumbLink>Phân quyền hàng loạt</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Phân quyền hàng loạt</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/users')}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>
      
      {/* Hiển thị các bước */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <StepIndicator 
            step={1} 
            isActive={currentStep === 1} 
            isCompleted={currentStep > 1}
            title="Chọn người dùng" 
          />
          
          <div className="w-16 h-1 bg-gray-200 mx-2">
            {currentStep > 1 && <div className="h-full bg-green-500" />}
          </div>
          
          <StepIndicator 
            step={2} 
            isActive={currentStep === 2} 
            isCompleted={currentStep > 2}
            title="Thiết lập quyền" 
          />
        </div>
      </div>
      
      {/* Bước 1: Chọn người dùng */}
      {currentStep === 1 && (
        <>
          {/* Thông tin đã chọn */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="text-sm">
                <span className="font-medium">Đã chọn: {selectedUsers.length} người dùng</span>
                {selectedUsers.length > 0 && (
                  <span className="ml-2">
                    | Bộ môn: {Object.entries(selectedUsersInfo.departmentGroups)
                      .map(([dept, count]) => `${dept} (${count})`)
                      .join(', ')}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Lọc và tìm kiếm */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-64">
              <Select 
                value={searchParams.departmentId} 
                onValueChange={(value) => setSearchParams(prev => ({ ...prev, departmentId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {mockDepartments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Tìm kiếm người dùng..." 
                  className="pr-10"
                  value={searchParams.keyword}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full" 
                  onClick={handleSearch}
                >
                  <SearchIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Bảng danh sách người dùng */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox 
                        checked={selectedUsers.length === searchResult.data.length && searchResult.data.length > 0}
                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                      />
                    </TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Tên đăng nhập</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Đơn vị</TableHead>
                    <TableHead>Vai trò hiện tại</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResult.data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department?.name}</TableCell>
                      <TableCell>
                        {user.roles.map(role => role.name).join(', ')}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {searchResult.data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                        Không tìm thấy người dùng nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Phân trang */}
          {searchResult.total > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Hiển thị {(searchResult.page - 1) * searchResult.pageSize + 1} đến {Math.min(searchResult.page * searchResult.pageSize, searchResult.total)} của {searchResult.total} người dùng
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => searchResult.page > 1 && handlePageChange(searchResult.page - 1)}
                      className={searchResult.page <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: searchResult.totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === searchResult.page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => searchResult.page < searchResult.totalPages && handlePageChange(searchResult.page + 1)}
                      className={searchResult.page >= searchResult.totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
      
      {/* Bước 2: Thiết lập quyền */}
      {currentStep === 2 && (
        <>
          {/* Thông tin đã chọn */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div>
                <strong>Đã chọn: {selectedUsers.length} người dùng</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUsersInfo.users.slice(0, 5).map(user => (
                    <Badge key={user.id} variant="outline">
                      {user.fullName}
                    </Badge>
                  ))}
                  {selectedUsersInfo.users.length > 5 && (
                    <Badge variant="outline">
                      +{selectedUsersInfo.users.length - 5} người dùng khác
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="roles" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="roles">Vai trò</TabsTrigger>
              <TabsTrigger value="permissions">Quyền hạn đặc biệt</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roles">
              <Card>
                <CardHeader>
                  <CardTitle>Phân vai trò</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {mockRoles.map((role) => (
                      <div key={role.id} className="flex items-start space-x-2 py-2">
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={selectedRoles.includes(role.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRoles(prev => [...prev, role.id]);
                            } else {
                              setSelectedRoles(prev => prev.filter(id => id !== role.id));
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
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h3 className="font-medium text-blue-800 mb-2">Lưu ý khi phân vai trò</h3>
                    <ul className="list-disc pl-5 text-sm text-blue-700">
                      <li>Các vai trò đã chọn sẽ <strong>thay thế</strong> vai trò hiện tại của người dùng</li>
                      <li>Mỗi người dùng có thể được gán nhiều vai trò</li>
                      <li>Hãy xem kỹ mô tả vai trò và quyền tương ứng</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="permissions">
              <Card>
                <CardHeader>
                  <CardTitle>Phân quyền đặc biệt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      <div key={group} className="border rounded-md p-4">
                        <h3 className="font-medium mb-3">{groupName}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {groupPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={selectedPermissions.includes(permission.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedPermissions(prev => [...prev, permission.id]);
                                  } else {
                                    setSelectedPermissions(prev => prev.filter(id => id !== permission.id));
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
                  
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <h3 className="font-medium text-amber-800 mb-2">Lưu ý khi phân quyền đặc biệt</h3>
                    <ul className="list-disc pl-5 text-sm text-amber-700">
                      <li>Các quyền đặc biệt sẽ được <strong>thêm vào</strong> quyền từ vai trò</li>
                      <li>Nếu có xung đột giữa quyền đặc biệt và quyền từ vai trò, quyền đặc biệt sẽ được ưu tiên</li>
                      <li>Hãy cẩn thận khi gán quyền quản trị hệ thống</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {/* Nút điều hướng */}
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          variant="outline"
          onClick={handlePrevStep}
        >
          {currentStep === 1 ? 'Quay lại' : 'Quay lại'}
        </Button>
        <Button onClick={handleNextStep}>
          {currentStep === 2 ? 'Hoàn thành' : 'Tiếp theo'}
        </Button>
      </div>
    </div>
  );
};

export default BatchPermissionPage;