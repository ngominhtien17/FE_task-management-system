// src/features/task/types/index.ts

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "not_started" | "in_progress" | "pending" | "overdue" | "completed";

export interface TaskAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface TaskComment {
  id: string;
  author: string;
  position?: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate?: string;
  category?: string[];
  department?: string;
  creator?: string;
  type?: string;
  progress?: number;
  lastUpdate?: string;
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
}

export const priorityConfig = {
  high: {
    color: "text-red-600 bg-red-50",
    icon: "🔴",
    label: "Cao"
  },
  medium: {
    color: "text-orange-600 bg-orange-50",
    icon: "🟠",
    label: "Trung bình"
  },
  low: {
    color: "text-green-600 bg-green-50",
    icon: "🟢",
    label: "Thấp"
  }
};

export const statusConfig = {
  not_started: {
    color: "text-slate-600 bg-slate-50",
    icon: "📝",
    label: "Chưa bắt đầu"
  },
  in_progress: {
    color: "text-blue-600 bg-blue-50",
    icon: "🔄",
    label: "Đang làm"
  },
  pending: {
    color: "text-amber-600 bg-amber-50",
    icon: "⏱️",
    label: "Chờ xử lý"
  },
  overdue: {
    color: "text-red-600 bg-red-50",
    icon: "⚠️",
    label: "Quá hạn"
  },
  completed: {
    color: "text-green-600 bg-green-50",
    icon: "✓",
    label: "Hoàn thành"
  }
};

export const Task = {};
export const TaskComment = {};