// src/features/task/pages/TaskKanbanPage.tsx

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TaskFilter } from "../components/TaskFilter";
import { TaskPriorityBadge } from "../components/TaskPriorityBadge";
import type { Task } from "../types";
import TaskDetailPage from "./TaskDetailPage";

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
    status: "not_started",
  },
  {
    id: "5",
    title: "Họp hội đồng khoa học",
    description: "Tham dự họp hội đồng khoa học cấp trường",
    assignee: "Vũ Minh E",
    deadline: "20/05/2025",
    priority: "medium",
    status: "not_started",
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
  {
    id: "9",
    title: "Biên soạn đề cương môn học",
    description: "Biên soạn đề cương chi tiết môn học mới",
    assignee: "Trần Thị B",
    deadline: "05/05/2025",
    priority: "medium",
    status: "completed",
  },
  {
    id: "10",
    title: "Soạn đề thi giữa kỳ",
    description: "Soạn đề thi giữa kỳ cho các lớp",
    assignee: "Phạm Thị D",
    deadline: "03/05/2025",
    priority: "medium",
    status: "completed",
  },
  {
    id: "11",
    title: "Tổ chức buổi seminar khoa",
    description: "Điều phối và tổ chức buổi seminar của khoa",
    assignee: "Vũ Minh E",
    deadline: "29/04/2025",
    priority: "high",
    status: "completed",
  },
];

// Kanban column configuration
const columns = [
  { id: "not_started", title: "Chưa bắt đầu", icon: "📋" },
  { id: "in_progress", title: "Đang thực hiện", icon: "🔄" },
  { id: "overdue", title: "Quá hạn", icon: "⚠️" },
  { id: "completed", title: "Hoàn thành", icon: "✓" },
];

// Định nghĩa lại component KanbanCard với chức năng điều hướng
interface KanbanCardProps {
  task: Task;
  onClick: (taskId: string) => void;
}

function KanbanCard({ task, onClick }: KanbanCardProps) {
  return (
    <div
      className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-3"
      onClick={() => onClick(task.id)}
    >
      <h3 className="font-medium text-gray-800 mb-2">{task.title}</h3>
      <div className="space-y-2">
        <div className="text-sm text-gray-600">{task.deadline}</div>
        <TaskPriorityBadge priority={task.priority} />
        <div className="text-sm text-gray-600">{task.assignee}</div>
      </div>
    </div>
  );
}

export function TaskKanbanPage() {
  const navigate = useNavigate();
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnWidth, setColumnWidth] = useState<number>(280); // Giá trị mặc định
  

   // Theo dõi kích thước container để điều chỉnh kích thước cột
   useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const totalColumns = columns.length;
        const gap = 24; // Khoảng cách giữa các cột (gap-6 = 1.5rem = 24px)
        
        // Tính toán kích thước tối ưu cho cột
        let optimalWidth = Math.floor((containerWidth - (gap * (totalColumns - 1))) / totalColumns);
        
        // Đảm bảo kích thước tối thiểu và tối đa
        optimalWidth = Math.max(220, Math.min(320, optimalWidth));
        
        setColumnWidth(optimalWidth);
      }
    };
    
    // Khởi tạo kích thước ban đầu
    handleResize();
    
    // Theo dõi thay đổi kích thước cửa sổ
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listener khi component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Filter tasks by status
  const getTasksByStatus = (status: string) => {
    return MOCK_TASKS.filter(task => task.status === status);
  };
  
  const handleCreateTask = () => {
    navigate("/task/create");
  };
  
  // // Xử lý điều hướng khi nhấp vào task
  // const handleTaskClick = (taskId: string) => {
  //   // Điều hướng đến trang chi tiết task
  //   navigate(`/task/detail/${taskId}`);
  // };
  
  const handleBackToList = () => {
    navigate("/task");
  };
  // Xử lý hiển thị dialog thay vì điều hướng
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowTaskDetail(true);
  };
  
  const handleCloseTaskDetail = () => {
    setShowTaskDetail(false);
    setSelectedTaskId(null);
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
  
  const handleAddTaskToColumn = (columnId: string) => {
    console.log("Add task to column:", columnId);
    // In a real implementation, this might pre-fill the status field when creating a new task
    navigate("/task/create");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Công Việc</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate("/task/workflow")}
            className="mr-2"
          >
            <Info size={18} className="mr-1" /> Hướng dẫn quy trình
          </Button>
          <Button 
            onClick={handleCreateTask}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={18} className="mr-1" /> Tạo công việc
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        <TaskFilter 
          onSearch={handleSearch} 
          onFilter={handleFilter} 
          onSort={handleSort} 
        />
        
        {/* Bố cục Kanban với scroll ngang và kích thước cột linh hoạt */}
        <div 
          ref={containerRef}
          className="grid grid-flow-col auto-cols-max gap-6 pb-6 overflow-x-auto pt-2 snap-x"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E0 #EDF2F7'
          }}
        >
          {columns.map(column => (
            <div 
              key={column.id} 
              className="snap-start rounded-lg"
              style={{ width: `${columnWidth}px` }}
            >
              <div className="bg-gray-50 rounded-lg p-4 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                    <span>{column.icon}</span>
                    <span>{column.title}</span>
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-200"
                    onClick={() => handleAddTaskToColumn(column.id)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                <Separator className="mb-4" />
                
                <div className="space-y-3 min-h-64">
                  {getTasksByStatus(column.id).map(task => (
                    <KanbanCard
                      key={task.id}
                      task={task}
                      onClick={handleTaskClick}
                    />
                  ))}
                  
                  {getTasksByStatus(column.id).length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Không có công việc
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full text-gray-500 hover:text-gray-700"
                    onClick={() => handleAddTaskToColumn(column.id)}
                  >
                    <Plus size={16} className="mr-1" /> Thêm công việc
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thêm TaskDetailPage dạng dialog */}
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

export default TaskKanbanPage;