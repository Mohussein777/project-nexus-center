
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterControls } from './FilterControls';
import { AttendanceStatsCards } from './StatsCards';
import { AttendanceTable } from './AttendanceTable';
import { Employee, TimeEntry } from '../types';
import { useToast } from "@/hooks/use-toast";
import { formatTimeSpent } from './attendanceUtils';

interface AllEmployeesAttendanceProps {
  employees: Employee[];
  timeEntries: TimeEntry[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  loading: boolean;
}

export function AllEmployeesAttendance({ 
  employees, 
  timeEntries, 
  selectedDate, 
  onDateChange,
  loading 
}: AllEmployeesAttendanceProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Get unique departments for filtering
  const departments = [...new Set(employees.map(employee => employee.department))];
  
  // Process data for display
  useEffect(() => {
    if (loading) return;
    
    // In a real app, this data would come from the server based on filters
    const data = employees.map(employee => {
      // Filter by department if specified
      if (selectedDepartment !== 'all' && employee.department !== selectedDepartment) {
        return null;
      }
      
      // Find time entries for this employee on the selected date
      const todayEntries = timeEntries.filter(
        entry => entry.employeeId === employee.id && entry.date === selectedDate
      );
      
      // Calculate total work time
      const totalWorkTime = todayEntries.reduce((total, entry) => {
        return total + (entry.duration || 0);
      }, 0);
      
      // Get first entry of the day (clock in)
      const firstEntry = todayEntries.sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )[0];
      
      // Get last entry of the day (clock out)
      const lastEntry = todayEntries.sort((a, b) => 
        new Date(b.endTime || b.startTime).getTime() - new Date(a.endTime || a.startTime).getTime()
      )[0];
      
      // Determine attendance status
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
        status,
        active: todayEntries.some(entry => entry.status === 'active'),
        entries: todayEntries.length
      };
    }).filter(Boolean); // Remove null entries
    
    setAttendanceData(data);
  }, [employees, timeEntries, selectedDate, selectedDepartment, loading]);

  // Calculate statistics
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
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div></div> {/* Empty div to push the filter controls to the right */}
        <FilterControls 
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          departments={departments}
        />
      </div>
      
      <AttendanceStatsCards 
        presentCount={presentCount} 
        absentCount={absentCount} 
        leaveCount={leaveCount} 
        activeCount={activeCount} 
      />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>سجل الحضور</CardTitle>
          <CardDescription>
            سجل الحضور والانصراف ليوم {formatTimeSpent(selectedDate)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceTable loading={loading} attendanceData={attendanceData} />
        </CardContent>
      </Card>
    </>
  );
}
