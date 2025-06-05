// src/features/users/components/UserPermissionSelector.tsx
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronDownIcon, ChevronRightIcon, KeyIcon, InfoIcon } from 'lucide-react';
import type { Permission } from '../types';
import { mockPermissions } from '../utils/mockData';

interface PermissionSelectorProps {
  selectedPermissions: string[];
  onSelectionChange: (permissionIds: string[]) => void;
  mode?: 'replace' | 'add' | 'remove';
  conflictingPermissions?: string[];
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  selectedPermissions,
  onSelectionChange,
  mode = 'replace',
  conflictingPermissions = []
}) => {
  // CRITICAL FIX: Safe data access with fallback
  const permissions = mockPermissions || [];
  
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['TASK']);

  // Handle permission change
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedPermissions, permissionId]);
    } else {
      onSelectionChange(selectedPermissions.filter(id => id !== permissionId));
    }
  };

  // Toggle group expansion
  const toggleGroup = (group: string) => {
    if (expandedGroups.includes(group)) {
      setExpandedGroups(expandedGroups.filter(g => g !== group));
    } else {
      setExpandedGroups([...expandedGroups, group]);
    }
  };

  // Get group display name
  const getGroupName = (group: string): string => {
    const groupNames = {
      'TASK': 'Quản lý công việc',
      'USER': 'Quản lý người dùng',
      'GROUP': 'Quản lý nhóm',
      'ORGANIZATION': 'Quản lý tổ chức',
      'RESOURCE': 'Quản lý tài nguyên',
      'SETTINGS': 'Quản lý cấu hình'
    };
    return groupNames[group as keyof typeof groupNames] || group;
  };

  // Get mode configuration
  const getModeConfig = () => {
    switch (mode) {
      case 'add':
        return {
          title: 'Thêm quyền đặc biệt',
          description: 'Các quyền được chọn sẽ được thêm vào người dùng',
          color: 'text-green-600'
        };
      case 'remove':
        return {
          title: 'Gỡ bỏ quyền đặc biệt',
          description: 'Các quyền được chọn sẽ bị gỡ bỏ khỏi người dùng',
          color: 'text-red-600'
        };
      default:
        return {
          title: 'Quyền đặc biệt',
          description: 'Các quyền này sẽ được thêm vào ngoài quyền từ vai trò',
          color: 'text-blue-600'
        };
    }
  };

  const config = getModeConfig();

  // Group permissions safely
  const permissionGroups = Array.from(
    new Set(permissions.map(perm => perm.group || 'OTHER'))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${config.color}`}>
          <KeyIcon className="w-5 h-5" />
          {config.title}
        </CardTitle>
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            {config.description}
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent className="space-y-4">
        {permissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <KeyIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Không có quyền nào để chọn</p>
          </div>
        ) : (
          permissionGroups.map((group) => {
            const groupPermissions = permissions.filter(p => (p.group || 'OTHER') === group);
            const isExpanded = expandedGroups.includes(group);
            const groupName = getGroupName(group);
            
            return (
              <div key={group} className="border rounded-md overflow-hidden">
                <div 
                  className="p-3 font-medium bg-gray-50 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors"
                  onClick={() => toggleGroup(group)}
                >
                  <div className="flex items-center">
                    {isExpanded ? (
                      <ChevronDownIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4 mr-2" />
                    )}
                    {groupName}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {groupPermissions.length} quyền
                  </Badge>
                </div>
                
                {isExpanded && (
                  <div className="p-3 space-y-3 bg-white">
                    {groupPermissions.map((permission) => {
                      const isConflicting = conflictingPermissions.includes(permission.id);
                      const isSelected = selectedPermissions.includes(permission.id);
                      
                      return (
                        <div 
                          key={permission.id} 
                          className={`flex items-start space-x-3 p-2 rounded transition-colors ${
                            isConflicting ? 'bg-amber-50 border border-amber-200' : 
                            isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={`permission-${permission.id}`}
                              className="text-sm cursor-pointer font-medium block"
                            >
                              {permission.name}
                            </label>
                            <p className="text-xs text-gray-600 mt-1">
                              {permission.description}
                            </p>
                            
                            {isConflicting && (
                              <p className="text-xs text-amber-600 mt-1 font-medium">
                                ⚠️ Quyền này có thể xung đột với vai trò được chọn
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};