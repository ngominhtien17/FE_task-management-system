// src/features/tasks/pages/TaskEvaluationPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { Label } from "@/common/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/common/components/ui/radio-group";
import { Separator } from "@/common/components/ui/separator";
import { TaskStatusBadge } from "../components/TaskStatusBadge";
import { TaskPriorityBadge } from "../components/TaskPriorityBadge";
import type { Task } from "../types";
import { Alert, AlertDescription, AlertTitle } from "@/common/components/ui/alert";
// Mock task for demonstration
const MOCK_TASK: Task = {
  id: "2",
  title: "Hoàn thiện đề cương bài giảng",
  description: "Soạn đề cương chi tiết cho môn học mới",
  assignee: "Trần Thị B",
  deadline: "12/05/2025",
  priority: "medium",
  status: "completed",
};

interface TaskEvaluationFormData {
  taskId: string;
  completionDate: string;
  assignee: string;
  evaluation: "unsatisfactory" | "poor" | "satisfactory" | "good" | "excellent";
  comments: string;
  strengths: string;
  weaknesses: string;
  suggestions: string;
  approval: "approved" | "revisions" | "rejected";
}

export function TaskEvaluationPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [task] = useState<Task>(MOCK_TASK);
  const [formData, setFormData] = useState<TaskEvaluationFormData>({
    taskId: id || "2",
    completionDate: "12/05/2025",
    assignee: "Trần Thị B",
    evaluation: "good",
    comments: "Đề cương bài giảng được xây dựng đáp ứng tốt các yêu cầu mới, có đầy đủ các thành phần cần thiết. Đặc biệt là việc mapping chuẩn đầu ra với hoạt động dạy học được thực hiện rõ ràng và chi tiết.\n\nCác tài liệu tham khảo được cập nhật, phù hợp với xu hướng hiện tại. Phần phương pháp đánh giá được mô tả cụ thể, đa dạng và gắn với chuẩn đầu ra.",
    strengths: "1. Cấu trúc đề cương logic, dễ theo dõi\n2. Cập nhật các tài liệu tham khảo mới từ 2023-2025\n3. Phương pháp giảng dạy đa dạng, kết hợp lý thuyết và thực hành\n4. Bảng mapping CĐR với hoạt động dạy học chi tiết, có tính ứng dụng",
    weaknesses: "1. Một số hoạt động dạy học còn chưa phù hợp với môi trường trực tuyến\n2. Cần bổ sung thêm ví dụ thực tế trong phần nội dung chi tiết\n3. Có thể tăng cường các hoạt động đánh giá theo nhóm",
    suggestions: "Nên bổ sung thêm các hoạt động học tập trải nghiệm và dự án thực tế cho sinh viên. Việc xây dựng thư viện hoạt động dạy học theo CĐR là đề xuất rất hay, có thể nghiên cứu triển khai trong thời gian tới.",
    approval: "approved"
  });
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEvaluationChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      evaluation: value as "unsatisfactory" | "poor" | "satisfactory" | "good" | "excellent" 
    }));
  };
  
  const handleApprovalChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      approval: value as "approved" | "revisions" | "rejected" 
    }));
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting task evaluation:", formData);
    // In a real app, we would send the data to the server
    navigate(`/task/detail/${id}`);
  };

  // Thêm nút chuyển tới trang phản hồi đánh giá
  const handleSubmitAndLinkToFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting task evaluation:", formData);
    // Mô phỏng gửi đánh giá và chuyển đến trang phản hồi
    navigate(`/task/feedback/${id}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Đánh giá công việc</h1>
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
        
        <div className="mb-6 space-y-2 text-gray-700">
          <p>Đã gửi báo cáo hoàn thành ngày: {formData.completionDate}</p>
          <p>Người thực hiện: {formData.assignee}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Kết quả đánh giá*</Label>
            <RadioGroup
              value={formData.evaluation}
              onValueChange={handleEvaluationChange}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unsatisfactory" id="unsatisfactory" />
                <Label htmlFor="unsatisfactory" className="font-normal">Không hoàn thành</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="poor" />
                <Label htmlFor="poor" className="font-normal">Hoàn thành yếu</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="satisfactory" id="satisfactory" />
                <Label htmlFor="satisfactory" className="font-normal">Hoàn thành</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good" className="font-normal">Hoàn thành tích cực</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent" className="font-normal">Hoàn thành xuất sắc</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="comments" className="text-gray-700 font-medium">Nhận xét chi tiết*</Label>
            <Textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleTextChange}
              placeholder="Nhận xét chi tiết về kết quả công việc"
              className="min-h-32"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="strengths" className="text-gray-700 font-medium">Điểm mạnh</Label>
            <Textarea
              id="strengths"
              name="strengths"
              value={formData.strengths}
              onChange={handleTextChange}
              placeholder="Liệt kê các điểm mạnh của công việc"
              className="min-h-24"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="weaknesses" className="text-gray-700 font-medium">Điểm cần cải thiện</Label>
            <Textarea
              id="weaknesses"
              name="weaknesses"
              value={formData.weaknesses}
              onChange={handleTextChange}
              placeholder="Liệt kê các điểm cần cải thiện"
              className="min-h-24"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="suggestions" className="text-gray-700 font-medium">Đề xuất cải tiến</Label>
            <Textarea
              id="suggestions"
              name="suggestions"
              value={formData.suggestions}
              onChange={handleTextChange}
              placeholder="Đề xuất cải tiến cho công việc tương tự trong tương lai"
              className="min-h-24"
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Phê duyệt</Label>
            <RadioGroup
              value={formData.approval}
              onValueChange={handleApprovalChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approved" id="approved" />
                <Label htmlFor="approved" className="font-normal">Phê duyệt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="revisions" id="revisions" />
                <Label htmlFor="revisions" className="font-normal">Yêu cầu chỉnh sửa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rejected" id="rejected" />
                <Label htmlFor="rejected" className="font-normal">Từ chối</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Quay lại
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Xác nhận đánh giá
            </Button>
          </div>
        </form>
      </div>
      // Thêm thông báo sau khi gửi đánh giá thành công
      <Alert className="mt-4 bg-green-50 border-green-200">
        <AlertCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Đánh giá đã được gửi thành công</AlertTitle>
        <AlertDescription>
          Người thực hiện có thể xem đánh giá và gửi phản hồi. Bạn có thể xem phản hồi 
          <Button 
            variant="link" 
            className="p-0 h-auto text-blue-600" 
            onClick={() => navigate(`/task/feedback/${id}`)}
          >
            tại đây
          </Button>.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default TaskEvaluationPage;