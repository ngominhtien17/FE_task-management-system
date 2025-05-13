// src/pages/dashboard/index.tsx

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area
} from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import {
  Star,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  PlusCircle,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock8,
  AlertCircle
} from "lucide-react";

// Dữ liệu mẫu cho biểu đồ tiến độ công việc
const progressData = [
  { name: 'T2', hoanthanh: 25, dangthuchien: 50, quahan: 0 },
  { name: 'T3', hoanthanh: 38, dangthuchien: 40, quahan: 5 },
  { name: 'T4', hoanthanh: 45, dangthuchien: 32, quahan: 8 },
  { name: 'T5', hoanthanh: 52, dangthuchien: 25, quahan: 10 },
  { name: 'T6', hoanthanh: 60, dangthuchien: 30, quahan: 5 },
  { name: 'T7', hoanthanh: 65, dangthuchien: 20, quahan: 2 },
  { name: 'CN', hoanthanh: 70, dangthuchien: 15, quahan: 0 },
  { name: 'T2', hoanthanh: 75, dangthuchien: 20, quahan: 3 },
  { name: 'T3', hoanthanh: 80, dangthuchien: 15, quahan: 5 },
  { name: 'Hôm nay', hoanthanh: 85, dangthuchien: 10, quahan: 8 },
];

// Dữ liệu mẫu cho biểu đồ sử dụng tài nguyên
const resourceData = [
  { name: 'Phòng họp B.01', value: 78 },
  { name: 'Phòng Lab', value: 65 },
  { name: 'Máy chiếu 01', value: 58 },
  { name: 'Phòng hội thảo', value: 45 },
  { name: 'Máy quay video', value: 32 },
  { name: 'Máy tính sách tay', value: 18 },
];

// Dữ liệu mẫu cho hoạt động gần đây
const recentActivities = [
  { user: 'Nguyễn T.B', action: 'đã hoàn thành "Soạn đề thi cuối kỳ"', time: '20 phút trước' },
  { user: 'Trần V.C', action: 'đã cập nhật tiến độ "Chuẩn bị tài liệu hội nghị"', time: '1 giờ trước' },
  { user: 'Lê N.D', action: 'đã bình luận về "Dự án NCKH sinh viên"', time: '3 giờ trước' },
];

