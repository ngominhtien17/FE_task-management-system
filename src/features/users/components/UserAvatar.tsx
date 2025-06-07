// src/features/users/components/UserAvatar.tsx
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import type { User } from '../types';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md' }) => {
  // Tính toán kích thước
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  }[size];

  // Lấy chữ cái đầu từ họ tên
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Avatar className={sizeClass}>
      <AvatarImage src={user.avatar} alt={user.fullName} />
      <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;