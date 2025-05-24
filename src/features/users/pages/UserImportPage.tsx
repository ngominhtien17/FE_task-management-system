// src/features/users/pages/UserImportPage.tsx
import React, { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeftIcon, FileIcon, UploadIcon, AlertCircleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

import { mockDepartments } from '../utils/mockData';

// Kiểu dữ liệu cho dữ liệu nhập
interface ImportedUserData {
  id: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
  errors?: string[];
  isValid: boolean;
}

// Dữ liệu mẫu
const mockImportPreview: ImportedUserData[] = [
  {
    id: '1',
    fullName: 'Nguyễn Văn A',
    email: 'nva@example.com',
    department: 'CNPM',
    position: 'GV',
    isValid: true
  },
  {
    id: '2',
    fullName: 'Trần Thị B',
    email: 'ttb@example.com',
    department: 'KTPM',
    position: 'GV',
    isValid: true
  },
  {
    id: '3',
    fullName: 'Lê Văn C',
    email: 'lvc@example.com',
    department: 'CNPM',
    position: 'GV',
    isValid: true
  },
  {
    id: '4',
    fullName: 'Phạm Thị D',
    email: '',
    department: 'KTPM',
    position: 'GV',
    errors: ['Thiếu thông tin email (bắt buộc)'],
    isValid: false
  },
  {
    id: '5',
    fullName: 'Vũ Minh E',
    email: 'vme@example.com',
    department: 'MMT',
    position: 'GV',
    isValid: true
  },
];

const ImportStepTab: React.FC<{
  currentStep: number;
  onStepChange: (step: number) => void;
}> = ({ currentStep, onStepChange }) => {
  return (
    <TabsList className="mb-6 w-full grid grid-cols-2 h-auto">
      <TabsTrigger
        value="upload"
        className={`py-4 ${currentStep === 1 ? 'bg-primary text-white' : ''}`}
        onClick={() => onStepChange(1)}
      >
        <span className="flex items-center">
          <span className="w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center mr-2 text-sm">
            1
          </span>
          Tải mẫu file
        </span>
      </TabsTrigger>
      <TabsTrigger
        value="preview"
        className={`py-4 ${currentStep === 2 ? 'bg-primary text-white' : ''}`}
        onClick={() => onStepChange(2)}
        disabled={currentStep < 2}
      >
        <span className="flex items-center">
          <span className="w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center mr-2 text-sm">
            2
          </span>
          Nhập dữ liệu
        </span>
      </TabsTrigger>
    </TabsList>
  );
};

const UserImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [importedData, setImportedData] = useState<ImportedUserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processFile = useCallback((file: File) => {
    // Kiểm tra loại file
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'xlsx' && fileExt !== 'csv') {
      alert('Chỉ hỗ trợ file Excel (.xlsx) hoặc CSV (.csv)');
      return;
    }

    // Kiểm tra kích thước file
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('Kích thước file không được vượt quá 10MB');
      return;
    }

    setUploadedFile(file);
    setIsLoading(true);

    // Mô phỏng xử lý file và hiển thị dữ liệu
    setTimeout(() => {
      setImportedData(mockImportPreview);
      setIsLoading(false);
      setCurrentStep(2);
    }, 1000);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const handleClickFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleDownloadTemplate = useCallback(() => {
    // Mô phỏng tải mẫu file
    console.log('Tải mẫu file');
    // Trong thực tế, đây là nơi bạn sẽ tạo và tải xuống một file mẫu
  }, []);

  const handleImport = useCallback(() => {
    // Kiểm tra nếu có dữ liệu hợp lệ
    const validData = importedData.filter(item => item.isValid);
    if (validData.length === 0) {
      alert('Không có dữ liệu hợp lệ để nhập');
      return;
    }

    setIsLoading(true);

    // Mô phỏng quá trình nhập dữ liệu
    setTimeout(() => {
      setIsLoading(false);
      setImportSuccess(true);
      
      // Hiển thị thông báo thành công trong 2 giây, sau đó chuyển về trang danh sách người dùng
      setTimeout(() => {
        navigate('/users', {
          state: {
            successMessage: `Đã nhập ${validData.length} người dùng thành công`
          }
        });
      }, 2000);
    }, 1500);
  }, [importedData, navigate]);

  const handleImportValidOnly = useCallback(() => {
    handleImport();
  }, [handleImport]);

  const validCount = importedData.filter(item => item.isValid).length;
  const errorCount = importedData.filter(item => !item.isValid).length;

  return (
    <div className="container mx-auto p-6">
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nhập người dùng từ file</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/users')}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Nhập người dùng từ file</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep === 1 ? 'upload' : 'preview'}>
            <ImportStepTab 
              currentStep={currentStep} 
              onStepChange={setCurrentStep} 
            />
            
            <TabsContent value="upload">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadTemplate}
                    className="flex items-center"
                  >
                    <FileIcon className="w-4 h-4 mr-2" />
                    Tải mẫu file Excel
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadTemplate}
                    className="flex items-center"
                  >
                    <FileIcon className="w-4 h-4 mr-2" />
                    Tải mẫu file CSV
                  </Button>
                </div>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver ? 'border-primary bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    className="hidden"
                    accept=".xlsx,.csv"
                  />
                  
                  <div className="flex flex-col items-center justify-center">
                    <UploadIcon className="h-12 w-12 text-gray-400 mb-3" />
                    
                    {isLoading ? (
                      <div className="space-y-2">
                        <p className="text-gray-700 font-medium">Đang xử lý file...</p>
                        <div className="w-full max-w-xs mx-auto h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700 mb-2">Kéo và thả file Excel/CSV vào đây</p>
                        <p className="text-gray-500 text-sm mb-2">hoặc</p>
                        <Button 
                          variant="outline" 
                          onClick={handleClickFileInput}
                        >
                          Chọn file để tải lên
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>Hỗ trợ định dạng: .xlsx, .csv</p>
                  <p>Kích thước tối đa: 10MB</p>
                </div>
                
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertTitle className="text-blue-800">Lưu ý khi nhập dữ liệu</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Tải mẫu file để đảm bảo định dạng chính xác</li>
                      <li>Các trường đánh dấu * là bắt buộc</li>
                      <li>Mã bộ môn phải trùng khớp với mã trong hệ thống</li>
                      <li>Email phải là duy nhất trong hệ thống</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
                  <p className="text-gray-700">Đang xử lý dữ liệu...</p>
                </div>
              ) : importSuccess ? (
                <div className="text-center py-12">
                  <CheckCircleIcon className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Nhập dữ liệu thành công!</h2>
                  <p className="text-gray-600 mb-6">Đã nhập {validCount} người dùng vào hệ thống</p>
                  <Button onClick={() => navigate('/users')}>
                    Quay lại danh sách người dùng
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="pb-4">
                    <p className="mb-2">
                      <span className="font-medium">Đã tải lên:</span> {uploadedFile?.name} ({importedData.length} người dùng)
                    </p>
                  </div>
                  
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Họ tên</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Đơn vị</TableHead>
                          <TableHead>Vị trí</TableHead>
                          <TableHead className="text-right">Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importedData.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.fullName}</TableCell>
                            <TableCell>{user.email || <span className="text-red-500">Chưa nhập</span>}</TableCell>
                            <TableCell>{user.department}</TableCell>
                            <TableCell>{user.position}</TableCell>
                            <TableCell className="text-right">
                              {user.isValid ? (
                                <Badge className="bg-green-500">✓</Badge>
                              ) : (
                                <Badge variant="destructive">❌</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {errorCount > 0 && (
                    <Alert variant="destructive">
                      <AlertCircleIcon className="h-4 w-4 mr-2" />
                      <AlertTitle>Lỗi dữ liệu</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          {importedData
                            .filter(user => !user.isValid)
                            .map((user, index) => (
                              <li key={index}>
                                Dòng {parseInt(user.id) + 1}: {user.errors?.join(', ')}
                              </li>
                            ))
                          }
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">Tổng cộng: {importedData.length} người dùng</p>
                      <div className="flex gap-4 mt-1 text-sm">
                        <span className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                          Hợp lệ: {validCount} người dùng
                        </span>
                        {errorCount > 0 && (
                          <span className="flex items-center">
                            <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                            Lỗi: {errorCount} người dùng
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setUploadedFile(null);
                          setImportedData([]);
                          setCurrentStep(1);
                        }}
                      >
                        Nhập lại file
                      </Button>
                      
                      {errorCount > 0 && validCount > 0 && (
                        <Button 
                          variant="outline"
                          onClick={handleImportValidOnly}
                        >
                          Chỉ nhập dữ liệu hợp lệ
                        </Button>
                      )}
                      
                      <Button 
                        onClick={handleImport}
                        disabled={validCount === 0}
                      >
                        {errorCount > 0 ? 'Nhập tất cả' : 'Nhập dữ liệu'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserImportPage;