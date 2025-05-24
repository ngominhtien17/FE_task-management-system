// src/features/users/pages/UserDetailPage.tsx - Kiến trúc cải tiến
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { ArrowLeftIcon, EditIcon, ShieldIcon, HistoryIcon, SettingsIcon } from 'lucide-react';

import { UserStatus } from '../types';
import type { User } from '../types';
import { UserEditForm } from '../components/UserEditForm';
import { UserPermissionManager } from '../components/UserPermissionManager';
import { UserActivityLog } from '../components/UserActivityLog';
import { UserStatusBadge } from '../components/UserStatusBadge';
import { mockUsers } from '../utils/mockData';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State management với enhanced tracking
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Load user data với error handling
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call với realistic timing
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const foundUser = mockUsers.find(user => user.id === id);
        if (foundUser) {
          setUser(foundUser);
        } else {
          throw new Error(`User with ID ${id} not found`);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        navigate('/users', { 
          state: { 
            errorMessage: 'Không tìm thấy thông tin người dùng' 
          } 
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadUserData();
    }
  }, [id, navigate]);

  // Utility functions
  const getInitials = (name: string): string => {
    return name.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    setLastUpdate(new Date());
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Không tìm thấy người dùng</h2>
          <p className="text-gray-600 mb-6">
            Người dùng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button onClick={() => navigate('/users')}>
            Quay lại danh sách người dùng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section - Enhanced */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/users')}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Chi tiết người dùng</h1>
            <p className="text-sm text-gray-500">
              Cập nhật lần cuối: {lastUpdate.toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setActiveTab('edit')}
          >
            <EditIcon className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button 
            variant="outline"
            onClick={() => setActiveTab('permissions')}
          >
            <ShieldIcon className="w-4 h-4 mr-2" />
            Phân quyền
          </Button>
        </div>
      </div>

      {/* User Profile Card - Enhanced */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback className="text-lg font-semibold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-semibold">{user.fullName}</h2>
                  <UserStatusBadge status={user.status} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Email:</span> {user.email}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tên đăng nhập:</span> {user.username}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Đơn vị:</span> {user.department?.name || 'Chưa phân bộ môn'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Vị trí:</span> {user.position?.name || 'Chưa xác định'}
                  </div>
                  {user.phoneNumber && (
                    <div>
                      <span className="font-medium text-gray-700">Điện thoại:</span> {user.phoneNumber}
                    </div>
                  )}
                  {user.manager && (
                    <div>
                      <span className="font-medium text-gray-700">Quản lý:</span> {user.manager.fullName}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-700 block mb-2">Vai trò:</span>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map(role => (
                    <Badge key={role.id} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <EditIcon className="w-4 h-4" />
            Chỉnh sửa
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <ShieldIcon className="w-4 h-4" />
            Phân quyền
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <HistoryIcon className="w-4 h-4" />
            Hoạt động
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê tài khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Lần đăng nhập cuối:</span>
                  <span className="font-medium">2 giờ trước</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tổng số đăng nhập:</span>
                  <span className="font-medium">247 lần</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Công việc được giao:</span>
                  <span className="font-medium">12 công việc</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tỷ lệ hoàn thành:</span>
                  <span className="font-medium text-green-600">85%</span>
                </div>
              </CardContent>
            </Card>

            {/* Security Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bảo mật</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Đổi mật khẩu lần cuối:</span>
                  <span className="font-medium">30 ngày trước</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Xác thực 2 yếu tố:</span>
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    Chưa kích hoạt
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phiên đăng nhập:</span>
                  <span className="font-medium">2 thiết bị</span>
                </div>
                
                <Alert>
                  <AlertTitle>Khuyến nghị bảo mật</AlertTitle>
                  <AlertDescription>
                    Nên kích hoạt xác thực 2 yếu tố để tăng cường bảo mật tài khoản.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Đăng nhập hệ thống', time: '2 giờ trước', status: 'success' },
                  { action: 'Cập nhật thông tin cá nhân', time: '1 ngày trước', status: 'info' },
                  { action: 'Hoàn thành công việc #CV-123', time: '2 ngày trước', status: 'success' },
                  { action: 'Đổi mật khẩu', time: '30 ngày trước', status: 'warning' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <span className="text-sm">{activity.action}</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Edit Tab */}
        <TabsContent value="edit">
          <UserEditForm 
            user={user} 
            onUserUpdate={handleUserUpdate}
            onCancel={() => setActiveTab('overview')}
          />
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <UserPermissionManager 
            user={user} 
            onPermissionsUpdate={handleUserUpdate}
          />
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <UserActivityLog userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetailPage;