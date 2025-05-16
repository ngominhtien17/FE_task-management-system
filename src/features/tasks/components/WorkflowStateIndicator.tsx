// src/features/tasks/components/WorkflowStateIndicator.tsx
import { ArrowRight } from "lucide-react";
import type { TaskStatus } from "../types";

interface WorkflowStateIndicatorProps {
  currentStatus: TaskStatus;
  currentAction?: string;
}

export function WorkflowStateIndicator({ currentStatus, currentAction }: WorkflowStateIndicatorProps) {
  // Định nghĩa trạng thái và mã màu tương ứng
  const states = [
    { status: 'not_started', label: 'Chưa bắt đầu', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    { status: 'in_progress', label: 'Đang thực hiện', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { status: 'pending', label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700 border-amber-300' },
    { status: 'overdue', label: 'Quá hạn', color: 'bg-red-100 text-red-700 border-red-300' },
    { status: 'completed', label: 'Hoàn thành', color: 'bg-green-100 text-green-700 border-green-300' }
  ];
  
  // Tìm vị trí trạng thái hiện tại
  const currentIndex = states.findIndex(s => s.status === currentStatus);
  
  return (
    <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Vị trí trong quy trình:</h3>
      
      <div className="flex items-center overflow-x-auto py-2">
        {states.map((state, index) => (
          <div key={state.status} className="flex items-center flex-shrink-0">
            <div 
              className={`px-3 py-1 rounded-md text-xs font-medium border ${
                currentStatus === state.status ? state.color : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}
            >
              {state.label}
            </div>
            
            {index < states.length - 1 && (
              <ArrowRight className="mx-1 text-gray-400" size={14} />
            )}
          </div>
        ))}
      </div>
      
      {currentAction && (
        <div className="mt-2 text-xs text-gray-600">
          Đang thực hiện: <span className="font-medium">{currentAction}</span>
        </div>
      )}
    </div>
  );
}

export default WorkflowStateIndicator;