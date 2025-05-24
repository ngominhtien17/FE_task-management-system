// src/features/users/components/UserStatusBadge.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserStatus } from '../types';

interface UserStatusBadgeProps {
  status: UserStatus;
  showLabel?: boolean;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status, showLabel = true }) => {
  const getStatusConfig = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return { 
          label: 'Đang hoạt động', 
          className: 'bg-green-500',
          icon: '🟢'
        };
      case UserStatus.INACTIVE:
        return { 
          label: 'Không hoạt động', 
          className: 'bg-red-500',
          icon: '🔴'
        };
      case UserStatus.PENDING:
        return { 
          label: 'Chờ kích hoạt', 
          className: 'bg-yellow-500',
          icon: '🟡'
        };
      case UserStatus.LOCKED:
        return { 
          label: 'Đã khóa', 
          className: 'bg-gray-500',
          icon: '⚫'
        };
      default:
        return { 
          label: 'Không xác định', 
          className: 'bg-gray-400',
          icon: '⚪'
        };
    }
  };

  const { label, className, icon } = getStatusConfig(status);

  return (
    <Badge className={className}>
      {!showLabel ? icon : label}
    </Badge>
  );
};
