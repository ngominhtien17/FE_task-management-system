// src/features/users/components/UserTabBar.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface UserTabBarProps {
  currentTab: string;
  onChange: (tab: string) => void;
  counts: {
    all: number;
    active: number;
    inactive: number;
    pending: number;
  };
}

export const UserTabBar: React.FC<UserTabBarProps> = ({
  currentTab,
  onChange,
  counts
}) => {
  const tabs = [
    { key: 'all', label: 'Tất cả', count: counts.all },
    { key: 'active', label: 'Đang hoạt động', count: counts.active },
    { key: 'inactive', label: 'Không hoạt động', count: counts.inactive },
    { key: 'pending', label: 'Chờ kích hoạt', count: counts.pending },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant={currentTab === tab.key ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChange(tab.key)}
          className={`relative ${
            currentTab === tab.key 
              ? 'bg-white shadow-sm' 
              : 'hover:bg-gray-200'
          }`}
        >
          {tab.label}
          {tab.count > 0 && (
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
              currentTab === tab.key
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-300 text-gray-600'
            }`}>
              {tab.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};
