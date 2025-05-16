// src/features/tasks/pages/CategoryManagementPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Save, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FolderTreeView } from '../components/FolderTreeView';
import type { FolderItem, CategoryFormData } from '../types/folder.types';

// Dữ liệu mẫu cho cây danh mục - Di chuyển từ component vào trang
const FOLDERS_DATA: FolderItem[] = [
  {
    id: "giangday",
    name: "Giảng dạy",
    color: "#4CAF50",
    children: [
      { id: "giangday-decuong", name: "Đề cương", color: "#4CAF50" },
      { id: "giangday-baigiang", name: "Bài giảng", color: "#4CAF50" },
      { id: "giangday-dethi", name: "Đề thi", color: "#4CAF50" },
    ]
  },
  {
    id: "nghiencuu",
    name: "Nghiên cứu",
    color: "#2196F3",
    children: [
      { id: "nghiencuu-nckh", name: "NCKH", color: "#2196F3" },
      { id: "nghiencuu-baibao", name: "Bài báo", color: "#2196F3" },
      { id: "nghiencuu-hoinghi", name: "Hội nghị", color: "#2196F3" },
    ]
  },
  {
    id: "hanhchinh",
    name: "Hành chính",
    color: "#FFC107",
    children: [
      { id: "hanhchinh-baocao", name: "Báo cáo", color: "#FFC107" },
      { id: "hanhchinh-kehoach", name: "Kế hoạch", color: "#FFC107" },
    ]
  },
  {
    id: "sinhvien",
    name: "Sinh viên",
    color: "#9C27B0",
    children: [
      { id: "sinhvien-danhgia", name: "Đánh giá", color: "#9C27B0" },
      { id: "sinhvien-thuctap", name: "Thực tập", color: "#9C27B0" },
    ]
  },
];

/**
 * Hàm tìm thông tin danh mục từ cây danh mục
 * @param categoryId ID của danh mục cần tìm
 * @param folders Mảng dữ liệu thư mục
 * @returns Thông tin về danh mục tìm thấy hoặc undefined
 */
const findCategoryInfo = (
  categoryId: string, 
  folders: FolderItem[]
): { category: FolderItem; parent?: FolderItem } | undefined => {
  // Tìm kiếm trong danh mục gốc
  for (const folder of folders) {
    if (folder.id === categoryId) {
      return { category: folder };
    }

    // Tìm kiếm trong danh mục con
    if (folder.children) {
      const childCategory = folder.children.find(child => child.id === categoryId);
      if (childCategory) {
        return { category: childCategory, parent: folder };
      }
    }
  }
  
  return undefined;
};

export function CategoryManagementPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("nghiencuu-nckh"); // Mặc định chọn NCKH
  const [formData, setFormData] = useState<CategoryFormData>({
    id: "",
    name: "",
    code: "",
    description: "",
    parentId: "",
    color: "#2196F3",
    order: 1
  });
  
  // Cập nhật form data khi selectedCategory thay đổi
  useEffect(() => {
    if (selectedCategory) {
      const categoryInfo = findCategoryInfo(selectedCategory, FOLDERS_DATA);
      
      if (categoryInfo) {
        const { category, parent } = categoryInfo;
        
        setFormData({
          id: category.id,
          name: category.name,
          code: category.name,
          description: parent 
            ? `Danh mục con ${category.name} thuộc ${parent.name}` 
            : `Danh mục ${category.name}`,
          parentId: parent ? parent.id : "",
          color: category.color || "#757575",
          order: parent && parent.children 
            ? parent.children.findIndex(c => c.id === category.id) + 1 
            : 1
        });
      }
    } else {
      // Reset form khi không có danh mục nào được chọn
      setFormData({
        id: "",
        name: "",
        code: "",
        description: "",
        parentId: "",
        color: "#2196F3",
        order: 1
      });
    }
  }, [selectedCategory]);
  
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
    // Form data sẽ được cập nhật tự động qua useEffect
  };
  
  const handleSave = () => {
    console.log("Lưu danh mục:", formData);
    // Trong ứng dụng thực tế, chúng ta sẽ gửi dữ liệu đến máy chủ
    alert(`Đã lưu danh mục: ${formData.name}`);
  };
  
  const handleDelete = () => {
    console.log("Xóa danh mục:", formData.id);
    // Trong ứng dụng thực tế, chúng ta sẽ gửi yêu cầu xóa đến máy chủ
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${formData.name}"?`)) {
      alert(`Đã xóa danh mục: ${formData.name}`);
      setSelectedCategory(null);
    }
  };
  
  const handleCancel = () => {
    // Khôi phục dữ liệu từ danh mục đang chọn
    if (selectedCategory) {
      const categoryInfo = findCategoryInfo(selectedCategory, FOLDERS_DATA);
      if (categoryInfo) {
        const { category, parent } = categoryInfo;
        setFormData({
          id: category.id,
          name: category.name,
          code: category.name,
          description: parent 
            ? `Danh mục con ${category.name} thuộc ${parent.name}` 
            : `Danh mục ${category.name}`,
          parentId: parent ? parent.id : "",
          color: category.color || "#757575",
          order: parent && parent.children 
            ? parent.children.findIndex(c => c.id === category.id) + 1 
            : 1
        });
      }
    }
  };
  
  const handleAddCategory = () => {
    // Tạo form mới cho danh mục
    setSelectedCategory(null);
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
          <div className="md:col-span-1">
            <FolderTreeView 
              folders={FOLDERS_DATA} 
              selectedFolder={selectedCategory}
              onSelectFolder={handleCategorySelect}
              onAddCategory={handleAddCategory}
            />
          </div>
        </div>
        
        {/* Right side - Category form */}
        <div className="md:col-span-2 border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {formData.id ? `Thông tin danh mục: ${formData.name}` : 'Thêm danh mục mới'}
          </h2>
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
                  {FOLDERS_DATA.map(category => (
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