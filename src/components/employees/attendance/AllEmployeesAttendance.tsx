
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceTable } from './AttendanceTable';
import { StatsCards } from './StatsCards';
import { FilterControls } from './FilterControls';
import { Employee, TimeEntry } from '../types';

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
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  
  // Get unique departments from employees
  const departments = [...new Set(employees.map(emp => emp.department))];
  
  // Filter employees based on selected department
  const filteredEmployees = selectedDepartment === "all"
    ? employees
    : employees.filter(emp => emp.department === selectedDepartment);
  
  // Group time entries by employee ID for quicker lookup
  const timeEntriesByEmployee = timeEntries.reduce((acc, entry) => {
    const employeeId = entry.employeeId.toString(); // Convert to string for consistent comparison
    if (!acc[employeeId]) {
      acc[employeeId] = [];
    }
    acc[employeeId].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);
  
  // Calculate statistics
  const totalEmployees = filteredEmployees.length;
  const presentToday = new Set(
    timeEntries
      .filter(entry => entry.date === selectedDate)
      .map(entry => entry.employeeId.toString())
  ).size;
  
  const absentToday = totalEmployees - presentToday;
  const attendanceRate = totalEmployees > 0 
    ? Math.round((presentToday / totalEmployees) * 100) 
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <FilterControls
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          departments={departments}
        />
      </div>
      
      <StatsCards
        totalEmployees={totalEmployees}
        presentToday={presentToday}
        absentToday={absentToday}
        attendanceRate={attendanceRate}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>سجل الحضور والانصراف</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ) : (
            <AttendanceTable 
              employees={filteredEmployees} 
              timeEntriesByEmployee={timeEntriesByEmployee}
              selectedDate={selectedDate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
