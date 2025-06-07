// src/features/tasks/pages/TaskExtensionRequestPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Calendar } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { Label } from "@/common/components/ui/label";
import { Separator } from "@/common/components/ui/separator";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/popover";
import { Calendar as CalendarComponent } from "@/common/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/common/utils/utils";
import { TaskStatusBadge } from "../components/TaskStatusBadge";
import { TaskPriorityBadge } from "../components/TaskPriorityBadge";
import type { Task } from "../types";

// Mock task for demonstration
const MOCK_TASK: Task = {
  id: "1",
  title: "Cập nhật báo cáo NCKH",
  description: "Cập nhật báo cáo tiến độ nghiên cứu khoa học theo mẫu mới",
  assignee: "Nguyễn Văn A",
  deadline: "10/05/2025",
  priority: "high",
  status: "overdue",
};

interface ExtensionRequestFormData {
  taskId: string;
  currentDeadline: string;
  requestedDeadline: Date | null;
  reason: string;
  currentProgress: string;
  plan: string;
}

export function TaskExtensionRequestPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [task] = useState<Task>(MOCK_TASK);
  const [formData, setFormData] = useState<ExtensionRequestFormData>({
    taskId: id || "1",
    currentDeadline: "10/05/2025",
    requestedDeadline: new Date("2025-05-15"),
    reason: "Cần thêm thời gian để hoàn thiện phần 3 và phần 4 của báo cáo vì:\n\n1. Đang chờ số liệu từ Phòng NCKH để hoàn thiện phần 3 về khó khăn và đề xuất. Dự kiến sẽ nhận được vào ngày 12/05.\n\n2. Cần tham khảo thêm ý kiến của đồng nghiệp về phần kế hoạch tiếp theo để đảm bảo tính khả thi.\n\n3. Hiện tại đang có công việc đột xuất từ Bộ môn cần xử lý.",
    currentProgress: "Đã hoàn thành 60% công việc:\n- Phần 1: Tình hình thực hiện (100%)\n- Phần 2: Kết quả đạt được (100%)\n- Phần 3: Khó khăn và đề xuất (30%)\n- Phần 4: Kế hoạch tiếp theo (0%)\n\nĐã hoàn thành bản nháp dự thảo cho các phần còn lại.",
    plan: "12/05: Nhận và xử lý số liệu từ Phòng NCKH\n13/05: Hoàn thiện phần 3 và gửi xin ý kiến\n14/05: Hoàn thiện phần 4 và rà soát toàn bộ báo cáo\n15/05: Hoàn thiện bản cuối và nộp báo cáo\n\nCam kết sẽ hoàn thành đúng tiến độ mới nếu được gia hạn."
  });
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, requestedDeadline: date || null }));
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting extension request:", formData);
    // In a real app, we would send the data to the server
    navigate(`/task/detail/${id}`);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Yêu cầu gia hạn công việc</h1>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X size={20} />
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col p-4 rounded-lg border border-gray-200 mb-6 bg-gray-50">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
            <div className="flex items-center gap-2">
              <TaskPriorityBadge priority={task.priority} />
              <TaskStatusBadge status={task.status} />
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Thời hạn hiện tại</Label>
            <div className="p-3 bg-gray-50 border rounded-md text-gray-700">{formData.currentDeadline}</div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="requestedDeadline" className="text-gray-700 font-medium">Thời hạn đề xuất*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.requestedDeadline && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.requestedDeadline ? format(formData.requestedDeadline, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={formData.requestedDeadline || undefined}
                  onSelect={handleDateChange}
                  initialFocus
                  disabled={(date) => {
                    // Disable dates before current deadline
                    return date < new Date("2025-05-10");
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="reason" className="text-gray-700 font-medium">Lý do gia hạn*</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleTextChange}
              placeholder="Nêu rõ lý do cần gia hạn thời gian"
              className="min-h-40"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="currentProgress" className="text-gray-700 font-medium">Tiến độ hiện tại*</Label>
            <Textarea
              id="currentProgress"
              name="currentProgress"
              value={formData.currentProgress}
              onChange={handleTextChange}
              placeholder="Mô tả tiến độ hiện tại của công việc"
              className="min-h-24"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="plan" className="text-gray-700 font-medium">Kế hoạch thực hiện*</Label>
            <Textarea
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleTextChange}
              placeholder="Trình bày kế hoạch chi tiết để hoàn thành công việc trong thời hạn mới"
              className="min-h-24"
              required
            />
          </div>
          
          <Separator />
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy bỏ
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Gửi yêu cầu gia hạn
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskExtensionRequestPage;