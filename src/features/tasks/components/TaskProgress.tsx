// src/features/task/components/TaskProgress.tsx

interface TaskProgressProps {
    progress: number;
    className?: string;
  }
  
  export function TaskProgress({ progress, className = "" }: TaskProgressProps) {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600 font-medium">Tiến độ</span>
          <span className="text-sm text-gray-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }