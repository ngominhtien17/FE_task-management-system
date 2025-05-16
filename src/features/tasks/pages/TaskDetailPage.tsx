// src/features/task/pages/TaskDetailPage.tsx

import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { X, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

import { TaskStatusBadge } from "../components/TaskStatusBadge";
import { TaskPriorityBadge } from "../components/TaskPriorityBadge";
import { TaskComment } from "../types";
import type { Task } from "../types";

// Mock data for the task detail
const MOCK_TASK: Task = {
  id: "1",
  title: "Cập nhật báo cáo NCKH",
  description: "Cập nhật báo cáo tiến độ nghiên cứu khoa học theo mẫu mới. Bao gồm các nội dung:\n- Tình hình thực hiện so với kế hoạch\n- Các kết quả đạt được\n- Khó khăn, vướng mắc và đề xuất\n- Kế hoạch tiếp theo",
  assignee: "Nguyễn Văn A",
  deadline: "10/05/2025 17:00",
  priority: "high",
  status: "overdue",
  startDate: "05/05/2025",
  category: ["Báo cáo", "NCKH"],
  department: "Bộ môn CNPM",
  creator: "Trưởng bộ môn",
  type: "Cá nhân",
  progress: 60,
  lastUpdate: "09/05/2025 10:35 - \"Đã hoàn thành phần 1 và 2, đang xử lý phần 3\"",
  attachments: [
    { id: "1", name: "Mẫu báo cáo NCKH 2025.docx", type: "docx", url: "#" },
    { id: "2", name: "Báo cáo_draft_v1.docx", type: "docx", url: "#" }
  ],
  comments: [
    { id: "1", author: "Trưởng bộ môn", content: "Nhớ cập nhật theo mẫu mới và bổ sung phần kinh phí đã sử dụng.", createdAt: "08/05/2025 14:20" },
    { id: "2", author: "Nguyễn Văn A", content: "Tôi đang cập nhật theo mẫu mới. Sẽ hoàn thành đúng hạn.", createdAt: "09/05/2025 10:30" },
    { id: "3", author: "Trưởng khoa", position: "Trưởng khoa", content: "Cần hoàn thành sớm để kịp tổng hợp báo cáo chung toàn khoa.", createdAt: "09/05/2025 15:45" }
  ]
};


interface TaskDetailProps {
  taskId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function TaskDetailPage({ taskId, isOpen, onClose }: TaskDetailProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [newComment, setNewComment] = useState("");
  const [task] = useState<Task>(MOCK_TASK);
  
  // Xác định mode hiển thị dựa trên context routing
  const isRouteMode = location.pathname.includes('/task/detail/');
  
  // Lấy taskId từ params nếu ở chế độ route
  const effectiveTaskId = isRouteMode ? params.id : taskId;
    
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (isRouteMode) {
      // Nếu đang ở chế độ route, quay lại trang trước đó (có thể là kanban hoặc list)
      navigate(-1);
    } else {
      // Mặc định quay về trang danh sách
      navigate("/task");
    }
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    
    // In a real app, we would add the comment to the task
    console.log("Sending comment:", newComment);
    setNewComment("");
  };
  
    // Cập nhật phương thức xử lý sự kiện trong TaskDetailPage.tsx
  const handleUpdateProgress = () => {
    navigate(`/task/progress/${task.id}`);
  };

  const handleRequestExtension = () => {
    navigate(`/task/extend/${task.id}`);
  };

  const handleCompleteTask = () => {
    navigate(`/task/complete/${task.id}`);
  };

    // Thêm hàm kiểm tra quyền để hiển thị các hành động phù hợp
  const isManager = true; // Mô phỏng kiểm tra quyền quản lý
  const isCreator = task.creator === "Nguyễn Văn A"; // Mô phỏng kiểm tra người tạo
  const isAssignee = task.assignee === "Nguyễn Văn A"; // Mô phỏng kiểm tra người được giao

  // Phương thức hiển thị các nút hành động phù hợp
  const renderActionButtons = () => {
    const buttons = [];
    
    // Nút quay lại luôn hiển thị
    buttons.push(
      <Button key="back" variant="outline" onClick={handleClose}>
        Quay lại
      </Button>
    );
    
    // Các nút tùy theo trạng thái
    if (isManager || isCreator) {
      buttons.push(
        <Button key="edit" variant="outline">
          Chỉnh sửa
        </Button>
      );
    }
    
    if (isAssignee && (task.status === "not_started" || task.status === "in_progress" || task.status === "overdue")) {
      buttons.push(
        <Button key="update" variant="outline" onClick={handleUpdateProgress}>
          Cập nhật tiến độ
        </Button>
      );
    }
    
    if (isAssignee && (task.status === "in_progress" || task.status === "overdue")) {
      buttons.push(
        <Button key="extension" variant="outline" onClick={handleRequestExtension}>
          Yêu cầu gia hạn
        </Button>
      );
      
      buttons.push(
        <Button key="complete" onClick={handleCompleteTask}>
          Báo cáo hoàn thành
        </Button>
      );
    }
    
    if (isManager && task.status === "completed") {
      buttons.push(
        <Button key="evaluate" onClick={() => navigate(`/task/evaluate/${task.id}`)}>
          Đánh giá công việc
        </Button>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-3">
        {buttons}
      </div>
    );
  };

  const renderTaskDetail = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
          <div className="mt-2 flex items-center gap-2">
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">📝 Mô tả</h3>
        <div className="text-gray-600 whitespace-pre-line">
          {task.description}
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">📋 Thông tin chi tiết</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex items-start gap-2">
            <span className="text-gray-500 min-w-28">Ngày bắt đầu:</span>
            <span className="text-gray-700">{task.startDate}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-500 min-w-28">Deadline:</span>
            <span className="text-gray-700 font-medium">{task.deadline}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-500 min-w-28">Danh mục:</span>
            <span className="text-gray-700">{task.category?.join(", ")}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-500 min-w-28">Loại công việc:</span>
            <span className="text-gray-700">{task.type}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-500 min-w-28">Đơn vị:</span>
            <span className="text-gray-700">{task.department}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-500 min-w-28">Người tạo:</span>
            <span className="text-gray-700">{task.creator}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">👤 Người thực hiện</h3>
        <div className="text-gray-700">{task.assignee}</div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">📈 Tiến độ</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
          <div className="text-sm text-gray-500">
            Cập nhật gần nhất: {task.lastUpdate}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">📎 Tài liệu đính kèm</h3>
        <div className="space-y-2">
          {task.attachments && task.attachments.map(attachment => (
            <div key={attachment.id} className="flex items-center gap-2 text-gray-700">
              <span>[📄]</span>
              <a href={attachment.url} className="text-blue-600 hover:underline">
                {attachment.name}
              </a>
            </div>
          ))}
          <Button variant="outline" size="sm" className="mt-2">
            <Paperclip size={16} className="mr-1" />
            Thêm tài liệu
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          💬 Nhận xét ({task.comments?.length || 0})
        </h3>
        <div className="space-y-4">
          {task.comments && task.comments.map(comment => (
            <div key={comment.id} className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-800">{comment.author}</span>
                {comment.position && (
                  <span className="text-gray-500 text-sm">- {comment.position}</span>
                )}
                <span className="text-gray-400 text-sm">- {comment.createdAt}</span>
              </div>
              <p className="text-gray-600">{comment.content}</p>
            </div>
          ))}
          
          <div className="flex gap-2 mt-4">
            <Textarea
              placeholder="Thêm nhận xét..."
              className="min-h-20 text-gray-700"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white self-end"
              size="sm"
              onClick={handleSendComment}
              disabled={!newComment.trim()}
            >
              <Send size={16} className="mr-1" />
              Gửi
            </Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex flex-wrap gap-3">
        {renderActionButtons()}
      </div>
    </div>
  );

  // Quyết định phương thức hiển thị dựa trên ngữ cảnh routing
  if (isRouteMode) {
    // Hiển thị dạng trang độc lập (khi được truy cập qua URL)
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết công việc</h1>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X size={20} />
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {renderTaskDetail()}
        </div>
      </div>
    );
  }
  
  // Hiển thị dạng dialog (khi được gọi từ component khác)
  // Điều chỉnh CSS cho DialogContent để khắc phục vấn đề trong suốt
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl bg-white" style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        zIndex: 50,
        backgroundColor: "white", // Đảm bảo nền trắng đậm
        backdropFilter: "none" // Vô hiệu hóa hiệu ứng mờ nếu có
      }}>
        <DialogHeader>
          <DialogTitle className="text-xl">Chi tiết công việc</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-10rem)] pr-4">
          {renderTaskDetail()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default TaskDetailPage;