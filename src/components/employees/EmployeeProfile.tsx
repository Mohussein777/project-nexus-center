
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  CalendarClock, Clock, Briefcase, LineChart, User, Mail, Phone, Building, Calendar, Award, FileText, Clock3, 
  Play, Pause, SquarePen, Calendar as CalendarIcon, BadgeCheck, Timer, UserCheck, ClipboardList
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Employee, TimeEntry } from './types';
import { 
  employees, projects, timeEntries, leaves, formatTimeSpent, 
  calculateTimeStats, getCurrentEmployeeStatus, getProjectById,
  startNewTimeEntry, stopTimeEntry
} from './employeeData';

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? parseInt(id) : 1; // استخدام معرف الموظف الأول افتراضيًا
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [timeStatus, setTimeStatus] = useState({ isActive: false, currentEntry: null as TimeEntry | null });
  const [timeStats, setTimeStats] = useState({ today: 0, week: 0, month: 0, projects: {} });
  const [activeTab, setActiveTab] = useState('overview');
  const [projectEntries, setProjectEntries] = useState<{[key: number]: TimeEntry[]}>({});
  const [newTimeEntry, setNewTimeEntry] = useState({
    projectId: null as number | null,
    description: '',
  });
  
  // جلب بيانات الموظف
  useEffect(() => {
    const employeeData = employees.find(emp => emp.id === employeeId) || null;
    setEmployee(employeeData);
    
    if (employeeData) {
      // جلب حالة تسجيل الوقت الحالية
      const status = getCurrentEmployeeStatus(employeeId);
      setTimeStatus(status);
      
      // حساب إحصائيات الوقت
      const stats = calculateTimeStats(employeeId);
      setTimeStats(stats);
      
      // تجميع التسجيلات حسب المشروع
      const entries = timeEntries.filter(entry => entry.employeeId === employeeId);
      const entriesByProject: {[key: number]: TimeEntry[]} = {};
      
      entries.forEach(entry => {
        if (entry.projectId !== null) {
          if (!entriesByProject[entry.projectId]) {
            entriesByProject[entry.projectId] = [];
          }
          entriesByProject[entry.projectId].push(entry);
        }
      });
      
      setProjectEntries(entriesByProject);
    }
  }, [employeeId]);
  
  const handleStartTime = () => {
    if (timeStatus.isActive || !employee) return;
    
    const newEntry = startNewTimeEntry(
      employee.id,
      newTimeEntry.projectId,
      newTimeEntry.description
    );
    
    setTimeStatus({
      isActive: true,
      currentEntry: newEntry
    });
    
    // في التطبيق الحقيقي، سيتم تحديث البيانات من الخادم بعد الإضافة
  };
  
  const handleStopTime = () => {
    if (!timeStatus.isActive || !timeStatus.currentEntry || !employee) return;
    
    const updatedEntry = stopTimeEntry(timeStatus.currentEntry.id);
    
    if (updatedEntry) {
      setTimeStatus({
        isActive: false,
        currentEntry: null
      });
      
      // تحديث إحصائيات الوقت
      const stats = calculateTimeStats(employee.id);
      setTimeStats(stats);
      
      // في التطبيق الحقيقي، سيتم تحديث البيانات من الخادم بعد التحديث
    }
  };
  
  if (!employee) {
    return <div className="flex justify-center items-center h-96">جاري تحميل البيانات...</div>;
  }
  
  const currentProject = timeStatus.currentEntry && timeStatus.currentEntry.projectId 
    ? getProjectById(timeStatus.currentEntry.projectId) 
    : null;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">ملف الموظف</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* معلومات الموظف */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${employee.color} flex items-center justify-center text-white font-bold text-2xl`}>
                {employee.avatar}
              </div>
              <div>
                <CardTitle className="text-xl">{employee.name}</CardTitle>
                <CardDescription>{employee.position}</CardDescription>
                <div className="mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    employee.status === 'Active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : employee.status === 'On Leave'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {employee.status === 'Active' ? 'نشط' : employee.status === 'On Leave' ? 'في إجازة' : 'غير نشط'}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <BadgeCheck size={16} className="mr-2 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">رقم الموظف:</span>
                <span className="mr-2">{employee.employeeId}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Mail size={16} className="mr-2 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">البريد الإلكتروني:</span>
                <a href={`mailto:${employee.email}`} className="mr-2 text-primary hover:underline">{employee.email}</a>
              </div>
              
              <div className="flex items-center text-sm">
                <Phone size={16} className="mr-2 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">الهاتف:</span>
                <span className="mr-2">{employee.phone}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Building size={16} className="mr-2 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">القسم:</span>
                <span className="mr-2">{employee.department}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <User size={16} className="mr-2 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">المدير:</span>
                <span className="mr-2">{employee.manager || 'غير محدد'}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar size={16} className="mr-2 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">تاريخ التعيين:</span>
                <span className="mr-2">{employee.joinDate}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Clock3 size={16} className="mr-2 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">ساعات العمل:</span>
                <span className="mr-2">{employee.workHours?.start || '08:00'} - {employee.workHours?.end || '16:00'}</span>
              </div>
            </div>
            
            {employee.skills && employee.skills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <Award size={16} className="mr-2" />
                  المهارات
                </h4>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill, index) => (
                    <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* نظام تسجيل الوقت - مستوحى من Clockify */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CalendarClock size={20} className="mr-2" />
              تسجيل الوقت
            </CardTitle>
            <CardDescription>سجل وقت عملك على المشاريع والمهام</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-4">
            {/* واجهة تسجيل الوقت المستوحاة من Clockify */}
            <div className="glass-card dark:glass-card-dark p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="w-full sm:w-1/3">
                  <Select
                    value={timeStatus.currentEntry?.projectId?.toString() || newTimeEntry.projectId?.toString() || ''}
                    onValueChange={(value) => setNewTimeEntry({
                      ...newTimeEntry,
                      projectId: value ? parseInt(value) : null
                    })}
                    disabled={timeStatus.isActive}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر المشروع" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${project.color} mr-2`}></div>
                            {project.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full sm:flex-1">
                  <input
                    type="text"
                    placeholder="ما الذي تعمل عليه؟"
                    className="w-full px-3 py-2 border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={timeStatus.currentEntry?.description || newTimeEntry.description}
                    onChange={(e) => setNewTimeEntry({
                      ...newTimeEntry,
                      description: e.target.value
                    })}
                    disabled={timeStatus.isActive}
                  />
                </div>
                
                <div className="w-40 text-center font-mono text-xl">
                  {timeStatus.isActive ? (
                    <div className="animate-pulse-subtle">
                      <span className="text-primary">تسجيل مستمر</span>
                    </div>
                  ) : (
                    <div>00:00:00</div>
                  )}
                </div>
                
                <div>
                  {timeStatus.isActive ? (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-20"
                      onClick={handleStopTime}
                    >
                      <Pause size={16} className="mr-1" />
                      إيقاف
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-20 bg-green-600 hover:bg-green-700"
                      onClick={handleStartTime}
                      disabled={!newTimeEntry.projectId || !newTimeEntry.description}
                    >
                      <Play size={16} className="mr-1" />
                      بدء
                    </Button>
                  )}
                </div>
              </div>
              
              {timeStatus.isActive && currentProject && (
                <div className="mt-4 bg-primary/10 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${currentProject.color} mr-2`}></div>
                    <span className="font-medium">{currentProject.name}</span>
                    <span className="mx-2">-</span>
                    <span className="text-muted-foreground">{timeStatus.currentEntry?.description}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    بدأ منذ: {new Date(timeStatus.currentEntry?.startTime || '').toLocaleTimeString()} 
                  </div>
                </div>
              )}
            </div>
            
            {/* ملخص إحصائيات الوقت */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">اليوم</div>
                    <div className="text-3xl font-bold mt-1">{formatTimeSpent(timeStats.today)}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">هذا الأسبوع</div>
                    <div className="text-3xl font-bold mt-1">{formatTimeSpent(timeStats.week)}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">هذا الشهر</div>
                    <div className="text-3xl font-bold mt-1">{formatTimeSpent(timeStats.month)}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* التبويبات: الوقت، المشاريع، الإجازات */}
      <Tabs defaultValue="time" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="time" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>سجل الوقت</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            <span>المشاريع</span>
          </TabsTrigger>
          <TabsTrigger value="leaves" className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>الإجازات</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            <span>التقارير</span>
          </TabsTrigger>
        </TabsList>
        
        {/* محتوى تبويب سجل الوقت */}
        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Timer size={18} className="mr-2" />
                سجل الوقت الأخير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeEntries
                  .filter(entry => entry.employeeId === employee.id)
                  .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                  .slice(0, 5)
                  .map(entry => {
                    const project = entry.projectId ? getProjectById(entry.projectId) : null;
                    return (
                      <div key={entry.id} className="flex items-center p-3 border rounded-lg hover:bg-muted/40 transition-colors">
                        <div className="mr-4">
                          {entry.status === 'active' ? (
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse-subtle">
                              <Play size={18} />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                              <Clock size={18} />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center">
                            {project && (
                              <>
                                <div className={`w-3 h-3 rounded-full ${project.color} mr-2`}></div>
                                <span className="font-medium">{project.name}</span>
                                <span className="mx-2">-</span>
                              </>
                            )}
                            <span>{entry.description}</span>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mt-1">
                            {new Date(entry.startTime).toLocaleDateString()} • 
                            {new Date(entry.startTime).toLocaleTimeString()} - 
                            {entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : 'مستمر'}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium">
                            {entry.status === 'active' ? 'مستمر' : formatTimeSpent(entry.duration || 0)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                
                {timeEntries.filter(entry => entry.employeeId === employee.id).length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    لا توجد تسجيلات وقت
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileText size={16} className="mr-2" />
                عرض السجل الكامل
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* محتوى تبويب المشاريع */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Briefcase size={18} className="mr-2" />
                المشاريع النشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.keys(projectEntries).length > 0 ? (
                  Object.entries(projectEntries).map(([projectId, entries]) => {
                    const project = getProjectById(parseInt(projectId));
                    if (!project) return null;
                    
                    const totalTime = entries.reduce((total, entry) => {
                      return total + (entry.duration || 0);
                    }, 0);
                    
                    return (
                      <div key={projectId} className="p-4 border rounded-lg hover:bg-muted/40 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${project.color} mr-2`}></div>
                            <h4 className="font-medium">{project.name}</h4>
                          </div>
                          <div className="font-medium">{formatTimeSpent(totalTime)}</div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mt-1">
                          {project.client}
                        </div>
                        
                        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${project.color.replace('bg-', 'bg-')}`}
                            style={{ width: `${Math.min(totalTime / 36000 * 100, 100)}%` }}
                          ></div>
                        </div>
                        
                        <div className="mt-3 text-sm">
                          <span className="text-muted-foreground">آخر نشاط: </span>
                          {new Date(entries[0].startTime).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    لا توجد مشاريع نشطة
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* محتوى تبويب الإجازات */}
        <TabsContent value="leaves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CalendarIcon size={18} className="mr-2" />
                الإجازات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaves
                  .filter(leave => leave.employeeId === employee.id)
                  .map(leave => (
                    <div key={leave.id} className="p-4 border rounded-lg hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium flex items-center">
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                              leave.type === 'Annual' ? 'bg-blue-500' :
                              leave.type === 'Sick' ? 'bg-red-500' :
                              leave.type === 'Personal' ? 'bg-purple-500' : 'bg-gray-500'
                            }`}></span>
                            {leave.type === 'Annual' ? 'إجازة سنوية' :
                             leave.type === 'Sick' ? 'إجازة مرضية' :
                             leave.type === 'Personal' ? 'إجازة شخصية' : 'إجازة أخرى'}
                          </h4>
                          <div className="text-sm text-muted-foreground mt-1">
                            من {leave.startDate} إلى {leave.endDate}
                          </div>
                        </div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            leave.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {leave.status === 'Approved' ? 'موافق عليها' :
                             leave.status === 'Pending' ? 'قيد المراجعة' : 'مرفوضة'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">السبب: </span>
                        {leave.reason}
                      </div>
                    </div>
                  ))}
                
                {leaves.filter(leave => leave.employeeId === employee.id).length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    لا توجد إجازات مسجلة
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <SquarePen size={16} className="mr-2" />
                طلب إجازة جديدة
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* محتوى تبويب التقارير */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <LineChart size={18} className="mr-2" />
                تقارير الوقت
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-lg">
                <div className="text-center text-muted-foreground">
                  <LineChart size={48} className="mx-auto mb-2 opacity-20" />
                  <p>سيتم عرض الرسوم البيانية للوقت هنا</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">إجمالي الوقت</div>
                      <div className="text-2xl font-bold mt-1">168:45</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">معدل ساعات العمل اليومية</div>
                      <div className="text-2xl font-bold mt-1">07:45</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">أيام الحضور</div>
                      <div className="text-2xl font-bold mt-1">21/23</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">نسبة العمل على المشاريع</div>
                      <div className="text-2xl font-bold mt-1">85%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileText size={16} className="mr-2" />
                تصدير التقارير
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
