// src/features/users/pages/UserListPage.tsx
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

import { 
  ChevronDownIcon,
  PlusIcon, 
  SearchIcon, 
  UploadIcon, 
  UserPlusIcon, 
  UsersIcon 
} from 'lucide-react';


// Sử dụng định nghĩa inline:
import { UserStatus } from '../types';
type Department = {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentId?: string;
};
import type { User } from '../types'
import { mockUsers, searchUsers, mockDepartments, mockRoles } from '../utils/mockData';

const UserStatusBadge = ({ status }: { status: UserStatus }) => {
  const getStatusConfig = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return { label: 'Đang hoạt động', className: 'bg-green-500' };
      case UserStatus.INACTIVE:
        return { label: 'Không hoạt động', className: 'bg-red-500' };
      case UserStatus.PENDING:
        return { label: 'Chờ kích hoạt', className: 'bg-yellow-500' };
      case UserStatus.LOCKED:
        return { label: 'Đã khóa', className: 'bg-gray-500' };
      default:
        return { label: 'Không xác định', className: 'bg-gray-400' };
    }
  };

  const { label, className } = getStatusConfig(status);

  return (
    <Badge className={className}>
      {label}
    </Badge>
  );
};

const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    departmentId: '',
    roleId: '',
    status: '',
    page: 1,
    pageSize: 10
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('');
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  // Tìm kiếm người dùng dựa trên tham số hiện tại
  const searchResult = useMemo(() => {
    return searchUsers({
      keyword: searchParams.keyword,
      departmentId: searchParams.departmentId || undefined,
      roles: searchParams.roleId ? [searchParams.roleId] : undefined,
      status: searchParams.status || undefined,
      page: searchParams.page,
      pageSize: searchParams.pageSize
    });
  }, [searchParams]);

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

  // Xử lý mở hộp thoại vô hiệu hóa tài khoản
  const handleOpenDeactivateDialog = (user: User) => {
    setUserToDeactivate(user);
    setDeactivateReason('');
    setIsDeactivateDialogOpen(true);
  };

  // Xử lý vô hiệu hóa tài khoản
  const handleDeactivateUser = () => {
    // Thực hiện vô hiệu hóa tài khoản trên server
    console.log(`Vô hiệu hóa tài khoản: ${userToDeactivate?.fullName} với lý do: ${deactivateReason}`);
    setIsDeactivateDialogOpen(false);
    setUserToDeactivate(null);
    setDeactivateReason('');
  };

  // Xử lý phân quyền hàng loạt
  const handleBatchPermission = () => {
    if (selectedUsers.length > 0) {
      navigate('/users/batch-permission', { state: { selectedUserIds: selectedUsers } });
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
      </Breadcrumb>

      <h1 className="text-2xl font-semibold mb-6">Quản lý người dùng</h1>

      {/* Thanh công cụ */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          as={Link} 
          to="/users/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Tạo tài khoản mới
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setIsImportDialogOpen(true)}
        >
          <UploadIcon className="w-4 h-4 mr-2" />
          Nhập từ file
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleBatchPermission}
          disabled={selectedUsers.length === 0}
        >
          <UsersIcon className="w-4 h-4 mr-2" />
          Phân quyền hàng loạt
        </Button>
        
        <div className="ml-auto">
          <div className="relative flex items-center">
            <Input 
              type="text" 
              placeholder="Tìm kiếm" 
              className="pr-10"
              value={searchParams.keyword}
              onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              variant="ghost" 
              className="absolute right-0" 
              onClick={handleSearch}
            >
              <SearchIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <Card className="mb-6">
        <CardHeader className="pb-3 cursor-pointer" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
          <CardTitle className="text-base">Bộ lọc nâng cao</CardTitle>
        </CardHeader>
        
        {showAdvancedFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Đơn vị</label>
                <Select 
                  value={searchParams.departmentId} 
                  onValueChange={(value) => setSearchParams(prev => ({ ...prev, departmentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    {mockDepartments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Vai trò</label>
                <Select 
                  value={searchParams.roleId} 
                  onValueChange={(value) => setSearchParams(prev => ({ ...prev, roleId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    {mockRoles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                <Select 
                  value={searchParams.status} 
                  onValueChange={(value) => setSearchParams(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    <SelectItem value={UserStatus.ACTIVE}>Đang hoạt động</SelectItem>
                    <SelectItem value={UserStatus.INACTIVE}>Không hoạt động</SelectItem>
                    <SelectItem value={UserStatus.PENDING}>Chờ kích hoạt</SelectItem>
                    <SelectItem value={UserStatus.LOCKED}>Đã khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={handleSearch}>
                  Áp dụng
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

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
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
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
                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <span className="sr-only">Mở menu</span>
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => navigate(`/users/detail/${user.id}`)}
                        >
                          Chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => navigate(`/users/detail/${user.id}`)}
                        >
                          Chỉnh sửa
                        </DropdownMenuItem>
                        {user.status === UserStatus.ACTIVE && (
                          <DropdownMenuItem 
                            onClick={() => handleOpenDeactivateDialog(user)}
                            className="text-red-600"
                          >
                            Vô hiệu hóa
                          </DropdownMenuItem>
                        )}
                        {user.status !== UserStatus.ACTIVE && (
                          <DropdownMenuItem>
                            Kích hoạt
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              
              {searchResult.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
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
            <p className="font-medium">{userToDeactivate?.fullName} ({userToDeactivate?.email})</p>
            <p>{userToDeactivate?.department?.name}</p>
            
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

      {/* Modal nhập người dùng từ file */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập người dùng từ file</DialogTitle>
          </DialogHeader>
          
          <div className="flex border-b mb-4">
            <Button variant="ghost" className="border-b-2 border-primary">
              Tải mẫu file
            </Button>
            <Button variant="ghost">
              Nhập dữ liệu
            </Button>
          </div>
          
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <UploadIcon className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-700 mb-2">Kéo và thả file Excel/CSV vào đây</p>
              <p className="text-gray-500 text-sm mb-2">hoặc</p>
              <Button variant="outline">
                Chọn file để tải lên
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mt-2">
            <p>Hỗ trợ định dạng: .xlsx, .csv</p>
            <p>Kích thước tối đa: 10MB</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Hủy
            </Button>
            <Button disabled>
              Nhập file
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserListPage;