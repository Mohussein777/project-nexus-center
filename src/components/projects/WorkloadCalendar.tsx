
import { useState, useEffect } from 'react';
import { format, addDays, subDays, startOfWeek, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { User, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getEmployees } from '@/services/employeeService';
import { getTasks } from '@/services/taskService';
import { TaskAssignment } from './TaskAssignment';

export function WorkloadCalendar() {
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  
  // Generate dates for the week
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    return addDays(startDate, index);
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch employees
        const employeesData = await getEmployees();
        setEmployees(employeesData);
        
        // Fetch all tasks from all projects
        const projectsResponse = await fetch('/api/projects');
        const projects = await projectsResponse.json();
        
        let allTasks = [];
        for (const project of projects) {
          const tasksData = await getTasks(project.id);
          allTasks = [...allTasks, ...tasksData];
        }
        
        setTasks(allTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const previousWeek = () => {
    setStartDate(prevDate => subDays(prevDate, 7));
  };
  
  const nextWeek = () => {
    setStartDate(prevDate => addDays(prevDate, 7));
  };
  
  const goToCurrentWeek = () => {
    setStartDate(startOfWeek(new Date(), { weekStartsOn: 0 }));
  };
  
  const getTasksForEmployeeAndDay = (employeeId, date) => {
    return tasks.filter(task => 
      task.assigneeId === employeeId && 
      task.startDate && 
      task.endDate && 
      new Date(task.startDate) <= date && 
      new Date(task.endDate) >= date
    );
  };
  
  // Calculate task hours for an employee (for display next to name)
  const getEmployeeWorkHours = (employeeId) => {
    const employeeTasks = tasks.filter(task => task.assigneeId === employeeId);
    const totalHours = employeeTasks.reduce((total, task) => {
      // Simplified calculation - in a real app you'd calculate actual work hours
      return total + 8; // Assuming 8 hours per task
    }, 0);
    
    // Calculate capacity (40 hours per week is standard)
    const capacity = 40;
    
    return { used: totalHours, capacity };
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('workloadPreview')}</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('previous')}
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            <CalendarDays className="h-4 w-4 mr-1" />
            {t('today')}
          </Button>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            {t('next')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="grid grid-cols-[250px_repeat(7,1fr)]">
          {/* Header */}
          <div className="p-3 font-medium border-b border-r bg-muted/40">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{t('assignees')} ({employees.length})</span>
            </div>
          </div>
          
          {/* Days of the week */}
          {weekDays.map((day, index) => {
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={index} 
                className={`p-3 text-center font-medium border-b ${isToday ? 'bg-primary/10' : 'bg-muted/40'}`}
              >
                <div className="text-sm">{format(day, 'EEE', { locale: language === 'ar' ? ar : undefined })}</div>
                <div className="text-xl">{format(day, 'd', { locale: language === 'ar' ? ar : undefined })}</div>
              </div>
            );
          })}
          
          {/* Employee rows */}
          {employees.map((employee, employeeIndex) => {
            const { used, capacity } = getEmployeeWorkHours(employee.id);
            const capacityPercentage = Math.min((used / capacity) * 100, 100);
            
            return (
              <div key={employee.id} className="contents">
                {/* Employee info */}
                <div className="p-3 border-b border-r">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-sm font-semibold">
                        {employee.name.charAt(0)}
                      </div>
                    </Avatar>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">{used}h/{capacity}h</div>
                    </div>
                  </div>
                  
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${capacityPercentage > 90 ? 'bg-red-500' : capacityPercentage > 70 ? 'bg-orange-500' : 'bg-green-500'}`} 
                      style={{ width: `${capacityPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Days grid */}
                {weekDays.map((day, dayIndex) => {
                  const tasksForDay = getTasksForEmployeeAndDay(employee.id, day);
                  const isWeekend = day.getDay() === 5 || day.getDay() === 6; // Friday or Saturday
                  
                  return (
                    <div 
                      key={dayIndex} 
                      className={`border-b min-h-[100px] ${isWeekend ? 'bg-gray-100/60 dark:bg-gray-800/40' : ''}`}
                    >
                      <div className="h-full p-1">
                        {tasksForDay.map(task => (
                          <TaskAssignment 
                            key={task.id} 
                            task={task} 
                            isOverCapacity={capacityPercentage > 100}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          
          {/* Unassigned row */}
          <div className="p-3 border-r font-medium">
            {t('unassigned')}
          </div>
          
          {/* Unassigned tasks by day */}
          {weekDays.map((day, dayIndex) => {
            const unassignedTasks = tasks.filter(task => 
              !task.assigneeId && 
              task.startDate && 
              task.endDate && 
              new Date(task.startDate) <= day && 
              new Date(task.endDate) >= day
            );
            
            return (
              <div key={dayIndex} className="border-b min-h-[60px]">
                <div className="h-full p-1">
                  {unassignedTasks.map(task => (
                    <TaskAssignment 
                      key={task.id} 
                      task={task} 
                      isUnassigned
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
