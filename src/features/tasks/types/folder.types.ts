// src/features/tasks/types/folder.types.ts

/**
 * Định nghĩa cấu trúc dữ liệu của một mục trong cây thư mục
 */
export interface FolderItem {
  id: string;
  name: string;
  color?: string;
  children?: FolderItem[];
}

/**
 * Props cho component FolderTreeView
 */
export interface FolderTreeViewProps {
  folders: FolderItem[];
  selectedFolder: string | null;
  onSelectFolder: (id: string) => void;
  onAddCategory?: () => void;
}

/**
 * Props cho component TreeItem
 */
export interface TreeItemProps {
  item: FolderItem;
  level: number;
  expandedFolders: Set<string>;
  selectedFolder: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

/**
 * Dữ liệu form cho quản lý danh mục
 */
export interface CategoryFormData {
  id: string;
  name: string;
  code: string;
  description: string;
  parentId: string;
  color: string;
  order: number;
}