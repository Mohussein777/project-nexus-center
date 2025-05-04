
import { Loader2, ArrowUpDown } from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface AttendanceEntry {
  id: number;
  name: string;
  avatar: string;
  color: string;
  position: string;
  department: string;
  clockIn: string;
  clockOut: string;
  totalTime: string;
  status: string;
  active: boolean;
  entries: number;
}

interface AttendanceTableProps {
  loading: boolean;
  attendanceData: AttendanceEntry[];
}

export function AttendanceTable({ loading, attendanceData }: AttendanceTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
