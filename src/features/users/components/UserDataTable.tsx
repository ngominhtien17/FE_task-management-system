// src/features/users/components/UserDataTable.tsx
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  SearchIcon, 
  FilterIcon, 
  SortAscIcon, 
  SortDescIcon,
  UsersIcon
} from 'lucide-react';

import { UserStatusBadge } from './UserStatusBadge';
import { mockUsers, mockDepartments } from '../utils/mockData';

interface UserDataTableProps {
  selectedUsers: string[];
  onSelectionChange: (selectedUsers: string[]) => void;
  multiSelect?: boolean;
  showFilters?: boolean;
  compact?: boolean;
  onUserClick?: (userId: string) => void;
}

export const UserDataTable: React.FC<UserDataTableProps> = ({
  selectedUsers,
  onSelectionChange,
  multiSelect = true,
  showFilters = true,
  compact = false,
  onUserClick
}) => {
  // Simple UI state - không dùng custom hooks
  const [searchKeyword, setSearchKeyword] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('fullName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = compact ? 5 : 10;

  // Simple filtering logic với mock data
  const filteredUsers = mockUsers.filter(user => {
    if (searchKeyword && !user.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchKeyword.toLowerCase())) {
      return false;
    }
    if (departmentFilter && user.department?.id !== departmentFilter) {
      return false;
    }
    if (statusFilter && user.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Simple sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortField as keyof typeof a] || '';
    let bValue = b[sortField as keyof typeof b] || '';
    
    if (sortField === 'department') {
      aValue = a.department?.name || '';
      bValue = b.department?.name || '';
    }
    
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Simple pagination
  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const displayUsers = sortedUsers.slice(startIndex, startIndex + pageSize);

  // UI Event handlers - đơn giản, tập trung vào tương tác
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allUserIds = displayUsers.map(user => user.id);
      onSelectionChange([...new Set([...selectedUsers, ...allUserIds])]);
    } else {
      const displayUserIds = displayUsers.map(user => user.id);
      onSelectionChange(selectedUsers.filter(id => !displayUserIds.includes(id)));
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (multiSelect) {
      if (checked) {
        onSelectionChange([...selectedUsers, userId]);
      } else {
        onSelectionChange(selectedUsers.filter(id => id !== userId));
      }
    } else {
      onSelectionChange(checked ? [userId] : []);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setDepartmentFilter('');
    setStatusFilter('');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();
  };

  const isAllSelected = displayUsers.length > 0 && 
    displayUsers.every(user => selectedUsers.includes(user.id));
  
  const isIndeterminate = displayUsers.some(user => selectedUsers.includes(user.id)) && !isAllSelected;

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <SortAscIcon className="w-4 h-4 ml-1" /> : 
      <SortDescIcon className="w-4 h-4 ml-1" />;
  };

  const activeFilterCount = [searchKeyword, departmentFilter, statusFilter].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Quick Filters - UI thuần */}
      {showFilters && (
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              {/* Department Filter */}
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả đơn vị</SelectItem>
                  {mockDepartments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả</SelectItem>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                  <SelectItem value="PENDING">Chờ kích hoạt</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <FilterIcon className="w-4 h-4 mr-2" />
                  Xóa bộ lọc ({activeFilterCount})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection Summary */}
      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">
                  Đã chọn {selectedUsers.length} người dùng
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSelectionChange([])}
              >
                Bỏ chọn tất cả
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-96">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  {multiSelect && (
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={isAllSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = isIndeterminate;
                        }}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  )}
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center">
                      Người dùng
                      {renderSortIcon('fullName')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      {renderSortIcon('email')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('department')}
                  >
                    <div className="flex items-center">
                      Đơn vị
                      {renderSortIcon('department')}
                    </div>
                  </TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayUsers.map((user) => (
                  <TableRow 
                    key={user.id}
                    className={`
                      ${selectedUsers.includes(user.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
                      ${onUserClick ? 'cursor-pointer' : ''}
                      transition-colors
                    `}
                    onClick={() => onUserClick?.(user.id)}
                  >
                    {multiSelect && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-xs">
                            {getInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{user.department?.name}</div>
                        <div className="text-gray-500">{user.position?.name}</div>
                      </div>
                    </TableCell>
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
                  </TableRow>
                ))}
                
                {displayUsers.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={multiSelect ? 6 : 5} 
                      className="text-center py-8 text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <UsersIcon className="h-8 w-8 text-gray-400" />
                        <span>Không tìm thấy người dùng nào</span>
                        {activeFilterCount > 0 && (
                          <Button variant="outline" size="sm" onClick={clearFilters}>
                            Xóa bộ lọc
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Simple Pagination */}
          {sortedUsers.length > pageSize && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-500">
                Hiển thị {startIndex + 1} đến {Math.min(startIndex + pageSize, sortedUsers.length)} của {sortedUsers.length} người dùng
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                
                <span className="text-sm px-3">
                  Trang {currentPage} / {totalPages}
                </span>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};