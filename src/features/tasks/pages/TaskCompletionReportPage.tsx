// src/features/tasks/pages/TaskCompletionReportPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { FileUploadArea } from "../components/FileUploadArea";
import { TaskStatusBadge } from "../components/TaskStatusBadge";
import { TaskPriorityBadge } from "../components/TaskPriorityBadge";
import type { Task } from "../types";

// Mock task for demonstration
const MOCK_TASK: Task = {
  id: "2",
  title: "Hoàn thiện đề cương bài giảng",
  description: "Soạn đề cương chi tiết cho môn học mới",
  assignee: "Trần Thị B",
  deadline: "12/05/2025",
  priority: "medium",
  status: "in_progress",
};

// Mock attachments
const MOCK_ATTACHMENTS = [
  { id: "1", name: "Đề cương LTHĐT_HK1_2025-2026_final.docx", size: 1845000 },
  { id: "2", name: "Bảng mapping_CĐR_hoạt động dạy học.xlsx", size: 925000 }
];

interface CompletionReportFormData {
  taskId: string;
  completionDate: Date | null;
  report: string;
  attachments: File[];
  hoursSpent: number;
  improvements: string;
  selfEvaluation: "not_met" | "minimal" | "met" | "exceeded" | "excellent";
}

export function TaskCompletionReportPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [task] = useState<Task>(MOCK_TASK);
  const [formData, setFormData] = useState<CompletionReportFormData>({
    taskId: id || "2",
    completionDate: new Date(),
    report: "Đã hoàn thành việc xây dựng đề cương bài giảng cho môn Lập trình hướng đối tượng theo mẫu mới. Đề cương bao gồm đầy đủ các phần:\n\n1. Thông tin chung về môn học\n2. Mục tiêu và chuẩn đầu ra\n3. Nội dung chi tiết và phương pháp giảng dạy\n4. Tài liệu tham khảo cập nhật\n5. Phương thức đánh giá\n\nĐề cương đã được rà soát và điều chỉnh theo góp ý của Tổ Đảm bảo chất lượng.",
    attachments: [],
    hoursSpent: 12,
    improvements: "Nên xây dựng thêm thư viện các hoạt động dạy học theo chuẩn đầu ra để các giảng viên có thể tham khảo khi xây dựng đề cương.",
    selfEvaluation: "met"
  });
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "hoursSpent") {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, completionDate: date || null }));
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
  
  const handleEvaluationChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      selfEvaluation: value as "not_met" | "minimal" | "met" | "exceeded" | "excellent" 
    }));
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting completion report:", formData);
    // In a real app, we would send the data to the server
    navigate(`/task/detail/${id}`);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Báo cáo hoàn thành công việc</h1>
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
          <div className="space-y-3">
            <Label htmlFor="completionDate" className="text-gray-700 font-medium">Ngày hoàn thành*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.completionDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.completionDate ? format(formData.completionDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={formData.completionDate || undefined}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="report" className="text-gray-700 font-medium">Báo cáo tổng kết*</Label>
            <Textarea
              id="report"
              name="report"
              value={formData.report}
              onChange={handleTextChange}
              placeholder="Mô tả chi tiết kết quả đã hoàn thành"
              className="min-h-40"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="attachments" className="text-gray-700 font-medium">Sản phẩm cuối cùng*</Label>
            <FileUploadArea
              onFilesSelected={handleFilesSelected}
              existingFiles={MOCK_ATTACHMENTS}
              onRemoveFile={handleRemoveFile}
              onRemoveExistingFile={handleRemoveExistingFile}
              placeholder="Tải lên sản phẩm cuối cùng của công việc"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="hoursSpent" className="text-gray-700 font-medium">Thời gian thực tế sử dụng (giờ)*</Label>
            <Input
              id="hoursSpent"
              name="hoursSpent"
              type="number"
              min="0"
              value={formData.hoursSpent}
              onChange={handleTextChange}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="improvements" className="text-gray-700 font-medium">Đề xuất cải tiến (nếu có)</Label>
            <Textarea
              id="improvements"
              name="improvements"
              value={formData.improvements}
              onChange={handleTextChange}
              placeholder="Đề xuất các cải tiến cho quy trình hoặc phương pháp làm việc"
              className="min-h-20"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Tự đánh giá</Label>
            <RadioGroup
              value={formData.selfEvaluation}
              onValueChange={handleEvaluationChange}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_met" id="not_met" />
                <Label htmlFor="not_met" className="font-normal">Không đạt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="minimal" id="minimal" />
                <Label htmlFor="minimal" className="font-normal">Đạt yêu cầu tối thiểu</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="met" id="met" />
                <Label htmlFor="met" className="font-normal">Đạt yêu cầu</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exceeded" id="exceeded" />
                <Label htmlFor="exceeded" className="font-normal">Vượt yêu cầu</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent" className="font-normal">Xuất sắc</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Quay lại
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Xác nhận hoàn thành
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskCompletionReportPage;