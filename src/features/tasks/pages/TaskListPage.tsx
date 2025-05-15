// src/features/task/pages/TaskListPage.tsx

import { useState } from "react";
import { TaskDetailPage } from "../pages/TaskDetailPage";
import { Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import { TaskFilter } from "../components/TaskFilter";
import { TaskTabBar } from "../components/TaskTabBar";
import { TaskViewToggle } from "../components/TaskViewToggle";
import { TaskStatusBadge } from "../components/TaskStatusBadge";
import { TaskPriorityBadge } from "../components/TaskPriorityBadge"
import { Task } from "../types";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Cập nhật báo cáo NCKH",
    description: "Cập nhật báo cáo tiến độ nghiên cứu khoa học theo mẫu mới",
    assignee: "Nguyễn Văn A",
    deadline: "Hôm nay",
    priority: "high",
    status: "overdue",
    progress: 60,
    lastUpdate: "09/05/2025 10:35"
  },
  {
    id: "2",
    title: "Hoàn thiện đề cương bài giảng",
    description: "Soạn đề cương chi tiết cho môn học mới",
    assignee: "Trần Thị B",
    deadline: "12/05/2025",
    priority: "medium",
    status: "in_progress",
  },
  {
    id: "3",
    title: "Đánh giá sinh viên thực tập",
    description: "Đánh giá báo cáo và kết quả thực tập của sinh viên",
    assignee: "Lê Văn C",
    deadline: "15/05/2025",
    priority: "low",
    status: "in_progress",
  },
  {
    id: "4",
    title: "Soạn đề thi cuối kỳ",
    description: "Soạn đề thi kết thúc học phần",
    assignee: "Phạm Thị D",
    deadline: "18/05/2025",
    priority: "high",
    status: "pending",
  },
  {
    id: "5",
    title: "Họp hội đồng khoa học",
    description: "Tham dự họp hội đồng khoa học cấp trường",
    assignee: "Vũ Minh E",
    deadline: "20/05/2025",
    priority: "medium",
    status: "pending",
  },
  {
    id: "6",
    title: "Chuẩn bị tài liệu hội nghị",
    description: "Chuẩn bị tài liệu cho hội nghị khoa học sắp tới",
    assignee: "Hoàng Văn F",
    deadline: "22/05/2025",
    priority: "low",
    status: "not_started",
  },
  {
    id: "7",
    title: "Viết bài báo khoa học",
    description: "Hoàn thành bài báo khoa học để gửi đăng tạp chí",
    assignee: "Nguyễn Văn G",
    deadline: "25/05/2025",
    priority: "high",
    status: "not_started",
  },
  {
    id: "8",
    title: "Hướng dẫn sinh viên NCKH",
    description: "Hướng dẫn nhóm sinh viên thực hiện đề tài NCKH",
    assignee: "Trần Thị H",
    deadline: "27/05/2025",
    priority: "medium",
    status: "not_started",
  },
];

export function TaskListPage() {
  const navigate = useNavigate();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [currentView, setCurrentView] = useState<"table" | "kanban">("table");
  
  // Thêm state để kiểm soát việc hiển thị TaskDetail dưới dạng dialog
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(MOCK_TASKS.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };
  
  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };
  
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search logic
  };
  
  const handleFilter = (filters: Record<string, any>) => {
    console.log("Apply filters:", filters);
    // Implement filter logic
  };
  
  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    console.log("Sort by:", field, direction);
    // Implement sort logic
  };
  
  const handleViewTask = (taskId: string) => {
    // Can be implemented as a modal or navigation to detail page
    // 1. Hiển thị dưới dạng dialog
    setSelectedTaskId(taskId);
    setShowTaskDetail(true);

    // 2. Hoặc điều hướng đến trang chi tiết
    // navigate(`/task/detail/${taskId}`);
  };
  
  const handleCreateTask = () => {
    navigate("/task/create");
  };

  const handleCloseTaskDetail = () => {
    setShowTaskDetail(false);
  };

  const handleViewChange = (view: "table" | "kanban") => {
    if (view === "kanban") {
      navigate("/task/kanban");
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Công Việc</h1>
        <Button 
          onClick={handleCreateTask}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={18} className="mr-1" /> Tạo công việc
        </Button>
      </div>
      
      <div className="grid gap-4">
        <TaskFilter 
          onSearch={handleSearch} 
          onFilter={handleFilter} 
          onSort={handleSort} 
        />
        
        <div className="flex items-center justify-between">
          <TaskTabBar 
            currentTab={currentTab} 
            onChange={setCurrentTab} 
          />
          
          <TaskViewToggle 
            view={currentView} 
            onViewChange={handleViewChange} 
          />
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedTasks.length === MOCK_TASKS.length} 
                    onCheckedChange={handleSelectAll} 
                    aria-label="Select all tasks"
                  />
                </TableHead>
                <TableHead className="w-1/3">Tiêu đề</TableHead>
                <TableHead>Người thực hiện</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Ưu tiên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TASKS.map((task) => (
                <TableRow 
                  key={task.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewTask(task.id)}
                >
                  <TableCell className="p-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedTasks.includes(task.id)} 
                      onCheckedChange={(checked) => handleSelectTask(task.id, !!checked)} 
                      aria-label={`Select task ${task.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {task.title}
                  </TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>
                    <TaskPriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell>
                    <TaskStatusBadge status={task.status} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical size={16} />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewTask(task.id)}>
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuItem>Cập nhật trạng thái</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">8</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              <div className="flex items-center gap-2">
                <Select defaultValue="8">
                  <SelectTrigger className="w-24 bg-white">
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 / trang</SelectItem>
                    <SelectItem value="8">8 / trang</SelectItem>
                    <SelectItem value="10">10 / trang</SelectItem>
                    <SelectItem value="20">20 / trang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Thêm điều kiện hiển thị TaskDetailPage */}
      {showTaskDetail && selectedTaskId && (
        <TaskDetailPage 
          taskId={selectedTaskId} 
          isOpen={showTaskDetail} 
          onClose={handleCloseTaskDetail} 
        />
      )}
    </div>
  );
}

export default TaskListPage;