import React, { useState } from 'react';
import { FolderIcon, ChevronDown, ChevronRight, Search, Plus } from 'lucide-react';
import { cn } from "@/common/utils/utils";
import type { FolderItem, FolderTreeViewProps, TreeItemProps } from '../types/folder.types';

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

// Component chính cho cây thư mục
export function FolderTreeView({ 
  folders, 
  selectedFolder, 
  onSelectFolder,
  onAddCategory 
}: FolderTreeViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["giangday"]) // Mặc định mở thư mục Giảng dạy
  );
  
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
    onSelectFolder(folderId);
    
    // Tự động mở thư mục cha khi chọn mục con
    const parts = folderId.split('-');
    if (parts.length > 1) {
      const parentId = parts[0];
      setExpandedFolders(prev => new Set([...prev, parentId]));
    }
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
  
  const filteredData = filterFolders(folders, searchQuery);
  
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
          onClick={onAddCategory}
        >
          <Plus size={16} className="mr-2" />
          <span className="text-sm">Thêm danh mục</span>
        </button>
      </div>
    </div>
  );
}

export default FolderTreeView;