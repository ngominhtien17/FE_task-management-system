// src/features/tasks/pages/TaskWorkflowGuidePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, CheckCircle2, ClipboardList, Clock, 
  AlertTriangle, Info, Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TaskWorkflowGuidePage() {
  const navigate = useNavigate();
  const [activeState, setActiveState] = useState('in_progress');
  
  // Mock data for demonstration
  const statusList = [
    { id: 'not_started', label: 'Chưa bắt đầu', icon: <ClipboardList className="w-6 h-6" />, color: 'text-slate-600 bg-slate-100 border-slate-200' },
    { id: 'in_progress', label: 'Đang thực hiện', icon: <Clock className="w-6 h-6" />, color: 'text-blue-600 bg-blue-100 border-blue-200' },
    { id: 'pending', label: 'Chờ xử lý', icon: <Clock className="w-6 h-6" />, color: 'text-amber-600 bg-amber-100 border-amber-200' },
    { id: 'overdue', label: 'Quá hạn', icon: <AlertTriangle className="w-6 h-6" />, color: 'text-red-600 bg-red-100 border-red-200' },
    { id: 'completed', label: 'Hoàn thành', icon: <CheckCircle2 className="w-6 h-6" />, color: 'text-green-600 bg-green-100 border-green-200' }
  ];
  
  // Các chức năng liên quan đến mỗi trạng thái và thông tin demo
  const stateFeatures = {
    not_started: [
      { 
        label: 'Xem chi tiết công việc', 
        path: '/task/detail/4', 
        description: 'Xem thông tin chi tiết về công việc chưa bắt đầu',
        taskName: 'Soạn đề thi cuối kỳ'
      },
      { 
        label: 'Cập nhật tiến độ', 
        path: '/task/progress/4',
        description: 'Bắt đầu thực hiện và cập nhật tiến độ công việc',
        taskName: 'Soạn đề thi cuối kỳ'
      }
    ],
    in_progress: [
      { 
        label: 'Xem chi tiết công việc', 
        path: '/task/detail/2',
        description: 'Xem thông tin chi tiết về công việc đang thực hiện',
        taskName: 'Hoàn thiện đề cương bài giảng'
      },
      { 
        label: 'Cập nhật tiến độ', 
        path: '/task/progress/2',
        description: 'Cập nhật tiến độ của công việc đang thực hiện',
        taskName: 'Hoàn thiện đề cương bài giảng'
      },
      { 
        label: 'Báo cáo hoàn thành', 
        path: '/task/complete/2',
        description: 'Báo cáo đã hoàn thành công việc',
        taskName: 'Hoàn thiện đề cương bài giảng'
      }
    ],
    pending: [
      { 
        label: 'Xem chi tiết công việc', 
        path: '/task/detail/5',
        description: 'Xem thông tin chi tiết về công việc đang chờ xử lý',
        taskName: 'Họp hội đồng khoa học'
      }
    ],
    overdue: [
      { 
        label: 'Xem chi tiết công việc', 
        path: '/task/detail/1',
        description: 'Xem thông tin chi tiết về công việc quá hạn',
        taskName: 'Cập nhật báo cáo NCKH'
      },
      { 
        label: 'Cập nhật tiến độ', 
        path: '/task/progress/1',
        description: 'Cập nhật tiến độ hiện tại của công việc quá hạn',
        taskName: 'Cập nhật báo cáo NCKH'
      },
      { 
        label: 'Yêu cầu gia hạn', 
        path: '/task/extend/1',
        description: 'Yêu cầu gia hạn thời gian hoàn thành',
        taskName: 'Cập nhật báo cáo NCKH'
      }
    ],
    completed: [
      { 
        label: 'Xem chi tiết công việc', 
        path: '/task/detail/9',
        description: 'Xem thông tin chi tiết về công việc đã hoàn thành',
        taskName: 'Biên soạn đề cương môn học'
      },
      { 
        label: 'Đánh giá công việc', 
        path: '/task/evaluate/9',
        description: 'Đánh giá công việc đã hoàn thành',
        taskName: 'Biên soạn đề cương môn học',
        role: 'manager'
      },
      { 
        label: 'Phản hồi đánh giá', 
        path: '/task/feedback/9',
        description: 'Phản hồi về đánh giá công việc',
        taskName: 'Biên soạn đề cương môn học',
        role: 'assignee'
      }
    ]
  };

  // Các chức năng quản lý chung
  const managementFeatures = [
    { 
      label: 'Quản lý công việc dạng danh sách', 
      path: '/task/list',
      description: 'Xem tất cả công việc dưới dạng danh sách',
      icon: <ClipboardList className="w-6 h-6" />
    },
    { 
      label: 'Quản lý công việc dạng Kanban', 
      path: '/task/kanban',
      description: 'Xem và quản lý công việc dưới dạng bảng Kanban',
      icon: <ClipboardList className="w-6 h-6" />
    },
    { 
      label: 'Tạo công việc mới', 
      path: '/task/create',
      description: 'Tạo một công việc mới trong hệ thống',
      icon: <ClipboardList className="w-6 h-6" />
    },
    { 
      label: 'Phân công công việc hàng loạt', 
      path: '/task/batch-assign',
      description: 'Phân công nhiều công việc cùng lúc cho nhiều người',
      icon: <ClipboardList className="w-6 h-6" />
    },
    { 
      label: 'Quản lý danh mục công việc', 
      path: '/task/categories',
      description: 'Quản lý các danh mục và phân loại công việc',
      icon: <ClipboardList className="w-6 h-6" />
    }
  ];
  
  const handleStatusChange = (statusId: string) => {
    setActiveState(statusId);
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Hướng dẫn quy trình quản lý công việc</h1>
      
      <Tabs defaultValue="workflow" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workflow">Quy trình xử lý công việc</TabsTrigger>
          <TabsTrigger value="management">Chức năng quản lý</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workflow" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Luồng xử lý theo trạng thái công việc</CardTitle>
              <CardDescription>
                Mỗi trạng thái công việc sẽ có các hành động phù hợp. Chọn trạng thái để xem các hành động có thể thực hiện.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Flow chart visualization */}
              <div className="mb-8">
                <div className="flex justify-between items-center flex-wrap gap-y-4">
                  {statusList.map((status, index) => (
                    <div key={status.id} className="flex items-center">
                      <div 
                        className={`flex flex-col items-center cursor-pointer ${activeState === status.id ? 'scale-110 transition-transform' : 'opacity-80'}`}
                        onClick={() => handleStatusChange(status.id)}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 border ${status.color}`}>
                          {status.icon}
                        </div>
                        <span className="text-sm font-medium text-center">{status.label}</span>
                      </div>
                      
                      {index < statusList.length - 1 && (
                        <ArrowRight className="mx-2 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Features for selected state */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-3 text-gray-700">
                  Chức năng cho trạng thái: {statusList.find(s => s.id === activeState)?.label}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stateFeatures[activeState as keyof typeof stateFeatures]?.map((feature, index) => (
                    <Card key={index} className="border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">{feature.label}</CardTitle>
                        <CardDescription className="text-xs">{feature.taskName}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex flex-col">
                        <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                        {feature.role && (
                          <Badge variant="outline" className="self-start mb-3">
                            {feature.role === 'manager' ? 'Vai trò: Quản lý' : 'Vai trò: Người thực hiện'}
                          </Badge>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-auto self-end"
                          onClick={() => handleNavigate(feature.path)}
                        >
                          <LinkIcon className="mr-1 h-4 w-4" /> Mở trang
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-start gap-3">
            <Info className="text-blue-500 h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-700">
                Hệ thống quản lý công việc hỗ trợ đầy đủ luồng quy trình từ khi tạo công việc đến khi hoàn thành và đánh giá.
                Dựa trên vai trò và trạng thái công việc, bạn có thể thực hiện các hành động khác nhau.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Ví dụ: Đối với công việc quá hạn, bạn có thể cập nhật tiến độ hoặc yêu cầu gia hạn thời gian.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="management" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chức năng quản lý công việc</CardTitle>
              <CardDescription>
                Các chức năng chính để quản lý công việc trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {managementFeatures.map((feature, index) => (
                  <Card key={index} className="border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        {feature.icon}
                        {feature.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                      <Button 
                        onClick={() => handleNavigate(feature.path)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Truy cập chức năng
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start gap-3">
            <Info className="text-amber-500 h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-700">
                Các chức năng quản lý giúp bạn tổ chức và theo dõi công việc một cách hiệu quả. Bạn có thể sử dụng chế độ xem danh sách hoặc kanban tùy theo nhu cầu.
              </p>
              <p className="text-sm text-amber-700 mt-2">
                Việc phân loại công việc theo danh mục giúp dễ dàng quản lý và tìm kiếm hơn.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TaskWorkflowGuidePage;