// src/features/task/components/TaskPriorityBadge.tsx

import { priorityConfig } from "../types";
import type { TaskPriority } from "../types";

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
  iconOnly?: boolean;
}

export function TaskPriorityBadge({ 
  priority, 
  className = "",
  iconOnly = false
}: TaskPriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium ${config.color} ${className}`}>
      <span>{config.icon}</span>
      {!iconOnly && <span>{config.label}</span>}
    </span>
  );
}

export default TaskPriorityBadge;