// src/features/users/pages/UserListPage.tsx - Cấu trúc cải tiến
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/common/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/common/components/ui/dropdown-menu';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Checkbox } from '@/common/components/ui/checkbox';
import { Badge } from '@/common/components/ui/badge';
import { Card, CardContent } from '@/common/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/common/components/ui/dialog';

import { 
  ChevronDownIcon,
  PlusIcon, 
  SearchIcon, 
  UploadIcon, 
  UsersIcon,
  FilterIcon,
  DownloadIcon
} from 'lucide-react';

import { UserStatus } from '../types';
import type { User } from '../types';
import { UserFilter } from '../components/UserFilter';
import { UserTabBar } from '../components/UserTabBar';
import { UserPagination } from '../components/UserPagination';
import { UserStatusBadge } from '../components/UserStatusBadge';
import { mockUsers, searchUsers, mockDepartments, mockRoles } from '../utils/mockData';

const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    departmentId: '',
    roleId: '',
    status: '',
    page: 1,
    pageSize: 10
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('');
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  // Computed data
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

  // Event handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(searchResult.data.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSearch = (query: string) => {
    setSearchParams(prev => ({ ...prev, keyword: query, page: 1 }));
  };

  const handleFilter = (filters: Record<string, any>) => {
    setSearchParams(prev => ({ ...prev, ...filters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleBatchPermission = () => {
    if (selectedUsers.length > 0) {
      navigate('/users/batch-permission', { state: { selectedUserIds: selectedUsers } });
    }
  };

  const handleOpenDeactivateDialog = (user: User) => {
    setUserToDeactivate(user);
    setDeactivateReason('');
    setIsDeactivateDialogOpen(true);
  };

  const handleDeactivateUser = () => {
    console.log(`Vô hiệu hóa tài khoản: ${userToDeactivate?.fullName} với lý do: ${deactivateReason}`);
    setIsDeactivateDialogOpen(false);
    setUserToDeactivate(null);
    setDeactivateReason('');
  };

  const handleExportUsers = () => {
    console.log('Export users');
    // Implement export functionality
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleExportUsers}
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/users/import')}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            Nhập từ file
          </Button>
          <Button 
            onClick={() => navigate('/users/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Tạo tài khoản mới
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="grid gap-4">
        <UserFilter 
          onSearch={handleSearch} 
          onFilter={handleFilter}
          showAdvanced={showAdvancedFilters}
          onToggleAdvanced={setShowAdvancedFilters}
        />
        
        {/* Tab and Bulk Actions */}
        <div className="flex items-center justify-between">
          <UserTabBar 
            currentTab={currentTab} 
            onChange={setCurrentTab}
            counts={{
              all: searchResult.total,
              active: mockUsers.filter(u => u.status === UserStatus.ACTIVE).length,
              inactive: mockUsers.filter(u => u.status === UserStatus.INACTIVE).length,
              pending: mockUsers.filter(u => u.status === UserStatus.PENDING).length
            }}
          />
          
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedUsers.length} người dùng
              </span>
              <Button 
                size="sm"
                variant="outline"
                onClick={handleBatchPermission}
              >
                <UsersIcon className="w-4 h-4 mr-2" />
                Phân quyền hàng loạt
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedUsers.length === searchResult.data.length && searchResult.data.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Tên đăng nhập</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchResult.data.map((user) => (
                <TableRow 
                  key={user.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/users/detail/${user.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
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
                    <div className="flex flex-wrap gap-1">
                      {user.roles.slice(0, 2).map(role => (
                        <Badge key={role.id} variant="outline" className="text-xs">
                          {role.name}
                        </Badge>
                      ))}
                      {user.roles.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.roles.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
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
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <UsersIcon className="h-8 w-8 text-gray-400" />
                      <span>Không tìm thấy người dùng nào</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {searchResult.total > 0 && (
            <UserPagination 
              currentPage={searchResult.page}
              totalPages={searchResult.totalPages}
              pageSize={searchResult.pageSize}
              total={searchResult.total}
              onPageChange={handlePageChange}
              onPageSizeChange={(pageSize) => setSearchParams(prev => ({ ...prev, pageSize, page: 1 }))}
            />
          )}
        </CardContent>
      </Card>

      {/* Deactivate User Dialog */}
      <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vô hiệu hóa tài khoản</DialogTitle>
            <DialogDescription>
              Bạn đang vô hiệu hóa tài khoản: <strong>{userToDeactivate?.fullName}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Lý do vô hiệu hóa <span className="text-red-500">*</span>
              </label>
              <textarea 
                className="w-full min-h-24 p-3 border rounded-md resize-none"
                placeholder="Nhập lý do vô hiệu hóa tài khoản..."
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
              />
            </div>
            
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                ⚠️ Tài khoản sẽ không thể đăng nhập sau khi bị vô hiệu hóa. 
                Tất cả phiên làm việc hiện tại sẽ bị chấm dứt.
              </p>
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
              Xác nhận vô hiệu hóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserListPage;