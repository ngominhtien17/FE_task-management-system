// src/features/tasks/pages/CategoryManagementPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Save, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CategoryItem } from "../components/CategoryItem";
import { FolderTreeView } from '../components/FolderTreeView';


// Mock data for category tree
const MOCK_CATEGORIES = [
  {
    id: "1",
    name: "Giảng dạy",
    color: "#4CAF50",
    children: [
      { id: "1-1", name: "Đề cương", color: "#4CAF50" },
      { id: "1-2", name: "Bài giảng", color: "#4CAF50" },
      { id: "1-3", name: "Đề thi", color: "#4CAF50" },
    ]
  },
  {
    id: "2",
    name: "Nghiên cứu",
    color: "#2196F3",
    children: [
      { id: "2-1", name: "NCKH", color: "#2196F3" },
      { id: "2-2", name: "Bài báo", color: "#2196F3" },
      { id: "2-3", name: "Hội nghị", color: "#2196F3" },
    ]
  },
  {
    id: "3",
    name: "Hành chính",
    color: "#FFC107",
    children: [
      { id: "3-1", name: "Báo cáo", color: "#FFC107" },
      { id: "3-2", name: "Kế hoạch", color: "#FFC107" },
    ]
  },
  {
    id: "4",
    name: "Sinh viên",
    color: "#9C27B0",
    children: [
      { id: "4-1", name: "Đánh giá", color: "#9C27B0" },
      { id: "4-2", name: "Thực tập", color: "#9C27B0" },
    ]
  },
];

interface CategoryFormData {
  id: string;
  name: string;
  code: string;
  description: string;
  parentId: string;
  color: string;
  order: number;
}

export function CategoryManagementPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("2-1"); // Default to NCKH
  const [formData, setFormData] = useState<CategoryFormData>({
    id: "2-1",
    name: "Nghiên cứu khoa học",
    code: "NCKH",
    description: "Các công việc liên quan đến hoạt động nghiên cứu khoa học, bao gồm hướng dẫn sinh viên, báo cáo tiến độ và viết bài báo khoa học.",
    parentId: "2",
    color: "#2196F3",
    order: 2
  });
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    // Nếu là parentId và giá trị là "none", có thể xử lý đặc biệt nếu cần
    if (name === "parentId" && value === "none") {
      setFormData(prev => ({ ...prev, [name]: "" })); // Lưu trữ trong state nội bộ là chuỗi rỗng nếu cần
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // In a real app, we would fetch category details by ID
    // For now, we'll just use the mock data
    
    // Find the selected category in mock data
    for (const parent of MOCK_CATEGORIES) {
      if (parent.id === categoryId) {
        setFormData({
          id: parent.id,
          name: parent.name,
          code: parent.name,
          description: `Danh mục ${parent.name}`,
          parentId: "",
          color: parent.color,
          order: 1
        });
        return;
      }
      
      const child = parent.children?.find(c => c.id === categoryId);
      if (child) {
        setFormData({
          id: child.id,
          name: child.name,
          code: child.name,
          description: `Danh mục con ${child.name} thuộc ${parent.name}`,
          parentId: parent.id,
          color: child.color,
          order: parent.children.indexOf(child) + 1
        });
        return;
      }
    }
  };
  
  const handleSave = () => {
    console.log("Saving category:", formData);
    // In a real app, we would send the data to the server
  };
  
  const handleDelete = () => {
    console.log("Deleting category:", formData.id);
    // In a real app, we would send a delete request to the server
  };
  
  const handleCancel = () => {
    // Reset form to initial state or navigate back
    console.log("Cancel category editing");
  };
  
  const handleAddCategory = () => {
    // Create a new category form
    setFormData({
      id: "",
      name: "",
      code: "",
      description: "",
      parentId: "",
      color: "#2196F3",
      order: 1
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục Công Việc</h1>
        <Button
          onClick={handleAddCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={18} className="mr-1" /> Thêm danh mục mới
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side - Category tree */}
        <div className="md:col-span-1 border rounded-lg p-4 bg-white shadow-sm">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="pl-10 h-10 bg-gray-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <div className="md:col-span-1">
              <FolderTreeView />
            </div>
          </div>
        </div>
        
        {/* Right side - Category form */}
        <div className="md:col-span-2 border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin danh mục</h2>
          <Separator className="mb-6" />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Tên danh mục*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleTextChange}
                placeholder="Nhập tên danh mục"
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code" className="text-gray-700">Mã danh mục*</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleTextChange}
                placeholder="Nhập mã danh mục"
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleTextChange}
                placeholder="Mô tả chi tiết về danh mục"
                className="min-h-20 w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parentId" className="text-gray-700">Danh mục cha</Label>
              <Select
                value={formData.parentId === "" ? "none" : formData.parentId}
                onValueChange={(value) => handleSelectChange("parentId", value)}
              >
                <SelectTrigger id="parentId" className="w-full">
                  <SelectValue placeholder="Chọn danh mục cha" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-md">
                  <SelectItem value="none">Không có</SelectItem>
                  {MOCK_CATEGORIES.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color" className="text-gray-700">Mã màu</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="color"
                  name="color"
                  type="text"
                  value={formData.color}
                  onChange={handleTextChange}
                  className="w-full"
                />
                <div 
                  className="w-8 h-8 rounded-full border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: formData.color }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="order" className="text-gray-700">Thứ tự hiển thị</Label>
              <Input
                id="order"
                name="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={handleTextChange}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save size={16} className="mr-1" /> Lưu
              </Button>
              
              {formData.id && (
                <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
                  <Trash size={16} className="mr-1" /> Xóa
                </Button>
              )}
              
              <Button variant="outline" onClick={handleCancel}>
                <X size={16} className="mr-1" /> Hủy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryManagementPage;