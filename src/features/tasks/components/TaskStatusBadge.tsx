// src/features/task/components/TaskStatusBadge.tsx

import { statusConfig } from "../types";
import type { TaskStatus } from "../types"

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function TaskStatusBadge({ status, className = "" }: TaskStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${config.color} ${className}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
