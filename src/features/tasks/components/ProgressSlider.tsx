// src/features/tasks/components/ProgressSlider.tsx
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressSliderProps {
  value: number;
  onChange: (value: number) => void;
  steps?: number[];
  className?: string;
}

export function ProgressSlider({
  value,
  onChange,
  steps = [0, 10, 25, 50, 75, 90, 100],
  className
}: ProgressSliderProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    onChange(newValue);
  };
  
  const handleStepClick = (step: number) => {
    onChange(step);
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative h-6">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          className="absolute w-full h-2 appearance-none bg-gray-200 rounded-lg outline-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`,
          }}
        />
      </div>
      
      <div className="flex justify-between">
        {steps.map((step) => (
          <div key={step} className="flex flex-col items-center">
            <button
              type="button"
              className={cn(
                "w-4 h-4 rounded-full cursor-pointer transition-all",
                value >= step ? "bg-blue-600" : "bg-gray-300",
                hoveredValue !== null && hoveredValue >= step && "bg-blue-400"
              )}
              onClick={() => handleStepClick(step)}
              onMouseEnter={() => setHoveredValue(step)}
              onMouseLeave={() => setHoveredValue(null)}
            />
            <span className="text-xs mt-1">{step}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressSlider;