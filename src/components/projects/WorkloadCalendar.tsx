
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, addMonths, subMonths } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { TaskAssignment } from './TaskAssignment';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  assignee_id: string | null;
}

export function WorkloadCalendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const { t } = useLanguage();
  const { toast } = useToast();
  
  useEffect(() => {
    // Mock tasks for demonstration
    const mockTasks: Task[] = [
      {
        id: '1',
        name: 'Design Sprint',
        startDate: new Date(2025, 3, 21),
        endDate: new Date(2025, 3, 23),
        assignee_id: 'employee1',
      },
      {
        id: '2',
        name: 'Code Review',
        startDate: new Date(2025, 3, 22),
        endDate: new Date(2025, 3, 24),
        assignee_id: 'employee2',
      },
      {
        id: '3',
        name: 'Frontend Implementation',
        startDate: new Date(2025, 3, 25),
        endDate: new Date(2025, 3, 27),
        assignee_id: 'employee1',
      },
      {
        id: '4',
        name: 'Backend Implementation',
        startDate: new Date(2025, 3, 25),
        endDate: new Date(2025, 3, 27),
        assignee_id: 'employee3',
      },
      {
        id: '5',
        name: 'Testing and QA',
        startDate: new Date(2025, 3, 28),
        endDate: new Date(2025, 3, 29),
        assignee_id: null,
      },
    ];
    setTasks(mockTasks);
  }, []);
  
  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      const taskStartDate = new Date(task.startDate);
      const taskEndDate = new Date(task.endDate);
      return date >= taskStartDate && date <= taskEndDate;
    });
  };
  
  const getOverCapacityTasks = (date: Date): Task[] => {
    const tasksOnDate = getTasksForDate(date);
    const employeeTaskCounts: { [employeeId: string]: number } = {};
    
    tasksOnDate.forEach(task => {
      if (task.assignee_id) {
        employeeTaskCounts[task.assignee_id] = (employeeTaskCounts[task.assignee_id] || 0) + 1;
      }
    });
    
    return tasksOnDate.filter(task => task.assignee_id && employeeTaskCounts[task.assignee_id] > 1);
  };
  
  const getUnassignedTasks = (date: Date): Task[] => {
    const tasksOnDate = getTasksForDate(date);
    return tasksOnDate.filter(task => !task.assignee_id);
  };
  
  const overCapacityTasks = getOverCapacityTasks(date);
  const unassignedTasks = getUnassignedTasks(date);
  const allTasks = getTasksForDate(date);

  const goToPreviousMonth = () => {
    setDate(prevDate => subMonths(prevDate, 1));
  };

  const goToNextMonth = () => {
    setDate(prevDate => addMonths(prevDate, 1));
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">{t('workloadCalendar')}</h1>
      
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={goToPreviousMonth}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t('previous')}
        </Button>
        
        <div className="text-xl font-semibold">
          {format(date, "MMMM yyyy", { locale: ar })}
        </div>
        
        <Button variant="outline" onClick={goToNextMonth}>
          {t('next')}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-6 text-center">
        <div className="text-sm font-medium">{t('sunday')}</div>
        <div className="text-sm font-medium">{t('monday')}</div>
        <div className="text-sm font-medium">{t('tuesday')}</div>
        <div className="text-sm font-medium">{t('wednesday')}</div>
        <div className="text-sm font-medium">{t('thursday')}</div>
        <div className="text-sm font-medium">{t('friday')}</div>
        <div className="text-sm font-medium">{t('saturday')}</div>
      </div>
      
      <div className="mb-8">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          disabled={{ before: new Date(2025, 0, 1) }}
          className="rounded-md border mx-auto"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-red-50 dark:bg-red-900/20">
            <CardTitle className="text-lg">{t('overCapacity')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {overCapacityTasks.length > 0 ? (
              overCapacityTasks.map((task) => (
                <div key={task.id} className="mb-4 p-3 border rounded-lg">
                  <h3 className="font-medium">{task.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {format(new Date(task.startDate), 'MMM dd')} - {format(new Date(task.endDate), 'MMM dd')}
                  </p>
                  <TaskAssignment 
                    value={task.assignee_id}
                    onChange={() => {}}
                  />
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">{t('noOverCapacityTasks')}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
            <CardTitle className="text-lg">{t('unassignedTasks')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {unassignedTasks.length > 0 ? (
              unassignedTasks.map((task) => (
                <div key={task.id} className="mb-4 p-3 border rounded-lg">
                  <h3 className="font-medium">{task.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {format(new Date(task.startDate), 'MMM dd')} - {format(new Date(task.endDate), 'MMM dd')}
                  </p>
                  <TaskAssignment 
                    value={null}
                    onChange={() => {}}
                  />
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">{t('noUnassignedTasks')}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
            <CardTitle className="text-lg">
              {t('allTasks')} ({format(date, 'MMM dd')})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {allTasks.length > 0 ? (
              allTasks.map((task) => (
                <div key={task.id} className="mb-4 p-3 border rounded-lg">
                  <h3 className="font-medium">{task.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(task.startDate), 'MMM dd')} - {format(new Date(task.endDate), 'MMM dd')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">{t('noTasksForSelectedDate')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
