// src/features/tasks/pages/BatchAssignmentPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Mock data
interface AssignmentStaff {
  id: string;
  name: string;
  department: string;
}

const MOCK_STAFF: AssignmentStaff[] = [
  { id: "1", name: "Trần Thị B", department: "Bộ môn KTPM" },
  { id: "2", name: "Lê Văn C", department: "Bộ môn CNPM" },
  { id: "3", name: "Phạm Thị D", department: "Bộ môn HTTT" },
  { id: "4", name: "Vũ Minh E", department: "Bộ môn MMT" },
  { id: "5", name: "Hoàng Văn F", department: "Phòng Đào Tạo" },
];

interface BatchAssignmentFormData {
  selectedTasks: string[];
  assignmentType: "uniform" | "matrix" | "automatic";
  assigneeType: "individual" | "group";
  selectedAssignees: string[];
  instructions: string;
  step: number;
}

export function BatchAssignmentPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<BatchAssignmentFormData>({
    selectedTasks: ["1", "2", "3", "4", "5"], // Already selected tasks (passed from previous screen)
    assignmentType: "uniform",
    assigneeType: "individual",
    selectedAssignees: ["1"], // Default to first staff member
    instructions: "Hoàn thành các công việc này trước ngày 20/05/2025 để kịp tổng hợp báo cáo cuối học kỳ.",
    step: 2, // Start at step 2 (task selection was step 1)
  });
  
  const filteredStaff = MOCK_STAFF.filter(staff => 
    searchQuery.trim() === "" || 
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAssigneeToggle = (assigneeId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedAssignees.includes(assigneeId);
      
      if (isSelected) {
        return {
          ...prev,
          selectedAssignees: prev.selectedAssignees.filter(id => id !== assigneeId)
        };
      } else {
        return {
          ...prev,
          selectedAssignees: [...prev.selectedAssignees, assigneeId]
        };
      }
    });
  };
  
  const handleTypeChange = (assignmentType: "uniform" | "matrix" | "automatic") => {
    setFormData(prev => ({ ...prev, assignmentType }));
  };
  
  const handleAssigneeTypeChange = (assigneeType: "individual" | "group") => {
    setFormData(prev => ({ ...prev, assigneeType }));
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNextStep = () => {
    setFormData(prev => ({ ...prev, step: prev.step + 1 }));
  };
  
  const handlePrevStep = () => {
    if (formData.step === 2) {
      // Go back to task selection
      navigate("/task");
    } else {
      setFormData(prev => ({ ...prev, step: Math.max(2, prev.step - 1) }));
    }
  };
  
  const handleSubmit = () => {
    console.log("Submitting batch assignment:", formData);
    // In a real app, we would send the data to the server
    navigate("/task");
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Phân công công việc hàng loạt</h1>
      </div>
      
      <Separator className="mb-6" />
      
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          <div className={`flex flex-col items-center`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 text-sm font-semibold bg-blue-50 text-blue-600`}>
              1
            </div>
            <span className="text-sm font-medium text-blue-600">Chọn công việc</span>
          </div>
          <div className="w-16 h-px bg-gray-300"></div>
          <div className={`flex flex-col items-center`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 text-sm font-semibold ${formData.step >= 2 ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
              2
            </div>
            <span className={`text-sm font-medium ${formData.step >= 2 ? "text-blue-600" : "text-gray-400"}`}>Thiết lập phân công</span>
          </div>
          <div className="w-16 h-px bg-gray-300"></div>
          <div className={`flex flex-col items-center`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 text-sm font-semibold ${formData.step >= 3 ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
              3
            </div>
            <span className={`text-sm font-medium ${formData.step >= 3 ? "text-blue-600" : "text-gray-400"}`}>Xem trước & Xác nhận</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700">Đã chọn {formData.selectedTasks.length} công việc cần phân công</p>
        </div>
        
        {formData.step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 font-medium mb-3">Chọn phương thức phân công:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uniform"
                    checked={formData.assignmentType === "uniform"}
                    onCheckedChange={() => handleTypeChange("uniform")}
                  />
                  <Label
                    htmlFor="uniform"
                    className="font-normal cursor-pointer"
                  >
                    Phân công đồng nhất
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="matrix"
                    checked={formData.assignmentType === "matrix"}
                    onCheckedChange={() => handleTypeChange("matrix")}
                  />
                  <Label
                    htmlFor="matrix"
                    className="font-normal cursor-pointer"
                  >
                    Phân công theo ma trận
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="automatic"
                    checked={formData.assignmentType === "automatic"}
                    onCheckedChange={() => handleTypeChange("automatic")}
                  />
                  <Label
                    htmlFor="automatic"
                    className="font-normal cursor-pointer"
                  >
                    Phân công tự động
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 border rounded-md">
                <RadioGroup
                  value={formData.assigneeType}
                  onValueChange={(value) => handleAssigneeTypeChange(value as "individual" | "group")}
                  className="flex items-center gap-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="font-normal">Người thực hiện</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                  <RadioGroupItem value="group" id="group" />
                    <Label htmlFor="group" className="font-normal">Nhóm thực hiện</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="assignee" className="text-gray-700 font-medium">Chọn người/nhóm thực hiện*</Label>
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm người thực hiện..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="min-w-24">
                  Tìm
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                {filteredStaff.map(staff => (
                  <div 
                    key={staff.id} 
                    className="flex items-center p-3 border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <Checkbox
                      id={`staff-${staff.id}`}
                      checked={formData.selectedAssignees.includes(staff.id)}
                      onCheckedChange={() => handleAssigneeToggle(staff.id)}
                    />
                    <Label
                      htmlFor={`staff-${staff.id}`}
                      className="ml-2 font-normal cursor-pointer flex-1"
                    >
                      {staff.name} ({staff.department})
                    </Label>
                  </div>
                ))}
                
                {filteredStaff.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    Không tìm thấy người thực hiện phù hợp
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="instructions" className="text-gray-700 font-medium">Hướng dẫn cụ thể (tùy chọn)</Label>
              <Textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleTextChange}
                placeholder="Cung cấp hướng dẫn cụ thể cho việc thực hiện công việc"
                className="min-h-24"
              />
            </div>
          </div>
        )}
        
        {formData.step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Xác nhận phân công</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="font-medium text-gray-700 mb-2">Thông tin phân công</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><span className="font-medium">Số lượng công việc:</span> {formData.selectedTasks.length}</li>
                  <li><span className="font-medium">Phương thức phân công:</span> {
                    formData.assignmentType === "uniform" ? "Phân công đồng nhất" :
                    formData.assignmentType === "matrix" ? "Phân công theo ma trận" :
                    "Phân công tự động"
                  }</li>
                  <li><span className="font-medium">Loại người thực hiện:</span> {
                    formData.assigneeType === "individual" ? "Người thực hiện" : "Nhóm thực hiện"
                  }</li>
                  <li>
                    <span className="font-medium">Người thực hiện:</span>{" "}
                    {formData.selectedAssignees.map(id => {
                      const staff = MOCK_STAFF.find(s => s.id === id);
                      return staff ? staff.name : "";
                    }).join(", ")}
                  </li>
                </ul>
              </div>
              
              {formData.instructions && (
                <div className="p-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium text-gray-700 mb-2">Hướng dẫn cụ thể</h3>
                  <p className="text-gray-600 whitespace-pre-line">{formData.instructions}</p>
                </div>
              )}
              
              <div className="p-4 border rounded-md bg-blue-50 border-blue-200">
                <p className="text-blue-700">
                  Sau khi xác nhận, thông báo phân công sẽ được gửi đến những người thực hiện. 
                  Bạn có thể theo dõi tiến độ công việc trong mục "Công việc đã phân công".
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Separator className="my-6" />
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevStep}>
            <ChevronLeft size={16} className="mr-1" /> Quay lại
          </Button>
          
          {formData.step < 3 ? (
            <Button 
              onClick={handleNextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={formData.selectedAssignees.length === 0}
            >
              Tiếp theo <ChevronRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Xác nhận phân công
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BatchAssignmentPage;