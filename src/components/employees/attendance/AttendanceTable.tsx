
import { Loader2, ArrowUpDown } from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Employee, TimeEntry } from '../types';
import { formatTimeSpent } from '@/services/employeeService';

interface AttendanceTableProps {
  employees: Employee[];
  timeEntriesByEmployee: Record<string, TimeEntry[]>;
  selectedDate: string;
  loading?: boolean;
}

export function AttendanceTable({ 
  loading, 
  employees,
  timeEntriesByEmployee,
  selectedDate
}: AttendanceTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Process employees and time entries to display in the table
  const attendanceData = employees.map(employee => {
    const employeeId = employee.id.toString();
    const entries = timeEntriesByEmployee[employeeId] || [];
    
    // Filter entries for the selected date
    const todayEntries = entries.filter(entry => entry.date === selectedDate);
    
    // Get the first entry for the day (clock in)
    const firstEntry = todayEntries.length > 0 ? 
      todayEntries.reduce((earliest, entry) => {
        return new Date(entry.startTime) < new Date(earliest.startTime) ? entry : earliest;
      }, todayEntries[0]) : null;
    
    // Calculate if the employee is currently active
    const activeEntry = todayEntries.find(entry => entry.status === 'active');
    const isActive = !!activeEntry;
    
    // Calculate total time for today
    const totalSeconds = todayEntries.reduce((total, entry) => {
      return total + (entry.duration || 0);
    }, 0);
    
    // Determine status
    let status = 'غائب';
    if (isActive) {
      status = 'يعمل حاليًا';
    } else if (todayEntries.length > 0) {
      status = 'حاضر';
    }
    
    return {
      id: employee.id,
      name: employee.name,
      avatar: employee.avatar || employee.name.split(' ').map(n => n[0]).join(''),
      color: employee.color,
      position: employee.position,
      department: employee.department,
      clockIn: firstEntry ? new Date(firstEntry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      clockOut: isActive ? '-' : todayEntries.length > 0 ? 
        new Date(todayEntries[todayEntries.length - 1].endTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
      totalTime: formatTimeSpent(totalSeconds),
      status,
      active: isActive,
      entries: todayEntries.length
    };
  });

  return (
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
  );
}
