// src/features/tasks/components/DemoDataInfo.tsx
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DemoDataInfoProps {
  currentRole?: 'admin' | 'manager' | 'assignee';
  taskId?: string;
}

export function DemoDataInfo({ currentRole = 'assignee', taskId }: DemoDataInfoProps) {
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-4">
      <AlertCircle className="h-4 w-4 text-amber-700" />
      <AlertTitle className="text-amber-700">Thông tin demo</AlertTitle>
      <AlertDescription className="text-amber-700 text-sm">
        Bạn đang xem dữ liệu mẫu với vai trò: <strong>
          {currentRole === 'admin' 
            ? 'Quản trị viên' 
            : currentRole === 'manager' 
              ? 'Người quản lý' 
              : 'Người thực hiện công việc'}
        </strong>
        {taskId && <span> cho công việc ID: <strong>{taskId}</strong></span>}
        <br />
        Tất cả các thao tác chỉ được mô phỏng và không thay đổi dữ liệu thực tế.
      </AlertDescription>
    </Alert>
  );
}

export default DemoDataInfo;