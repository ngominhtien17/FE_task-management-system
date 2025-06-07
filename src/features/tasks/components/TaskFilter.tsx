// src/features/task/components/TaskFilter.tsx

import { useState } from "react";
import { Search, Filter, SortAsc } from "lucide-react";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/common/components/ui/dropdown-menu";

interface TaskFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, any>) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
}

export function TaskFilter({ onSearch, onFilter, onSort }: TaskFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <form onSubmit={handleSearch} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="search"
          placeholder="Tìm kiếm công việc..."
          className="pl-10 h-10 bg-gray-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 px-3 flex items-center gap-2 bg-white">
              <Filter size={16} />
              <span>Lọc</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked onCheckedChange={() => {}}>
              Tất cả
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => {}}>
              Chưa bắt đầu
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => {}}>
              Đang làm
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => {}}>
              Chờ xử lý
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => {}}>
              Quá hạn
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => {}}>
              Hoàn thành
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuLabel>Mức độ ưu tiên</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked onCheckedChange={() => {}}>
              Tất cả
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => {}}>
              Cao
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => {}}>
              Trung bình
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => {}}>
              Thấp
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 px-3 flex items-center gap-2 bg-white">
              <SortAsc size={16} />
              <span>Sắp xếp</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuCheckboxItem checked onCheckedChange={() => onSort("deadline", "asc")}>
              Deadline (tăng dần)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => onSort("deadline", "desc")}>
              Deadline (giảm dần)
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => onSort("priority", "desc")}>
              Ưu tiên cao nhất
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => onSort("priority", "asc")}>
              Ưu tiên thấp nhất
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => onSort("title", "asc")}>
              Tên A-Z
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onCheckedChange={() => onSort("title", "desc")}>
              Tên Z-A
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default TaskFilter;