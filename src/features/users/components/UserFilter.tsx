// src/features/users/components/UserFilter.tsx
import React, { useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/common/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { SearchIcon, FilterIcon, XIcon } from 'lucide-react';
import { mockDepartments, mockRoles } from '../utils/mockData';
import { UserStatus } from '../types';
import { SELECT_VALUES, selectUtils } from '../utils/selectConstants';

interface UserFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, any>) => void;
  showAdvanced: boolean;
  onToggleAdvanced: (show: boolean) => void;
}

export const UserFilter: React.FC<UserFilterProps> = ({
  onSearch,
  onFilter,
  showAdvanced,
  onToggleAdvanced
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    departmentId: SELECT_VALUES.ALL,
    roleId: SELECT_VALUES.ALL,
    status: SELECT_VALUES.ALL
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Chuyển đổi giá trị để gửi cho component cha
    const processedFilters = {
      departmentId: selectUtils.getFilterValue(newFilters.departmentId),
      roleId: selectUtils.getFilterValue(newFilters.roleId),
      status: selectUtils.getFilterValue(newFilters.status)
    };
    
    onFilter(processedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { 
      departmentId: SELECT_VALUES.ALL, 
      roleId: SELECT_VALUES.ALL, 
      status: SELECT_VALUES.ALL 
    };
    setFilters(clearedFilters);
    onFilter({ departmentId: undefined, roleId: undefined, status: undefined });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    !selectUtils.isAllValue(value) && !selectUtils.isEmptyValue(value)
  );

  return (
    <div className="space-y-4">
      {/* Quick Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Input 
            type="text" 
            placeholder="Tìm kiếm theo tên, email, tên đăng nhập..." 
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(searchQuery)}
          />
          <Button 
            variant="ghost" 
            className="absolute right-0 top-0 h-full px-3" 
            onClick={() => onSearch(searchQuery)}
          >
            <SearchIcon className="w-4 h-4" />
          </Button>
        </div>
        
        <Button 
          variant="outline"
          onClick={() => onToggleAdvanced(!showAdvanced)}
          className={showAdvanced ? 'bg-blue-50' : ''}
        >
          <FilterIcon className="w-4 h-4 mr-2" />
          Bộ lọc nâng cao
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.values(filters).filter(v => 
                !selectUtils.isAllValue(v) && !selectUtils.isEmptyValue(v)
              ).length}
            </span>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Bộ lọc nâng cao</CardTitle>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <XIcon className="w-4 h-4 mr-1" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Đơn vị</label>
                <Select 
                  value={filters.departmentId} 
                  onValueChange={(value) => handleFilterChange('departmentId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SELECT_VALUES.ALL}>Tất cả</SelectItem>
                    {mockDepartments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Vai trò</label>
                <Select 
                  value={filters.roleId} 
                  onValueChange={(value) => handleFilterChange('roleId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SELECT_VALUES.ALL}>Tất cả</SelectItem>
                    {mockRoles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Trạng thái</label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SELECT_VALUES.ALL}>Tất cả</SelectItem>
                    <SelectItem value={UserStatus.ACTIVE}>Đang hoạt động</SelectItem>
                    <SelectItem value={UserStatus.INACTIVE}>Không hoạt động</SelectItem>
                    <SelectItem value={UserStatus.PENDING}>Chờ kích hoạt</SelectItem>
                    <SelectItem value={UserStatus.LOCKED}>Đã khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