// Dữ liệu mẫu cho công việc ưu tiên
const priorityTasks = [
  { id: 1, title: 'Cập nhật báo cáo NCKH', deadline: 'Hôm nay, 17:00', status: 'quahan' },
  { id: 2, title: 'Hoàn thiện đề cương bài giảng', deadline: 'Ngày mai, 10:00', status: 'dangthuchien' },
  { id: 3, title: 'Gửi giải sinh viên thực tập', deadline: '12/05/2025', status: 'dangthuchien' },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const today = new Date();
  
  return (
    <div className="container mx-auto p-6 space-y-6 transition-all">
      {/* Breadcrumb và Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Trang chủ</span>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Tổng quan</span>
          </div>
          <div className="flex items-center justify-between w-full gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Trang chủ</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tuần này</span>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline-block">Chọn thời gian</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin chào mừng */}
      <Card className="border border-muted/40 shadow-sm transition-all hover:shadow-md">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-amber-500">👋</span>
                <h2 className="text-lg font-medium">Chào mừng, Nguyễn Văn A</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Thứ Bảy, {format(today, 'dd/MM/yyyy', { locale: vi })} | {13} công việc đang chờ xử lý
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />
                <span className="text-sm font-medium">85% hoàn thành đúng hạn</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium">3 công việc quá hạn</span>
              </div>
              <Button size="sm" variant="outline" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>Tạo công việc mới</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-muted/40 shadow-sm transition-all hover:shadow-md hover:bg-accent/5 active:scale-[0.98]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              Tổng số công việc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground mt-1">↑12% vs tuần trước</p>
          </CardContent>
        </Card>
        
        <Card className="border border-muted/40 shadow-sm transition-all hover:shadow-md hover:bg-accent/5 active:scale-[0.98]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Đã hoàn thành
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground mt-1">↑8% vs tuần trước</p>
          </CardContent>
        </Card>
        
        <Card className="border border-muted/40 shadow-sm transition-all hover:shadow-md hover:bg-accent/5 active:scale-[0.98]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              Công việc quá hạn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">↓25% vs tuần trước</p>
          </CardContent>
        </Card>
        
        <Card className="border border-muted/40 shadow-sm transition-all hover:shadow-md hover:bg-accent/5 active:scale-[0.98]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              Đang thực hiện
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">↑16% vs tuần trước</p>
          </CardContent>
        </Card>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phân bố trạng thái công việc */}
        <Card className="border border-muted/40 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Phân bố trạng thái công việc
            </CardTitle>
            <CardDescription className="text-xs">
              Cập nhật: Hôm nay, 15:30
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-60">
              <div className="ml-8 h-full flex items-end gap-4">
                <div className="flex flex-col items-center justify-end h-full w-16">
                  <div className="bg-blue-500 w-full h-[48%] rounded-t-sm"></div>
                  <span className="text-xs mt-1">Tổng</span>
                  <span className="text-xs font-medium">48</span>
                </div>
                <Separator orientation="vertical" className="h-[75%]" />
                <div className="flex flex-col items-center justify-end h-full w-16">
                  <div className="bg-gray-500 w-full h-[10%] rounded-t-sm"></div>
                  <span className="text-xs mt-1">Chưa bắt đầu</span>
                  <span className="text-xs font-medium">5</span>
                </div>
                <div className="flex flex-col items-center justify-end h-full w-16">
                  <div className="bg-green-500 w-full h-[50%] rounded-t-sm"></div>
                  <span className="text-xs mt-1">Đang thực hiện</span>
                  <span className="text-xs font-medium">24</span>
                </div>
                <div className="flex flex-col items-center justify-end h-full w-16">
                  <div className="bg-purple-500 w-full h-[33%] rounded-t-sm"></div>
                  <span className="text-xs mt-1">Hoàn thành</span>
                  <span className="text-xs font-medium">16</span>
                </div>
                <div className="flex flex-col items-center justify-end h-full w-16">
                  <div className="bg-red-500 w-full h-[6%] rounded-t-sm"></div>
                  <span className="text-xs mt-1">Quá hạn</span>
                  <span className="text-xs font-medium">3</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Công việc ưu tiên */}
        <Card className="border border-muted/40 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">
                Công việc ưu tiên
              </CardTitle>
              <CardDescription className="text-xs">
                Xem tất cả 
                <ChevronRight className="h-3 w-3 inline ml-1" />
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-60 pr-4">
              <div className="space-y-4">
                {priorityTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-muted hover:bg-accent/5 transition-all">
                    <div className="mt-0.5">
                      {task.status === 'quahan' && <AlertCircle className="h-5 w-5 text-red-500" />}
                      {task.status === 'dangthuchien' && <Clock8 className="h-5 w-5 text-amber-500" />}
                      {task.status === 'hoanthanh' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    </div>
                    <div className="flex flex-col flex-1">
                      <h4 className="text-sm font-medium leading-none">{task.title}</h4>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>Hạn: {task.deadline}</span>
                      </div>
                      {task.status === 'quahan' && (
                        <Badge variant="destructive" className="w-fit mt-2">Quá hạn</Badge>
                      )}
                      {task.status === 'dangthuchien' && (
                        <Badge variant="secondary" className="w-fit mt-2 bg-amber-100 text-amber-800 hover:bg-amber-200">Đang thực hiện</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Tiến độ công việc theo thời gian */}
        <Card className="border border-muted/40 shadow-sm transition-all hover:shadow-md md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Tiến độ công việc theo thời gian
              </CardTitle>
              <Tabs defaultValue="tuan">
                <TabsList className="h-7">
                  <TabsTrigger value="tuan" className="text-xs px-3">Tuần</TabsTrigger>
                  <TabsTrigger value="thang" className="text-xs px-3">Tháng</TabsTrigger>
                  <TabsTrigger value="quy" className="text-xs px-3">Quý</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-1.5">
                  <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                  <span className="text-xs">Hoàn thành</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Circle className="h-3 w-3 fill-blue-500 text-blue-500" />
                  <span className="text-xs">Đang thực hiện</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Circle className="h-3 w-3 fill-red-500 text-red-500" />
                  <span className="text-xs">Quá hạn</span>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart
                  data={progressData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="colorHoanthanh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorDangthuchien" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorQuahan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <RechartsTooltip />
                  <Area 
                    type="monotone" 
                    dataKey="hoanthanh" 
                    stroke="#10B981" 
                    fillOpacity={1}
                    fill="url(#colorHoanthanh)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="dangthuchien" 
                    stroke="#3B82F6" 
                    fillOpacity={1}
                    fill="url(#colorDangthuchien)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="quahan" 
                    stroke="#EF4444" 
                    fillOpacity={1}
                    fill="url(#colorQuahan)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sử dụng tài nguyên và Hoạt động gần đây */}
        <Card className="border border-muted/40 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Mức độ sử dụng tài nguyên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-60 pr-4">
              <div className="space-y-4">
                {resourceData.map((resource) => (
                  <div key={resource.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{resource.name}</span>
                      <span className="font-medium">{resource.value}%</span>
                    </div>
                    <Progress value={resource.value} className="h-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border border-muted/40 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-60 pr-4">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}