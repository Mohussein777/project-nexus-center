
import { useState, useEffect } from 'react';
import { Calendar, Clock, UserCheck, Filter, Download, ArrowUpDown, Check, AlertCircle } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { getEmployees, getTimeEntries, formatTimeSpent } from '@/services/employeeService';
import { Employee, TimeEntry } from './types';
import { TimeTrackingWidget } from './TimeTrackingWidget';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserTimeEntries, setCurrentUserTimeEntries] = useState<TimeEntry[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [currentUserEmployee, setCurrentUserEmployee] = useState<Employee | null>(null);
  
  // البحث عن معرّف الموظف الخاص بالمستخدم الحالي
  useEffect(() => {
    const fetchCurrentUserEmployee = async () => {
      if (!user?.email) return;

      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('email', user.email)
          .single();
        
        if (error) {
          console.error('Error fetching current user employee:', error);
          return;
        }
        
        if (data) {
          // Convert the Supabase data to our Employee type
          const employeeData: Employee = {
            id: Number(data.id),
            name: data.name,
            position: data.position, 
            email: data.email,
            phone: data.phone || '',
            department: data.department,
            joinDate: data.join_date,
            status: data.status as 'Active' | 'On Leave' | 'Inactive',
            avatar: data.name.split(' ').map((n: string) => n[0]).join(''),
            color: 'from-blue-500 to-cyan-500', // Default color
            projects: 0,
            employeeId: data.employee_id || '',
            manager: data.manager || ''
          };
          setCurrentUserEmployee(employeeData);
        }
      } catch (error) {
        console.error('Error in fetchCurrentUserEmployee:', error);
      }
    };
    
    fetchCurrentUserEmployee();
  }, [user]);
  
  // تحميل بيانات الحضور والانصراف
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await getEmployees();
        setEmployees(employeesData);
        
        // جلب بيانات الحضور لليوم المحدد
        const entriesData = await getTimeEntries(selectedDate);
        setTimeEntries(entriesData);
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل بيانات الحضور",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, toast]);
  
  // جلب سجل الحضور الخاص بالمستخدم الحالي
  useEffect(() => {
    const fetchUserTimeEntries = async () => {
      if (!currentUserEmployee) return;
      
      try {
        const { data, error } = await supabase
          .from('time_entries')
          .select('*')
          .eq('employee_id', currentUserEmployee.id.toString())
          .order('date', { ascending: false })
          .order('start_time', { ascending: false })
          .limit(20);
          
        if (error) throw error;
        
        // Convert the Supabase data to our TimeEntry type
        const timeEntriesData = data.map(entry => ({
          id: Number(entry.id),
          employeeId: Number(entry.employee_id),
          projectId: entry.project_id,
          taskId: entry.task_id || null,
          startTime: entry.start_time,
          endTime: entry.end_time || null,
          duration: entry.duration || null,
          description: entry.description || '',
          date: entry.date,
          status: entry.status as 'active' | 'completed'
        }));
        
        setCurrentUserTimeEntries(timeEntriesData);
      } catch (error) {
        console.error('Error fetching user time entries:', error);
      }
    };
    
    fetchUserTimeEntries();
  }, [currentUserEmployee]);
  
  // تجميع البيانات للعرض
  useEffect(() => {
    if (loading) return;
    
    // في التطبيق الحقيقي، سيتم جلب البيانات من الخادم بناءً على التصفية
    const data = employees.map(employee => {
      // تصفية حسب القسم إذا كان محددًا
      if (selectedDepartment !== 'all' && employee.department !== selectedDepartment) {
        return null;
      }
      
      // البحث عن تسجيلات الوقت لهذا اليوم
      const todayEntries = timeEntries.filter(
        entry => entry.employeeId === employee.id && entry.date === selectedDate
      );
      
      // حساب وقت العمل الإجمالي
      const totalWorkTime = todayEntries.reduce((total, entry) => {
        return total + (entry.duration || 0);
      }, 0);
      
      // الوقت الأول في اليوم (بداية العمل)
      const firstEntry = todayEntries.sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )[0];
      
      // الوقت الأخير في اليوم (نهاية العمل)
      const lastEntry = todayEntries.sort((a, b) => 
        new Date(b.endTime || b.startTime).getTime() - new Date(a.endTime || a.startTime).getTime()
      )[0];
      
      // حالة الحضور
      let status = 'غائب';
      if (todayEntries.length > 0) {
        status = todayEntries.some(entry => entry.status === 'active') ? 'يعمل حاليًا' : 'حاضر';
      } else if (employee.status === 'On Leave') {
        status = 'في إجازة';
      }
      
      return {
        id: employee.id,
        name: employee.name,
        avatar: employee.avatar,
        color: employee.color,
        position: employee.position,
        department: employee.department,
        clockIn: firstEntry ? new Date(firstEntry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
        clockOut: lastEntry && lastEntry.endTime ? new Date(lastEntry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
        totalTime: formatTimeSpent(totalWorkTime),
        status: status,
        active: todayEntries.some(entry => entry.status === 'active'),
        entries: todayEntries.length
      };
    }).filter(Boolean); // إزالة القيم الفارغة
    
    setAttendanceData(data);
  }, [employees, timeEntries, selectedDate, selectedDepartment, loading]);
  
  // الحصول على قائمة الأقسام الفريدة
  const departments = [...new Set(employees.map(employee => employee.department))];
  
  // حساب إحصائيات الحضور
  const presentCount = attendanceData.filter(employee => 
    employee.status === 'حاضر' || employee.status === 'يعمل حاليًا'
  ).length;
  
  const absentCount = attendanceData.filter(employee => 
    employee.status === 'غائب'
  ).length;
  
  const leaveCount = attendanceData.filter(employee => 
    employee.status === 'في إجازة'
  ).length;
  
  const activeCount = attendanceData.filter(employee => 
    employee.active
  ).length;

  // تحديث البيانات بعد تغييرات تسجيل الوقت
  const handleTimeEntryUpdate = async () => {
    // إعادة تحميل بيانات الحضور
    setLoading(true);
    try {
      const entriesData = await getTimeEntries(selectedDate);
      setTimeEntries(entriesData);
      
      // تحديث سجل الحضور للمستخدم الحالي
      if (currentUserEmployee) {
        const { data, error } = await supabase
          .from('time_entries')
          .select('*')
          .eq('employee_id', currentUserEmployee.id.toString())
          .order('date', { ascending: false })
          .order('start_time', { ascending: false })
          .limit(20);
          
        if (error) throw error;
        
        // Convert the Supabase data to our TimeEntry type
        const timeEntriesData = data.map(entry => ({
          id: Number(entry.id),
          employeeId: Number(entry.employee_id),
          projectId: entry.project_id,
          taskId: entry.task_id || null,
          startTime: entry.start_time,
          endTime: entry.end_time || null,
          duration: entry.duration || null,
          description: entry.description || '',
          date: entry.date,
          status: entry.status as 'active' | 'completed'
        }));
        
        setCurrentUserTimeEntries(timeEntriesData);
      }
    } catch (error) {
      console.error('Error refreshing attendance data:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث بيانات الحضور",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // تنسيق التاريخ باللغة العربية
  const formatDateInArabic = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'EEEE، d MMMM yyyy', { locale: ar });
    } catch (error) {
      return dateStr;
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">إدارة الحضور والانصراف</h1>
            <TabsList className="mt-2">
              <TabsTrigger value="all">كل الموظفين</TabsTrigger>
              <TabsTrigger value="personal">سجل الدوام الشخصي</TabsTrigger>
            </TabsList>
          </div>
          
          {activeTab === "all" && (
            <div className="flex items-center space-x-2">
              <div className="w-40">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="كل الأقسام" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الأقسام</SelectItem>
                  {departments.map((department, index) => (
                    <SelectItem key={index} value={department}>{department}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Filter size={16} className="ml-2" />
                تصفية متقدمة
              </Button>
              
              <Button variant="outline">
                <Download size={16} className="ml-2" />
                تصدير
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">الحاضرون</p>
                    <p className="text-3xl font-bold mt-1">{presentCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <UserCheck size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">الغائبون</p>
                    <p className="text-3xl font-bold mt-1">{absentCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                    <AlertCircle size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">في إجازة</p>
                    <p className="text-3xl font-bold mt-1">{leaveCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Calendar size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">يعملون حاليًا</p>
                    <p className="text-3xl font-bold mt-1">{activeCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Clock size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>سجل الحضور</CardTitle>
              <CardDescription>
                سجل الحضور والانصراف ليوم {formatDateInArabic(selectedDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">الموظف</TableHead>
                      <TableHead>القسم</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          وقت الحضور
                          <ArrowUpDown size={14} className="mr-1 text-muted-foreground" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          وقت الانصراف
                          <ArrowUpDown size={14} className="mr-1 text-muted-foreground" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          إجمالي الوقت
                          <ArrowUpDown size={14} className="mr-1 text-muted-foreground" />
                        </div>
                      </TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>التفاصيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${employee.color} flex items-center justify-center text-white font-bold`}>
                              {employee.avatar}
                            </div>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-xs text-muted-foreground">{employee.position}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.clockIn}</TableCell>
                        <TableCell>{employee.clockOut}</TableCell>
                        <TableCell>{employee.totalTime}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            employee.status === 'حاضر' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : employee.status === 'يعمل حاليًا'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse-subtle'
                              : employee.status === 'في إجازة'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {employee.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            التفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {attendanceData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          لا توجد بيانات للعرض
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="personal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              {currentUserEmployee ? (
                <TimeTrackingWidget 
                  employeeId={currentUserEmployee.id.toString()} 
                  onTimeEntryUpdate={handleTimeEntryUpdate}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>تسجيل الوقت</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-8 text-muted-foreground">
                    لم نتمكن من العثور على معلومات الموظف الخاصة بك
                  </CardContent>
                </Card>
              )}
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">الإحصائيات الشخصية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">معدل العمل اليومي</span>
                      <span className="font-medium">8:00 ساعة</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">إجمالي ساعات هذا الأسبوع</span>
                      <span className="font-medium">32:45 ساعة</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">إجمالي ساعات هذا الشهر</span>
                      <span className="font-medium">120:30 ساعة</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>سجل الحضور الشخصي</CardTitle>
                  <CardDescription>آخر 20 تسجيل للحضور</CardDescription>
                </CardHeader>
                <CardContent>
                  {currentUserTimeEntries.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>التاريخ</TableHead>
                          <TableHead>وقت الحضور</TableHead>
                          <TableHead>وقت الانصراف</TableHead>
                          <TableHead>المدة</TableHead>
                          <TableHead>الحالة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentUserTimeEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{formatDateInArabic(entry.date)}</TableCell>
                            <TableCell>
                              {new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </TableCell>
                            <TableCell>
                              {entry.endTime 
                                ? new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : '-'
                              }
                            </TableCell>
                            <TableCell>
                              {entry.duration ? formatTimeSpent(entry.duration) : '-'}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entry.status === 'active' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse-subtle'
                                  : entry.status === 'completed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {entry.status === 'active' ? 'قيد التسجيل' : 'مكتمل'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      لا توجد سجلات حضور سابقة
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
