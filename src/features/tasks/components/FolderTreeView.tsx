import React, { useState } from 'react';
import { FolderIcon, ChevronDown, ChevronRight, Search, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";

// Định nghĩa cấu trúc dữ liệu của một mục trong cây thư mục
interface FolderItem {
  id: string;
  name: string;
  color?: string;
  children?: FolderItem[];
}

// Props cho component TreeItem
interface TreeItemProps {
  item: FolderItem;
  level: number;
  expandedFolders: Set<string>;
  selectedFolder: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

// Component hiển thị một mục thư mục cụ thể
const TreeItem: React.FC<TreeItemProps> = ({
  item,
  level,
  expandedFolders,
  selectedFolder,
  onToggle,
  onSelect
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedFolders.has(item.id);
  const isSelected = selectedFolder === item.id;
  
  // Xác định màu theo phân loại thư mục
  const folderColor = item.color || (
    item.id.startsWith('giangday') ? '#4CAF50' :
    item.id.startsWith('nghiencuu') ? '#2196F3' :
    item.id.startsWith('hanhchinh') ? '#FFC107' :
    item.id.startsWith('sinhvien') ? '#9C27B0' : '#757575'
  );
  
  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center py-2 px-3 hover:bg-gray-100 cursor-pointer rounded",
          isSelected && "bg-blue-50 hover:bg-blue-100"
        )}
        style={{ paddingLeft: `${(level * 12) + 12}px` }}
        onClick={() => onSelect(item.id)}
      >
        {hasChildren && (
          <button 
            className="mr-1 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(item.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown size={16} className="text-gray-500" />
            ) : (
              <ChevronRight size={16} className="text-gray-500" />
            )}
          </button>
        )}
        
        {!hasChildren && <div className="w-4 mr-1" />}
        
        <FolderIcon 
          size={16} 
          className="mr-2" 
          style={{ color: folderColor }} 
        />
        
        <span className="text-sm">{item.name}</span>
      </div>
      
      {/* Hiển thị các mục con chỉ khi thư mục đang mở */}
      {hasChildren && isExpanded && (
        <div className="transition-all">
          {item.children!.map(child => (
            <TreeItem
              key={child.id}
              item={child}
              level={level + 1}
              expandedFolders={expandedFolders}
              selectedFolder={selectedFolder}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Dữ liệu mẫu cho cây thư mục
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

// Component chính cho cây thư mục
export function FolderTreeView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["giangday"]) // Mặc định mở thư mục Giảng dạy
  );
  const [selectedFolder, setSelectedFolder] = useState<string | null>("giangday-baigiang");
  
  // Hàm xử lý khi đóng/mở thư mục
  const handleToggle = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };
  
  // Hàm xử lý khi chọn thư mục
  const handleSelect = (folderId: string) => {
    setSelectedFolder(folderId);
    
    // Tự động mở thư mục cha khi chọn mục con
    const parts = folderId.split('-');
    if (parts.length > 1) {
      const parentId = parts[0];
      setExpandedFolders(prev => new Set([...prev, parentId]));
    }
  };
  
  // Hàm xử lý thêm danh mục mới
  const handleAddCategory = () => {
    console.log("Thêm danh mục mới");
    // Mở modal hoặc form thêm danh mục
  };
  
  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filterFolders = (items: FolderItem[], query: string): FolderItem[] => {
    if (!query.trim()) return items;
    
    return items.map(item => {
      // Kiểm tra nếu mục hiện tại phù hợp với từ khóa tìm kiếm
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
      
      // Đệ quy để lọc các mục con
      const filteredChildren = item.children 
        ? filterFolders(item.children, query) 
        : undefined;
      
      // Nếu mục hiện tại phù hợp hoặc có mục con phù hợp
      if (matchesQuery || (filteredChildren && filteredChildren.length > 0)) {
        return {
          ...item,
          children: filteredChildren
        };
      }
      
      // Không có mục nào phù hợp
      return null;
    }).filter(Boolean) as FolderItem[];
  };
  
  const filteredData = filterFolders(FOLDERS_DATA, searchQuery);
  
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="overflow-y-auto max-h-[600px]">
        {filteredData.map(folder => (
          <TreeItem
            key={folder.id}
            item={folder}
            level={0}
            expandedFolders={expandedFolders}
            selectedFolder={selectedFolder}
            onToggle={handleToggle}
            onSelect={handleSelect}
          />
        ))}
        
        <button 
          className="flex items-center pl-4 py-2 mt-2 text-gray-500 hover:text-gray-700"
          onClick={handleAddCategory}
        >
          <Plus size={16} className="mr-2" />
          <span className="text-sm">Thêm danh mục</span>
        </button>
      </div>
    </div>
  );
}

export default FolderTreeView;