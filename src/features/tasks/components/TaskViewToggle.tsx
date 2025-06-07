// src/features/task/components/TaskViewToggle.tsx

import { LayoutList, LayoutGrid } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/common/components/ui/toggle-group";

interface TaskViewToggleProps {
  view: "table" | "kanban";
  onViewChange: (view: "table" | "kanban") => void;
}

export function TaskViewToggle({ view, onViewChange }: TaskViewToggleProps) {
  return (
    <ToggleGroup type="single" value={view} onValueChange={(value) => value && onViewChange(value as "table" | "kanban")}>
      <ToggleGroupItem value="table" aria-label="Dạng bảng" className="data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600">
        <LayoutList size={18} />
        <span className="ml-2">Dạng bảng</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="kanban" aria-label="Dạng kanban" className="data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600">
        <LayoutGrid size={18} />
        <span className="ml-2">Dạng kanban</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}