
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Employee, TimeEntry } from './types';
import { formatDateInArabic, fetchCurrentUserEmployee, mapTimeEntry } from './attendance/attendanceUtils';
import { getEmployees, getTimeEntries } from '@/services/employeeService';
import { AllEmployeesAttendance } from './attendance/AllEmployeesAttendance';
import { PersonalAttendance } from './attendance/PersonalAttendance';

export function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentUserEmployee, setCurrentUserEmployee] = useState<Employee | null>(null);
  
  // Fetch current user's employee record
  useEffect(() => {
    const loadCurrentUserEmployee = async () => {
      const employee = await fetchCurrentUserEmployee(user?.email);
      setCurrentUserEmployee(employee);
    };
    
    if (user?.email) {
      loadCurrentUserEmployee();
    }
  }, [user]);
  
  // Load attendance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await getEmployees();
        setEmployees(employeesData);
        
        // Fetch attendance data for the selected date
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
  
  // Handle time entry updates
  const handleTimeEntryUpdate = async () => {
    setLoading(true);
    try {
      const entriesData = await getTimeEntries(selectedDate);
      setTimeEntries(entriesData);
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
        </div>
        
        <TabsContent value="all">
          <AllEmployeesAttendance 
            employees={employees}
            timeEntries={timeEntries}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="personal">
          <PersonalAttendance currentUserEmployee={currentUserEmployee} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
