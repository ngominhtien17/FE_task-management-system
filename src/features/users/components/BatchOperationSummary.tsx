// ================================================================
// src/features/users/components/BatchOperationSummary.tsx
// ================================================================

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert';
import { 
  UsersIcon, 
  ShieldIcon, 
  AlertTriangleIcon, 
  InfoIcon,
  CheckCircleIcon
} from 'lucide-react';

import { mockUsers, mockRoles, mockPermissions } from '../utils/mockData';

type OperationMode = 'replace' | 'add' | 'remove';

interface BatchOperationSummaryProps {
  selectedUsers: string[];
  selectedRoles: string[];
  selectedPermissions: string[];
  operationMode: OperationMode;
}

export const BatchOperationSummary: React.FC<BatchOperationSummaryProps> = ({
  selectedUsers,
  selectedRoles,
  selectedPermissions,
  operationMode
}) => {
  // Simple data processing với mock data
  const users = mockUsers.filter(user => selectedUsers.includes(user.id));
  const roles = mockRoles.filter(role => selectedRoles.includes(role.id));
  const permissions = mockPermissions.filter(perm => selectedPermissions.includes(perm.id));

  // Simple conflict detection - UI demo purpose
  const hasConflicts = selectedRoles.length > 2 || 
    (selectedRoles.includes('role-01') && selectedRoles.includes('role-02'));
  
  const hasWarnings = operationMode === 'replace' && users.length > 5;

  // Group users by department - simple logic
  const usersByDepartment: Record<string, typeof users> = {};
  users.forEach(user => {
    const deptName = user.department?.name || 'Chưa phân bộ môn';
    if (!usersByDepartment[deptName]) usersByDepartment[deptName] = [];
    usersByDepartment[deptName].push(user);
  });

  // Operation mode UI config
  const operationConfig = {
    replace: {
      title: 'Thay thế quyền hạn',
      description: 'Quyền hiện tại sẽ bị thay thế hoàn toàn',
      icon: '🔄',
      color: 'text-blue-600'
    },
    add: {
      title: 'Thêm quyền hạn',
      description: 'Quyền mới sẽ được thêm vào quyền hiện tại',
      icon: '➕',
      color: 'text-green-600'
    },
    remove: {
      title: 'Gỡ bỏ quyền hạn',
      description: 'Quyền được chọn sẽ bị gỡ bỏ',
      icon: '➖',
      color: 'text-red-600'
    }
  };

  const config = operationConfig[operationMode];

  return (
    <div className="space-y-6">
      {/* Operation Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5" />
            Tóm tắt thao tác phân quyền
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <h3 className={`font-semibold ${config.color}`}>
                  {config.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {config.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {selectedUsers.length}
              </div>
              <div className="text-sm text-gray-500">người dùng</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            Người dùng được chọn ({selectedUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(usersByDepartment).map(([deptName, deptUsers]) => (
              <div key={deptName}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-700">{deptName}</h4>
                  <Badge variant="outline">{deptUsers.length} người</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {deptUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">{user.fullName}</span>
                      <span className="text-xs text-gray-500">({user.username})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Changes Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Xem trước thay đổi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Roles */}
          {selectedRoles.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <ShieldIcon className="w-4 h-4" />
                Vai trò ({selectedRoles.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roles.map(role => (
                  <div key={role.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{role.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {role.permissions.length} quyền
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {role.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map(perm => (
                        <Badge key={perm.id} variant="outline" className="text-xs bg-blue-50">
                          {perm.name}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Permissions */}
          {selectedPermissions.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">
                Quyền đặc biệt ({selectedPermissions.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {permissions.map(permission => (
                  <Badge 
                    key={permission.id} 
                    variant="outline" 
                    className="justify-center bg-green-50 text-green-700"
                  >
                    {permission.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {selectedRoles.length === 0 && selectedPermissions.length === 0 && (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Chưa có thay đổi</AlertTitle>
              <AlertDescription>
                Vui lòng chọn ít nhất một vai trò hoặc quyền để thực hiện thao tác.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Impact Analysis - Simple demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="w-5 h-5" />
            Phân tích tác động
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Demo conflicts */}
          {hasConflicts && (
            <Alert variant="destructive">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertTitle>Phát hiện xung đột</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li className="text-sm">Vai trò Admin và Manager có xung đột quyền</li>
                  <li className="text-sm">Một số người dùng đã có quyền tương tự từ vai trò khác</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Demo warnings */}
          {hasWarnings && (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Cảnh báo</AlertTitle>
              <AlertDescription>
                Thay thế quyền cho nhiều người dùng cùng lúc có thể ảnh hưởng đến hoạt động hệ thống.
              </AlertDescription>
            </Alert>
          )}

          {/* Success case */}
          {!hasConflicts && !hasWarnings && (
            <Alert>
              <CheckCircleIcon className="h-4 w-4" />
              <AlertTitle>Sẵn sàng thực hiện</AlertTitle>
              <AlertDescription>
                Không phát hiện xung đột nào. Thao tác có thể được thực hiện an toàn.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê thao tác</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {selectedUsers.length}
              </div>
              <div className="text-sm text-blue-600">Người dùng</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {selectedRoles.length}
              </div>
              <div className="text-sm text-purple-600">Vai trò</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {selectedPermissions.length}
              </div>
              <div className="text-sm text-green-600">Quyền đặc biệt</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {Object.keys(usersByDepartment).length}
              </div>
              <div className="text-sm text-amber-600">Đơn vị</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};