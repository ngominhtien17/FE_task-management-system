// src/features/task/pages/TaskCreatePage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Mock data
const departments = [
  { id: "1", name: "Phòng Đào tạo" },
  { id: "2", name: "Bộ môn CNPM" },
  { id: "3", name: "Phòng Khoa học - Công nghệ" },
  { id: "4", name: "Phòng Tổ chức - Hành chính" },
  { id: "5", name: "Khoa CNTT" },
];

const categories = [
  { id: "1", name: "Kế hoạch học kỳ" },
  { id: "2", name: "Giảng dạy" },
  { id: "3", name: "Nghiên cứu" },
  { id: "4", name: "Hành chính" },
  { id: "5", name: "Sinh viên" },
];

const staffMembers = [
  { id: "1", name: "Nguyễn Văn A" },
  { id: "2", name: "Trần Thị B" },
  { id: "3", name: "Lê Văn C" },
  { id: "4", name: "Phạm Thị D" },
  { id: "5", name: "Vũ Minh E" },
  { id: "6", name: "Hoàng Văn F" },
];

interface TaskFormData {
  title: string;
  description: string;
  department: string;
  priority: "high" | "medium" | "low";
  categories: string[];
  startDate: Date | null;
  endDate: Date | null;
  assignees: string[];
  attachments: File[];
  taskType: "individual" | "group";
}

export function TaskCreatePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "Chuẩn bị kế hoạch giảng dạy học kỳ mới",
    description: "Xây dựng kế hoạch giảng dạy chi tiết cho học kỳ I năm học 2025-2026 bao gồm:\n- Phân công giảng dạy\n- Lịch giảng dạy\n- Kế hoạch sử dụng phòng học, phòng thực hành\n- Kế hoạch tổ chức thi, kiểm tra",
    department: "1",
    priority: "medium",
    categories: ["1", "2"],
    startDate: null,
    endDate: null,
    assignees: [],
    attachments: [],
    taskType: "individual",
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(categoryId);
      
      if (isSelected) {
        return {
          ...prev,
          categories: prev.categories.filter(id => id !== categoryId)
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, categoryId]
        };
      }
    });
  };

  const handleAssigneeToggle = (assigneeId: string) => {
    setFormData(prev => {
      const isSelected = prev.assignees.includes(assigneeId);
      
      if (isSelected) {
        return {
          ...prev,
          assignees: prev.assignees.filter(id => id !== assigneeId)
        };
      } else {
        return {
          ...prev,
          assignees: [...prev.assignees, assigneeId]
        };
      }
    });
  };

  const handleCancel = () => {
    navigate("/task");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileList]
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // In a real app, we would send the data to the server
    navigate("/task");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tạo công việc mới</h1>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X size={20} />
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Step indicator */}
        <div className="flex border-b border-gray-200 pb-6 mb-6">
          <div className={cn(
            "flex flex-col items-center flex-1",
            currentStep >= 1 ? "text-blue-600" : "text-gray-400"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mb-1 text-sm font-semibold",
              currentStep >= 1 ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
            )}>
              1
            </div>
            <span className="text-sm font-medium">Thông tin</span>
          </div>
          <div className={cn(
            "flex flex-col items-center flex-1",
            currentStep >= 2 ? "text-blue-600" : "text-gray-400"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mb-1 text-sm font-semibold",
              currentStep >= 2 ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
            )}>
              2
            </div>
            <span className="text-sm font-medium">Thời gian</span>
          </div>
          <div className={cn(
            "flex flex-col items-center flex-1",
            currentStep >= 3 ? "text-blue-600" : "text-gray-400"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mb-1 text-sm font-semibold",
              currentStep >= 3 ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
            )}>
              3
            </div>
            <span className="text-sm font-medium">Tài liệu</span>
          </div>
          <div className={cn(
            "flex flex-col items-center flex-1",
            currentStep >= 4 ? "text-blue-600" : "text-gray-400"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mb-1 text-sm font-semibold",
              currentStep >= 4 ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
            )}>
              4
            </div>
            <span className="text-sm font-medium">Phân công</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">📝 Thông tin cơ bản</h2>
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">Tiêu đề công việc <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleTextChange}
                  placeholder="Nhập tiêu đề công việc"
                  className="w-full"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">Mô tả chi tiết <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleTextChange}
                  placeholder="Mô tả chi tiết công việc cần thực hiện"
                  className="min-h-40 w-full"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-700">Đơn vị chủ quản <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger id="department" className="w-full">
                      <SelectValue placeholder="Chọn đơn vị" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-gray-700">Mức độ ưu tiên <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange("priority", value as "high" | "medium" | "low")}
                  >
                    <SelectTrigger id="priority" className="w-full">
                      <SelectValue placeholder="Chọn mức độ ưu tiên" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">🔴 Cao</SelectItem>
                      <SelectItem value="medium">🟠 Trung bình</SelectItem>
                      <SelectItem value="low">🟢 Thấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-700">Danh mục</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={formData.categories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Time Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">⏱️ Thông tin thời gian</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-gray-700">Ngày bắt đầu</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate || undefined}
                        onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-gray-700">Deadline <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate || undefined}
                        onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                        disabled={(date) => {
                          if (formData.startDate) {
                            return date < formData.startDate;
                          }
                          return false;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-700">Loại công việc</Label>
                <RadioGroup
                  value={formData.taskType}
                  onValueChange={(value) => handleSelectChange("taskType", value as "individual" | "group")}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="font-normal">Cá nhân</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="group" id="group" />
                    <Label htmlFor="group" className="font-normal">Nhóm</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 3: Attachments */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">📎 Tài liệu đính kèm</h2>
              
              <div className="space-y-2">
                <Label htmlFor="attachments" className="text-gray-700">Tải lên tài liệu hướng dẫn hoặc tài liệu liên quan</Label>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Nhấp để tải lên</span> hoặc kéo và thả</p>
                        <p className="text-xs text-gray-500">PDF, Word, Excel, PowerPoint (Tối đa 10MB)</p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  {formData.attachments.length > 0 && (
                    <div className="border rounded-lg divide-y">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">📄</span>
                            <span className="text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-red-500"
                            onClick={() => handleRemoveFile(index)}
                            type="button"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Assignment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">👥 Phân công nhiệm vụ</h2>
              
              <div className="space-y-2">
                <Label className="text-gray-700">Người thực hiện <span className="text-red-500">*</span></Label>
                <div className="max-h-60 overflow-y-auto border rounded-lg p-3">
                  <div className="space-y-2">
                    {staffMembers.map(staff => (
                      <div key={staff.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`assignee-${staff.id}`}
                          checked={formData.assignees.includes(staff.id)}
                          onCheckedChange={() => handleAssigneeToggle(staff.id)}
                        />
                        <Label
                          htmlFor={`assignee-${staff.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {staff.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                {formData.assignees.length === 0 && (
                  <p className="text-sm text-red-500">Vui lòng chọn ít nhất một người thực hiện</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>Quay lại</Button>
            ) : (
              <Button type="button" variant="outline" onClick={handleCancel}>Hủy bỏ</Button>
            )}

            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep}>Tiếp theo</Button>
            ) : (
              <Button 
                type="submit" 
                disabled={formData.assignees.length === 0 || !formData.endDate}
              >
                Hoàn thành
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskCreatePage;