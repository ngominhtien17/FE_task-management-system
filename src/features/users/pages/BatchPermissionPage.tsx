// src/features/users/pages/BatchPermissionPage.tsx - Cải tiến
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

import { ArrowLeftIcon, UsersIcon, ShieldIcon, CheckCircleIcon, AlertTriangleIcon } from 'lucide-react';

import { UserFilter } from '../components/UserFilter';
import { UserPagination } from '../components/UserPagination';
import { UserDataTable } from '../components/UserDataTable';
import { RoleSelector } from '../components/UserRoleSelector';
import { PermissionSelector } from '../components/UserPermissionSelector';
import { BatchOperationSummary } from '../components/BatchOperationSummary';

const BatchPermissionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Multi-step state management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [operationMode, setOperationMode] = useState<'replace' | 'add' | 'remove'>('replace');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Enhanced step configuration
  const steps = [
    { 
      id: 1, 
      title: 'Chọn người dùng', 
      description: 'Lựa chọn người dùng cần phân quyền',
      icon: UsersIcon,
      validation: () => selectedUsers.length > 0
    },
    { 
      id: 2, 
      title: 'Cấu hình quyền', 
      description: 'Thiết lập vai trò và quyền hạn',
      icon: ShieldIcon,
      validation: () => selectedRoles.length > 0 || selectedPermissions.length > 0
    },
    { 
      id: 3, 
      title: 'Xác nhận và thực thi', 
      description: 'Xem lại và áp dụng thay đổi',
      icon: CheckCircleIcon,
      validation: () => true
    }
  ];

  // Initialize from previous selection
  useEffect(() => {
    if (location.state?.selectedUserIds) {
      setSelectedUsers(location.state.selectedUserIds);
    }
  }, [location.state]);

  // Calculate form progress
  const getStepProgress = () => {
    const completedSteps = steps.filter(step => step.validation()).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  // Enhanced navigation handlers
  const handleNextStep = async () => {
    const currentStepConfig = steps[currentStep - 1];
    
    if (!currentStepConfig.validation()) {
      // Show validation error
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Execute batch operation
      await executeBatchOperation();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/users');
    }
  };

  // Enhanced batch operation execution
  const executeBatchOperation = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      const totalUsers = selectedUsers.length;
      
      for (let i = 0; i < totalUsers; i++) {
        // Simulate processing each user
        await new Promise(resolve => setTimeout(resolve, 200));
        setProcessingProgress(Math.round(((i + 1) / totalUsers) * 100));
      }

      // Success handling
      setTimeout(() => {
        navigate('/users', {
          state: {
            successMessage: `Đã phân quyền thành công cho ${totalUsers} người dùng`,
            batchOperationResult: {
              mode: operationMode,
              userCount: totalUsers,
              roles: selectedRoles,
              permissions: selectedPermissions
            }
          }
        });
      }, 1000);

    } catch (error) {
      console.error('Batch operation failed:', error);
      setIsProcessing(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  Chọn người dùng cần phân quyền
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserFilter 
                  onSearch={() => {}} 
                  onFilter={() => {}}
                  showAdvanced={false}
                  onToggleAdvanced={() => {}}
                />
                
                <div className="mt-4">
                  <UserDataTable 
                    selectedUsers={selectedUsers}
                    onSelectionChange={setSelectedUsers}
                    multiSelect={true}
                  />
                </div>
              </CardContent>
            </Card>

            {selectedUsers.length > 0 && (
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      Đã chọn {selectedUsers.length} người dùng
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedUsers([])}
                    >
                      Bỏ chọn tất cả
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldIcon className="w-5 h-5" />
                  Cấu hình quyền hạn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Operation Mode Selector */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Chế độ phân quyền
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { 
                        mode: 'replace' as const, 
                        title: 'Thay thế', 
                        description: 'Thay thế toàn bộ quyền hiện tại' 
                      },
                      { 
                        mode: 'add' as const, 
                        title: 'Thêm mới', 
                        description: 'Thêm quyền vào quyền hiện tại' 
                      },
                      { 
                        mode: 'remove' as const, 
                        title: 'Gỡ bỏ', 
                        description: 'Gỡ bỏ quyền khỏi quyền hiện tại' 
                      }
                    ].map(({ mode, title, description }) => (
                      <Card 
                        key={mode}
                        className={`cursor-pointer transition-all ${
                          operationMode === mode ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setOperationMode(mode)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="font-medium">{title}</div>
                          <div className="text-xs text-gray-600 mt-1">{description}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Role Selection */}
                <RoleSelector 
                  selectedRoles={selectedRoles}
                  onSelectionChange={setSelectedRoles}
                  mode={operationMode}
                />

                <Separator />

                {/* Permission Selection */}
                <PermissionSelector 
                  selectedPermissions={selectedPermissions}
                  onSelectionChange={setSelectedPermissions}
                  mode={operationMode}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {isProcessing ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center space-y-4">
                    <div className="text-lg font-medium">
                      Đang thực hiện phân quyền hàng loạt...
                    </div>
                    <Progress value={processingProgress} className="w-full max-w-md mx-auto" />
                    <div className="text-sm text-gray-600">
                      {processingProgress}% hoàn thành
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <BatchOperationSummary 
                selectedUsers={selectedUsers}
                selectedRoles={selectedRoles}
                selectedPermissions={selectedPermissions}
                operationMode={operationMode}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Phân quyền hàng loạt</h1>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý quyền hạn cho nhiều người dùng cùng lúc
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/users')}
          disabled={isProcessing}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Tiến độ: Bước {currentStep} / {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {getStepProgress()}% hoàn thành
              </span>
            </div>
            
            <Progress value={getStepProgress()} className="h-2" />
            
            {/* Step indicators */}
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isValid = step.validation();
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted && isValid 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                          ? isValid 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-amber-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted && isValid ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : isActive && !isValid ? (
                        <AlertTriangleIcon className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="text-center max-w-24">
                      <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={isProcessing}
        >
          {currentStep === 1 ? 'Hủy' : 'Quay lại'}
        </Button>

        <Button
          onClick={handleNextStep}
          disabled={isProcessing || !steps[currentStep - 1].validation()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {currentStep === steps.length ? 'Thực hiện phân quyền' : 'Tiếp theo'}
        </Button>
      </div>
    </div>
  );
};

export default BatchPermissionPage;