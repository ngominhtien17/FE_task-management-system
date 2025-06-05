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
import { Card, CardContent } from '@/components/ui/card';
import { 
  SearchIcon, 
  UsersIcon,
  CheckCircleIcon
} from 'lucide-react';

import { UserStatusBadge } from './UserStatusBadge';
import { mockUsers } from '../utils/mockData';

interface UserDataTableProps {
  selectedUsers: string[];
  onSelectionChange: (selectedUsers: string[]) => void;
  multiSelect?: boolean;
  showFilters?: boolean;
  compact?: boolean;
  onUserClick?: (userId: string) => void;
  batchMode?: boolean; // New prop for batch selection mode
}

export const UserDataTable: React.FC<UserDataTableProps> = ({
  selectedUsers,
  onSelectionChange,
  multiSelect = true,
  showFilters = true,
  compact = false,
  onUserClick,
  batchMode = false
}) => {
  // Enhanced state management for batch mode
  const [searchKeyword, setSearchKeyword] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = compact ? 5 : 10;

  // Enhanced filtering logic
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

  // Enhanced pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const displayUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  // Enhanced selection handlers
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

  // Enhanced row click handler for batch mode
  const handleRowClick = (userId: string) => {
    if (batchMode) {
      const isSelected = selectedUsers.includes(userId);
      handleSelectUser(userId, !isSelected);
    } else if (onUserClick) {
      onUserClick(userId);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();
  };

  const isAllSelected = displayUsers.length > 0 && 
    displayUsers.every(user => selectedUsers.includes(user.id));
  
  const isIndeterminate = displayUsers.some(user => selectedUsers.includes(user.id)) && !isAllSelected;

  return (
    <div className="space-y-4">
      {/* Enhanced Search Bar for Batch Mode */}
      {showFilters && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
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
              
              {batchMode && selectedUsers.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border">
                  <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Đã chọn {selectedUsers.length} người dùng
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Main Table */}
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
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayUsers.map((user) => {
                  const isSelected = selectedUsers.includes(user.id);
                  
                  return (
                    <TableRow 
                      key={user.id}
                      className={`
                        ${isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
                        ${batchMode ? 'cursor-pointer' : ''}
                        transition-colors duration-200
                      `}
                      onClick={() => handleRowClick(user.id)}
                    >
                      {multiSelect && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center">
                            <Checkbox 
                              checked={isSelected}
                              onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                            />
                            {/* Enhanced Visual Indicator */}
                            {isSelected && (
                              <CheckCircleIcon className="w-4 h-4 text-blue-600 ml-2" />
                            )}
                          </div>
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
                            <div className={`font-medium ${isSelected ? 'text-blue-900' : ''}`}>
                              {user.fullName}
                            </div>
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
                  );
                })}
                
                {displayUsers.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={multiSelect ? 6 : 5} 
                      className="text-center py-8 text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <UsersIcon className="h-8 w-8 text-gray-400" />
                        <span>Không tìm thấy người dùng nào</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};