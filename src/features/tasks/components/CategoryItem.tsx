// src/features/tasks/components/CategoryItem.tsx
import { useState } from "react";
import { ChevronRight, FolderIcon, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryItemProps {
  id: string;
  name: string;
  color?: string;
  isExpanded?: boolean;
  hasChildren?: boolean;
  level?: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CategoryItem({
  id,
  name,
  color = "#2196F3",
  isExpanded: initialExpanded = false,
  hasChildren = false,
  level = 0,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete
}: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onSelect?.(id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <div
      className={cn(
        "flex items-center py-2 px-3 cursor-pointer rounded-md hover:bg-gray-100",
        isSelected && "bg-blue-50 hover:bg-blue-100"
      )}
      style={{ paddingLeft: `${level * 16 + 12}px` }}
      onClick={handleSelect}
    >
      {hasChildren ? (
        <button 
          className="w-5 h-5 flex items-center justify-center mr-1 text-gray-500"
          onClick={handleToggle}
        >
          <ChevronRight 
            size={16} 
            className={cn("transition-transform", isExpanded && "rotate-90")} 
          />
        </button>
      ) : (
        <span className="w-5 h-5 mr-1"></span>
      )}
      
      <FolderIcon 
        size={16} 
        className="mr-2" 
        style={{ color: color }} 
      />
      
      <span className="flex-1 text-sm truncate">{name}</span>
      
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
        <button
          className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
          onClick={handleEdit}
        >
          <Edit size={14} />
        </button>
        <button
          className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
          onClick={handleDelete}
        >
          <Trash size={14} />
        </button>
      </div>
    </div>
  );
}

export default CategoryItem;