// src/features/users/components/UserPermissionSelector.tsx
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import type { Permission } from '../types';

interface UserPermissionSelectorProps {
  permissions: Permission[];
  selectedPermissionIds: string[];
  onChange: (permissionIds: string[]) => void;
  readOnly?: boolean;
  conflictingPermissions?: string[];
}

export const PermissionSelector: React.FC<UserPermissionSelectorProps> = ({
  permissions,
  selectedPermissionIds,
  onChange,
  readOnly = false,
  conflictingPermissions = [],
}) => {
  // Theo dõi nhóm quyền đang mở
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['TASK']);

  // Lấy danh sách các nhóm quyền duy nhất
  const permissionGroups = Array.from(
    new Set(permissions.map(perm => perm.group))
  );

  // Xử lý chọn/bỏ chọn quyền
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (readOnly) return;
    
    if (checked) {
      onChange([...selectedPermissionIds, permissionId]);
    } else {
      onChange(selectedPermissionIds.filter(id => id !== permissionId));
    }
  };

  // Xử lý mở/đóng nhóm quyền
  const toggleGroup = (group: string) => {
    if (expandedGroups.includes(group)) {
      setExpandedGroups(expandedGroups.filter(g => g !== group));
    } else {
      setExpandedGroups([...expandedGroups, group]);
    }
  };

  // Ánh xạ tên nhóm quyền
  const getGroupName = (group: string): string => {
    switch (group) {
      case 'TASK': return 'Quản lý công việc';
      case 'USER': return 'Quản lý người dùng';
      case 'GROUP': return 'Quản lý nhóm';
      case 'ORGANIZATION': return 'Quản lý tổ chức';
      case 'RESOURCE': return 'Quản lý tài nguyên';
      case 'SETTINGS': return 'Quản lý cấu hình';
      default: return group;
    }
  };

  return (
    <div className="space-y-4">
      {permissionGroups.map((group) => {
        const groupPermissions = permissions.filter(p => p.group === group);
        const isExpanded = expandedGroups.includes(group);
        const groupName = getGroupName(group);
        
        return (
          <div key={group} className="border rounded-md overflow-hidden">
            <div 
              className="p-3 font-medium bg-gray-50 cursor-pointer flex items-center justify-between"
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
            </div>
            
            {isExpanded && (
              <div className="p-3 space-y-3">
                {groupPermissions.map((permission) => {
                  const isConflicting = conflictingPermissions.some(
                    conflict => conflict.includes(permission.name)
                  );
                  
                  return (
                    <div 
                      key={permission.id} 
                      className={`flex items-start space-x-2 ${isConflicting ? 'bg-amber-50 p-2 rounded' : ''}`}
                    >
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={selectedPermissionIds.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                        disabled={readOnly}
                      />
                      <div>
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className={`text-sm ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {permission.name}
                        </label>
                        
                        {isConflicting && (
                          <p className="text-xs text-amber-600 mt-1">
                            Xung đột: {conflictingPermissions.find(c => c.includes(permission.name))}
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
      })}
    </div>
  );
};
