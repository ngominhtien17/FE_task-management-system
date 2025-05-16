// src/features/tasks/pages/FeedbackResponsePage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  status: "completed",
};

interface EvaluationFeedbackData {
  evaluationDate: string;
  evaluator: string;
  evaluationResult: string;
  evaluationComments: string;
  feedback: string;
  explanation: string;
  reconsiderationRequest: string;
}

export function FeedbackResponsePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [task] = useState<Task>(MOCK_TASK);
  const [formData, setFormData] = useState<EvaluationFeedbackData>({
    evaluationDate: "13/05/2025",
    evaluator: "Trưởng bộ môn",
    evaluationResult: "Hoàn thành tích cực",
    evaluationComments: "Đề cương bài giảng được xây dựng đáp ứng tốt các yêu cầu mới, có đầy đủ các thành phần cần thiết. Đặc biệt là việc mapping chuẩn đầu ra với hoạt động dạy học được thực hiện rõ ràng và chi tiết.\n\nCác tài liệu tham khảo được cập nhật, phù hợp với xu hướng hiện tại. Phần phương pháp đánh giá được mô tả cụ thể, đa dạng và gắn với chuẩn đầu ra.",
    feedback: "Tôi đồng ý với hầu hết các nhận xét đánh giá. Tuy nhiên, về điểm cần cải thiện thứ nhất \"Một số hoạt động dạy học còn chưa phù hợp với môi trường trực tuyến\", tôi đã thiết kế các hoạt động này dựa trên phương pháp giảng dạy kết hợp (blended learning) theo đề xuất của Phòng Đào tạo.",
    explanation: "Về hoạt động dạy học trực tuyến, tôi đã tham khảo tài liệu hướng dẫn \"Thiết kế hoạt động dạy học trực tuyến\" của Trung tâm E-learning và đã áp dụng các phương pháp như:\n\n1. Sử dụng công cụ Mentimeter cho hoạt động tương tác\n2. Thiết kế các phòng thảo luận nhỏ (breakout rooms)\n3. Kết hợp học không đồng bộ thông qua các bài tập trên LMS\n\nTôi đã ghi nhận các điểm cần cải thiện khác và sẽ bổ sung trong phiên bản tiếp theo.",
    reconsiderationRequest: "Tôi không đề xuất xem xét lại kết quả đánh giá. Tuy nhiên, tôi mong nhận được thêm hướng dẫn cụ thể về việc thiết kế các hoạt động dạy học phù hợp hơn với môi trường trực tuyến."
  });
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting feedback response:", formData);
    // In a real app, we would send the data to the server
    navigate(`/task/detail/${id}`);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Phản hồi đánh giá</h1>
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
          <p>Kết quả đánh giá: {formData.evaluationResult}</p>
          <p>Người đánh giá: {formData.evaluator}</p>
          <p>Ngày đánh giá: {formData.evaluationDate}</p>
        </div>
        
        <div className="p-4 border rounded-md bg-gray-50 mb-6">
          <h3 className="font-medium text-gray-800 mb-2">Nhận xét đánh giá:</h3>
          <p className="text-gray-700 whitespace-pre-line">{formData.evaluationComments}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="feedback" className="text-gray-700 font-medium">Ý kiến về kết quả đánh giá</Label>
            <Textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleTextChange}
              placeholder="Nêu ý kiến của bạn về kết quả đánh giá"
              className="min-h-24"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="explanation" className="text-gray-700 font-medium">Giải thích bổ sung (nếu cần)</Label>
            <Textarea
              id="explanation"
              name="explanation"
              value={formData.explanation}
              onChange={handleTextChange}
              placeholder="Cung cấp thêm thông tin giải thích hoặc làm rõ"
              className="min-h-32"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="reconsiderationRequest" className="text-gray-700 font-medium">Đề xuất xem xét lại (nếu có)</Label>
            <Textarea
              id="reconsiderationRequest"
              name="reconsiderationRequest"
              value={formData.reconsiderationRequest}
              onChange={handleTextChange}
              placeholder="Nêu đề xuất xem xét lại kết quả đánh giá nếu cần"
              className="min-h-24"
            />
          </div>
          
          <Separator />
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Quay lại
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Gửi phản hồi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackResponsePage;