// src/features/users/components/UserRoleSelector.tsx
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ClockIcon } from 'lucide-react';
import type { Role } from '../types';

interface UserRoleSelectorProps {
  roles: Role[];
  selectedRoleIds: string[];
  onChange: (roleIds: string[]) => void;
  readOnly?: boolean;
  mode?: 'replace' | 'add' | 'remove';
}

export const RoleSelector: React.FC<UserRoleSelectorProps> = ({
  roles,
  selectedRoleIds,
  onChange,
  readOnly = false,
}) => {
  // Xử lý chọn/bỏ chọn vai trò
  const handleRoleChange = (roleId: string, checked: boolean) => {
    if (readOnly) return;
    
    if (checked) {
      onChange([...selectedRoleIds, roleId]);
    } else {
      onChange(selectedRoleIds.filter(id => id !== roleId));
    }
  };

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <div key={role.id} className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id={`role-${role.id}`}
              checked={selectedRoleIds.includes(role.id)}
              onCheckedChange={(checked) => handleRoleChange(role.id, !!checked)}
              disabled={readOnly}
            />
            <div className="space-y-1 leading-none">
              <div className="flex items-center">
                <label
                  htmlFor={`role-${role.id}`}
                  className={`font-medium cursor-pointer ${readOnly ? 'cursor-default' : ''}`}
                >
                  {role.name}
                </label>
                <ClockIcon className="h-4 w-4 ml-2 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">
                {role.description}
              </p>
            </div>
          </div>
          
          {selectedRoleIds.includes(role.id) && (
            <div className="pl-6 pt-2">
              <div className="text-sm text-gray-600">
                {role.permissions.slice(0, 4).map((perm, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">
                      <span className="text-green-600">✓</span>
                    </div>
                    <span>{perm.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};