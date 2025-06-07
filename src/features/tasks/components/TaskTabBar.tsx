// src/features/task/components/TaskTabBar.tsx

import { Button } from "@/common/components/ui/button";
import { TabsList, TabsTrigger, Tabs } from "@/common/components/ui/tabs";

interface TaskTabProps {
  currentTab: string;
  onChange: (value: string) => void;
}

export function TaskTabBar({ currentTab, onChange }: TaskTabProps) {
  return (
    <Tabs value={currentTab} onValueChange={onChange} className="w-full">
      <TabsList className="mb-4 bg-transparent p-0 space-x-2">
        <TabsTrigger
          value="all"
          className="rounded px-5 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          Tất cả
        </TabsTrigger>
        <TabsTrigger
          value="mine"
          className="rounded px-5 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          Của tôi
        </TabsTrigger>
        <TabsTrigger
          value="pending"
          className="rounded px-5 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          Chờ xử lý
        </TabsTrigger>
        <TabsTrigger
          value="overdue"
          className="rounded px-5 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          Quá hạn
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="rounded px-5 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
        >
          Đã hoàn thành
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}