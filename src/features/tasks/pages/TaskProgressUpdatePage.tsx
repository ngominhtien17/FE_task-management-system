// src/features/tasks/pages/TaskProgressUpdatePage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, FileText, Upload } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Textarea } from "@/common/components/ui/textarea";
import { Label } from "@/common/components/ui/label";
import { Separator } from "@/common/components/ui/separator";
import { ProgressSlider } from "../components/ProgressSlider";
import { FileUploadArea } from "../components/FileUploadArea";
import { TaskStatusBadge } from "../components/TaskStatusBadge";
import { TaskPriorityBadge } from "../components/TaskPriorityBadge";
import { WorkflowStateIndicator } from "../components/WorkflowStateIndicator";
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
  progress: 60,
  lastUpdate: "09/05/2025 10:35"
};

// Mock attachments
const MOCK_ATTACHMENTS = [
  { id: "1", name: "Báo cáo NCKH_phần 1&2_10052025.docx", size: 2456000 }
];

interface ProgressUpdateFormData {
  taskId: string;
  progress: number;
  description: string;
  attachments: File[];
  issues: string;
  supportRequest: string;
}

export function TaskProgressUpdatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [task] = useState<Task>(MOCK_TASK);
  const [formData, setFormData] = useState<ProgressUpdateFormData>({
    taskId: id || "1",
    progress: 60,
    description: "Đã hoàn thành:\n- Phần 1: Tình hình thực hiện (100%)\n- Phần 2: Kết quả đạt được (100%)\n\nĐang thực hiện:\n- Phần 3: Khó khăn và đề xuất (30%)\n\nChưa bắt đầu:\n- Phần 4: Kế hoạch tiếp theo",
    attachments: [],
    issues: "Một số số liệu trong phần 3 cần được xác minh lại với phòng NCKH để đảm bảo tính chính xác.",
    supportRequest: "Cần được cung cấp thêm thông tin về yêu cầu báo cáo kế hoạch tiếp theo để hoàn thiện phần 4."
  });
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProgressChange = (progress: number) => {
    setFormData(prev => ({ ...prev, progress }));
  };
  
  const handleFilesSelected = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };
  
  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };
  
  const handleRemoveExistingFile = (id: string) => {
    console.log("Remove existing file:", id);
    // In a real app, we would send a request to remove the file
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting progress update:", formData);
    // In a real app, we would send the data to the server
    navigate(`/task/detail/${id}`);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cập nhật tiến độ công việc</h1>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X size={20} />
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <WorkflowStateIndicator 
          currentStatus={task.status} 
          currentAction="Cập nhật tiến độ" 
        />
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
          <div className="space-y-3">
            <Label htmlFor="progress" className="text-gray-700 font-medium">Phần trăm hoàn thành*</Label>
            <ProgressSlider 
              value={formData.progress} 
              onChange={handleProgressChange} 
            />
            <p className="text-gray-600 font-medium mt-2">Tiến độ hiện tại: {formData.progress}%</p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="description" className="text-gray-700 font-medium">Mô tả công việc đã làm*</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleTextChange}
              placeholder="Mô tả chi tiết công việc đã làm, đang làm và chưa làm"
              className="min-h-40"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="attachments" className="text-gray-700 font-medium">Minh chứng/Sản phẩm</Label>
            <FileUploadArea
              onFilesSelected={handleFilesSelected}
              existingFiles={MOCK_ATTACHMENTS}
              onRemoveFile={handleRemoveFile}
              onRemoveExistingFile={handleRemoveExistingFile}
              placeholder="Tải lên minh chứng hoặc sản phẩm đã hoàn thành"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="issues" className="text-gray-700 font-medium">Vấn đề gặp phải (nếu có)</Label>
            <Textarea
              id="issues"
              name="issues"
              value={formData.issues}
              onChange={handleTextChange}
              placeholder="Mô tả các vấn đề, khó khăn gặp phải trong quá trình thực hiện"
              className="min-h-20"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="supportRequest" className="text-gray-700 font-medium">Đề xuất/Yêu cầu hỗ trợ (nếu có)</Label>
            <Textarea
              id="supportRequest"
              name="supportRequest"
              value={formData.supportRequest}
              onChange={handleTextChange}
              placeholder="Nêu các đề xuất hoặc yêu cầu hỗ trợ để hoàn thành công việc tốt hơn"
              className="min-h-20"
            />
          </div>
          
          <Separator />
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy bỏ
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Gửi báo cáo tiến độ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskProgressUpdatePage;