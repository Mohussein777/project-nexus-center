import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { TaskAssignment } from './TaskAssignment';

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
        startDate: new Date(2024, 9, 21),
        endDate: new Date(2024, 9, 23),
        assignee_id: 'employee1',
      },
      {
        id: '2',
        name: 'Code Review',
        startDate: new Date(2024, 9, 22),
        endDate: new Date(2024, 9, 24),
        assignee_id: 'employee2',
      },
      {
        id: '3',
        name: 'Frontend Implementation',
        startDate: new Date(2024, 9, 25),
        endDate: new Date(2024, 9, 27),
        assignee_id: 'employee1',
      },
      {
        id: '4',
        name: 'Backend Implementation',
        startDate: new Date(2024, 9, 25),
        endDate: new Date(2024, 9, 27),
        assignee_id: 'employee3',
      },
      {
        id: '5',
        name: 'Testing and QA',
        startDate: new Date(2024, 9, 28),
        endDate: new Date(2024, 9, 29),
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
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('workloadCalendar')}</h1>
      
      <div className="flex items-center justify-between mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={format(date, "MMMM yyyy")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>{format(date, "MMMM yyyy")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="month"
              defaultMonth={date}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">{t('overCapacity')}</h2>
          {overCapacityTasks.map((task) => (
            <div key={task.id} className="mb-2">
              <TaskAssignment 
                value={task.assignee_id || null}
                onChange={() => {}}
              />
              <p>
                {task.name} ({format(new Date(task.startDate), 'MMM dd')} - {format(new Date(task.endDate), 'MMM dd')})
              </p>
            </div>
          ))}
          {overCapacityTasks.length === 0 && <p>{t('noOverCapacityTasks')}</p>}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">{t('unassignedTasks')}</h2>
          {unassignedTasks.map((task) => (
            <div key={task.id} className="mb-2">
              <TaskAssignment 
                value={null}
                onChange={() => {}}
              />
              <p>
                {task.name} ({format(new Date(task.startDate), 'MMM dd')} - {format(new Date(task.endDate), 'MMM dd')})
              </p>
            </div>
          ))}
          {unassignedTasks.length === 0 && <p>{t('noUnassignedTasks')}</p>}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">{t('allTasks')} ({format(date, 'MMM dd')})</h2>
          {getTasksForDate(date).map(task => (
            <div key={task.id} className="mb-2">
              <p>
                {task.name} ({format(new Date(task.startDate), 'MMM dd')} - {format(new Date(task.endDate), 'MMM dd')})
              </p>
            </div>
          ))}
          {getTasksForDate(date).length === 0 && <p>{t('noTasksForSelectedDate')}</p>}
        </div>
      </div>
    </div>
  );
}
