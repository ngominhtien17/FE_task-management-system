// ================================================================
// src/features/users/components/UserActivityLog.tsx  
// ================================================================

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/common/components/ui/select';
import { Input } from '@/common/components/ui/input';
import { Separator } from '@/common/components/ui/separator';
import { 
  ClockIcon, 
  SearchIcon, 
  DownloadIcon,
  UserIcon,
  ShieldIcon,
  KeyIcon,
  LogInIcon
} from 'lucide-react';

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  performedBy: string;
  performedAt: string;
  category: 'AUTH' | 'PROFILE' | 'PERMISSION' | 'SYSTEM';
  ipAddress?: string;
  userAgent?: string;
}

interface UserActivityLogProps {
  userId: string;
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    userId: 'user-02',
    action: 'USER_LOGIN',
    details: 'Đăng nhập thành công từ Chrome on Windows',
    performedBy: 'System',
    performedAt: '2023-05-12T10:30:00Z',
    category: 'AUTH',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 114.0.0.0'
  },
  {
    id: 'log-2',
    userId: 'user-02',
    action: 'ROLE_ASSIGNED',
    details: 'Vai trò "Trưởng bộ môn" được gán cho người dùng',
    performedBy: 'Nguyễn Văn A',
    performedAt: '2023-05-12T09:15:00Z',
    category: 'PERMISSION'
  },
  {
    id: 'log-3',
    userId: 'user-02',
    action: 'PROFILE_UPDATED',
    details: 'Cập nhật số điện thoại và địa chỉ email',
    performedBy: 'Trần Thị B',
    performedAt: '2023-05-11T14:20:00Z',
    category: 'PROFILE'
  },
  {
    id: 'log-4',
    userId: 'user-02',
    action: 'PASSWORD_CHANGED',
    details: 'Thay đổi mật khẩu thành công',
    performedBy: 'Trần Thị B',
    performedAt: '2023-05-10T08:45:00Z',
    category: 'AUTH'
  },
  {
    id: 'log-5',
    userId: 'user-02',
    action: 'PERMISSION_GRANTED',
    details: 'Thêm quyền "Xem tất cả công việc"',
    performedBy: 'Nguyễn Văn A',
    performedAt: '2023-05-09T16:30:00Z',
    category: 'PERMISSION'
  }
];

export const UserActivityLog: React.FC<UserActivityLogProps> = ({ userId }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivityLogs = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const userLogs = mockActivityLogs.filter(log => log.userId === userId);
        setLogs(userLogs);
        setFilteredLogs(userLogs);
      } catch (error) {
        console.error('Error loading activity logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivityLogs();
  }, [userId]);

  useEffect(() => {
    let filtered = logs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.performedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    // Filter by date range
    const now = new Date();
    const days = parseInt(dateRange.replace('days', ''));
    if (days) {
      const cutoff = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
      filtered = filtered.filter(log => new Date(log.performedAt) >= cutoff);
    }

    setFilteredLogs(filtered);
  }, [logs, searchQuery, categoryFilter, dateRange]);

  const getActionIcon = (category: string) => {
    switch (category) {
      case 'AUTH': return LogInIcon;
      case 'PROFILE': return UserIcon;
      case 'PERMISSION': return ShieldIcon;
      case 'SYSTEM': return KeyIcon;
      default: return ClockIcon;
    }
  };

  const getActionColor = (category: string) => {
    switch (category) {
      case 'AUTH': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PROFILE': return 'bg-green-100 text-green-700 border-green-200';
      case 'PERMISSION': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'SYSTEM': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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

  const handleExportLogs = () => {
    // Implement export functionality
    console.log('Exporting activity logs...');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5" />
            Lịch sử hoạt động
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportLogs}
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm hoạt động..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Loại hoạt động" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="AUTH">Xác thực</SelectItem>
              <SelectItem value="PROFILE">Hồ sơ</SelectItem>
              <SelectItem value="PERMISSION">Phân quyền</SelectItem>
              <SelectItem value="SYSTEM">Hệ thống</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1days">1 ngày</SelectItem>
              <SelectItem value="7days">7 ngày</SelectItem>
              <SelectItem value="30days">30 ngày</SelectItem>
              <SelectItem value="90days">90 ngày</SelectItem>
              <SelectItem value="all">Tất cả</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ClockIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Không tìm thấy hoạt động nào</p>
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const ActionIcon = getActionIcon(log.category);
              
              return (
                <div key={log.id} className="relative">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(log.category)}`}>
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {log.action.replace(/_/g, ' ')}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getActionColor(log.category)}`}
                          >
                            {log.category}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(log.performedAt)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {log.details}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Bởi: {log.performedBy}</span>
                        {log.ipAddress && (
                          <span>IP: {log.ipAddress}</span>
                        )}
                        {log.userAgent && (
                          <span>Thiết bị: {log.userAgent}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {index < filteredLogs.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};