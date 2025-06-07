// src/features/tasks/components/FileUploadArea.tsx
import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/common/components/ui/button";

interface FileUploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  existingFiles?: Array<{ id: string; name: string; size?: number }>;
  onRemoveFile?: (index: number) => void;
  onRemoveExistingFile?: (id: string) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  multiple?: boolean;
  placeholder?: string;
}

export function FileUploadArea({
  onFilesSelected,
  existingFiles = [],
  onRemoveFile,
  onRemoveExistingFile,
  maxSizeMB = 10,
  allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  multiple = true,
  placeholder = "Tải lên tài liệu"
}: FileUploadAreaProps) {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    const filesArray = Array.from(selectedFiles);
    
    // Validate file size and type
    const validFiles = filesArray.filter(file => {
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
      const isValidType = allowedTypes.length === 0 || allowedTypes.includes(file.type);
      
      if (!isValidSize) {
        console.warn(`File ${file.name} exceeds the maximum size of ${maxSizeMB}MB`);
      }
      
      if (!isValidType) {
        console.warn(`File ${file.name} has an unsupported type`);
      }
      
      return isValidSize && isValidType;
    });
    
    setNewFiles(prev => [...prev, ...validFiles]);
    onFilesSelected(validFiles);
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleRemoveNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    onRemoveFile?.(index);
  };
  
  const handleDropAreaClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      handleFileSelection(filesArray);
    }
  };
  
  const handleFileSelection = (filesArray: File[]) => {
    // Validate file size and type
    const validFiles = filesArray.filter(file => {
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
      const isValidType = allowedTypes.length === 0 || allowedTypes.includes(file.type);
      
      if (!isValidSize) {
        console.warn(`File ${file.name} exceeds the maximum size of ${maxSizeMB}MB`);
      }
      
      if (!isValidType) {
        console.warn(`File ${file.name} has an unsupported type`);
      }
      
      return isValidSize && isValidType;
    });
    
    setNewFiles(prev => [...prev, ...validFiles]);
    onFilesSelected(validFiles);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleDropAreaClick}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo và thả
            </p>
            <p className="text-xs text-gray-500">
              PDF, Word, Excel, PowerPoint (Tối đa {maxSizeMB}MB)
            </p>
          </div>
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            className="hidden"
            multiple={multiple}
            onChange={handleFileChange}
            accept={allowedTypes.join(",")}
          />
        </label>
      </div>
      
      {(existingFiles.length > 0 || newFiles.length > 0) && (
        <div className="border rounded-lg divide-y">
          {existingFiles.map((file, index) => (
            <div key={`existing-${file.id}`} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📄</span>
                <span className="text-gray-700">{file.name}</span>
                {file.size && (
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>
              {onRemoveExistingFile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-500"
                  onClick={() => onRemoveExistingFile(file.id)}
                  type="button"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
          
          {newFiles.map((file, index) => (
            <div key={`new-${index}`} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📄</span>
                <span className="text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-red-500"
                onClick={() => handleRemoveNewFile(index)}
                type="button"
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUploadArea;