// src/features/users/components/UserPermissionManager.tsx


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Checkbox } from '@/common/components/ui/checkbox';
import { Badge } from '@/common/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert';
import { Separator } from '@/common/components/ui/separator';
import { ShieldIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react';
import type { User } from '../types';
import { mockRoles, mockPermissions } from '../utils/mockData';

interface UserPermissionManagerProps {
  user: User;
  onPermissionsUpdate: (user: User) => void;
}

export const PermissionManager: React.FC<UserPermissionManagerProps> = ({
  user,
  onPermissionsUpdate
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    user.roles.map(role => role.id)
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    user.permissions?.map(perm => perm.id) || []
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Get permissions from selected roles
  const rolePermissions = selectedRoles.flatMap(roleId => {
    const role = mockRoles.find(r => r.id === roleId);
    return role ? role.permissions.map(p => p.id) : [];
  });

  // Find conflicting permissions
  const conflicts = selectedPermissions.filter(permId => {
    const permission = mockPermissions.find(p => p.id === permId);
    return permission && rolePermissions.includes(permId);
  });

  const handleSavePermissions = async () => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser: User = {
        ...user,
        roles: selectedRoles.map(roleId => mockRoles.find(r => r.id === roleId)!),
        permissions: selectedPermissions.map(permId => 
          mockPermissions.find(p => p.id === permId)!
        ),
      };
      
      onPermissionsUpdate(updatedUser);
    } catch (error) {
      console.error('Error updating permissions:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5" />
            Quản lý phân quyền
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roles" className="space-y-6">
            <TabsList>
              <TabsTrigger value="roles">Vai trò</TabsTrigger>
              <TabsTrigger value="permissions">Quyền đặc biệt</TabsTrigger>
              <TabsTrigger value="summary">Tổng quan</TabsTrigger>
            </TabsList>

            <TabsContent value="roles" className="space-y-4">
              <div className="space-y-4">
                {mockRoles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
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
                      <div className="flex-1">
                        <label
                          htmlFor={`role-${role.id}`}
                          className="font-medium cursor-pointer block"
                        >
                          {role.name}
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                          {role.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {role.permissions.slice(0, 5).map((perm, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {perm.name}
                            </Badge>
                          ))}
                          {role.permissions.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 5} quyền khác
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Quyền đặc biệt</AlertTitle>
                <AlertDescription>
                  Các quyền này sẽ được thêm vào ngoài quyền từ vai trò. 
                  Nếu có xung đột, quyền đặc biệt sẽ được ưu tiên.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['TASK', 'USER', 'GROUP', 'ORGANIZATION', 'RESOURCE', 'SETTINGS'].map((group) => {
                  const groupPermissions = mockPermissions.filter(p => p.group === group);
                  if (groupPermissions.length === 0) return null;
                  
                  const groupName = {
                    'TASK': 'Quản lý công việc',
                    'USER': 'Quản lý người dùng',
                    'GROUP': 'Quản lý nhóm',
                    'ORGANIZATION': 'Quản lý tổ chức',
                    'RESOURCE': 'Quản lý tài nguyên',
                    'SETTINGS': 'Quản lý cấu hình'
                  }[group];
                  
                  return (
                    <Card key={group}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">{groupName}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
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
                              className="text-sm cursor-pointer flex-1"
                            >
                              {permission.name}
                            </label>
                            {rolePermissions.includes(permission.id) && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                Từ vai trò
                              </Badge>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {conflicts.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Phát hiện xung đột quyền</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-2">
                      {conflicts.map(conflictId => {
                        const permission = mockPermissions.find(p => p.id === conflictId);
                        return (
                          <li key={conflictId}>
                            Quyền "{permission?.name}" đã có từ vai trò được chọn
                          </li>
                        );
                      })}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Vai trò được gán</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedRoles.length === 0 ? (
                      <p className="text-sm text-gray-500">Chưa chọn vai trò nào</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedRoles.map(roleId => {
                          const role = mockRoles.find(r => r.id === roleId);
                          return role ? (
                            <Badge key={roleId} variant="outline" className="block text-center">
                              {role.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quyền đặc biệt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPermissions.length === 0 ? (
                      <p className="text-sm text-gray-500">Chưa có quyền đặc biệt</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedPermissions.map(permId => {
                          const permission = mockPermissions.find(p => p.id === permId);
                          return permission ? (
                            <Badge 
                              key={permId} 
                              variant="outline" 
                              className="block text-center bg-green-50 text-green-700"
                            >
                              {permission.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tổng hợp quyền hạn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Tổng số vai trò:</span>
                      <span className="font-medium">{selectedRoles.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quyền từ vai trò:</span>
                      <span className="font-medium">{rolePermissions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quyền đặc biệt:</span>
                      <span className="font-medium">{selectedPermissions.length}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Tổng quyền hạn:</span>
                      <span>{new Set([...rolePermissions, ...selectedPermissions]).size}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRoles(user.roles.map(role => role.id));
                setSelectedPermissions(user.permissions?.map(perm => perm.id) || []);
              }}
              disabled={isUpdating}
            >
              Khôi phục
            </Button>
            <Button 
              onClick={handleSavePermissions}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật quyền'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};