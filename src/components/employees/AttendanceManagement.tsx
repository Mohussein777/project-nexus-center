
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

import { employees, timeEntries, formatTimeSpent } from './employeeData';

export function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  
  // تجميع البيانات للعرض
  useEffect(() => {
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
  }, [selectedDate, selectedDepartment]);
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">إدارة الحضور والانصراف</h1>
        
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
      </div>
      
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
      
      <Card>
        <CardHeader>
          <CardTitle>سجل الحضور</CardTitle>
          <CardDescription>
            سجل الحضور والانصراف ليوم {new Date(selectedDate).toLocaleDateString('ar-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
