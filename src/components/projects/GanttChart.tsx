import { useState, useEffect, useRef } from 'react';
import { format, addDays, differenceInDays, isWithinInterval, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { TaskForm } from './TaskForm';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface GanttChartProps {
  tasks: any[];
  onUpdateTask: (task: any) => Promise<void>;
}

export function GanttChart({ tasks, onUpdateTask }: GanttChartProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [visibleDays, setVisibleDays] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 30));
  
  // Calculate project duration
  useEffect(() => {
    if (tasks.length > 0) {
      const projectStartDates = tasks.map(task => new Date(task.startDate));
      const projectEndDates = tasks.map(task => new Date(task.endDate));
      
      const earliestDate = new Date(Math.min(...projectStartDates.map(date => date.getTime())));
      const latestDate = new Date(Math.max(...projectEndDates.map(date => date.getTime())));
      
      setStartDate(earliestDate);
      setEndDate(latestDate);
    }
  }, [tasks]);
  
  // Generate visible days
  useEffect(() => {
    const days: Date[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    setVisibleDays(days);
  }, [startDate, endDate]);
  
  // Scroll to today
  useEffect(() => {
    if (scrollContainerRef.current && visibleDays.length > 0) {
      const today = new Date();
      const todayIndex = visibleDays.findIndex(day => 
        day.getDate() === today.getDate() &&
        day.getMonth() === today.getMonth() &&
        day.getFullYear() === today.getFullYear()
      );
      
      if (todayIndex !== -1) {
        const dayWidth = 60; // Width of each day column
        scrollContainerRef.current.scrollLeft = (todayIndex - 2) * dayWidth;
      }
    }
  }, [visibleDays]);
  
  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateTask = (updatedTask: any) => {
    onUpdateTask(updatedTask);
    setIsEditDialogOpen(false);
  };
  
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 5 || day === 6; // Friday or Saturday for Arabic calendar
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const calculateTaskPosition = (task: any) => {
    if (!task.startDate || !task.endDate) return { left: 0, width: 0 };
    
    try {
      const taskStartDate = parseISO(task.startDate);
      const taskEndDate = parseISO(task.endDate);
      
      // Calculate position based on visible days
      const startIndex = 0; // Default to first visible day if not found
      const duration = differenceInDays(taskEndDate, taskStartDate) + 1;
      
      const dayWidth = 60; // Width of each day column
      const left = startIndex * dayWidth;
      const width = duration * dayWidth;
      
      return { left, width };
    } catch (error) {
      console.error("Error calculating task position:", error);
      return { left: 0, width: 0 };
    }
  };
  
  const getTaskColor = (task: any) => {
    switch (task.status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Review': return 'bg-purple-500';
      case 'At Risk': return 'bg-red-500';
      case 'Not Started': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };
  
  const getTaskStatusIcon = (task: any) => {
    return (
      <div 
        className={`h-4 w-4 rounded-full ${getTaskColor(task)}`} 
        title={task.status}
      ></div>
    );
  };
  
  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs text-muted-foreground">مكتملة</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs text-muted-foreground">قيد التنفيذ</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-purple-500 rounded-full mr-1"></div>
            <span className="text-xs text-muted-foreground">في المراجعة</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-red-500 rounded-full mr-1"></div>
            <span className="text-xs text-muted-foreground">متأخرة</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-gray-400 rounded-full mr-1"></div>
            <span className="text-xs text-muted-foreground">لم تبدأ</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>السابق</span>
          </Button>
          <Button size="sm" variant="outline">
            <span>التالي</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <div className="flex border-b">
          <div className="w-64 min-w-[250px] p-2 font-medium border-r">المهمة</div>
          <div ref={scrollContainerRef} className="overflow-x-auto">
            <div className="flex">
              {visibleDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`w-[60px] min-w-[60px] p-2 text-center border-r text-xs ${
                    isWeekend(day) 
                      ? 'bg-gray-100 dark:bg-gray-800' 
                      : isToday(day)
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : ''
                  }`}
                >
                  <div className="font-medium">
                    {format(day, 'd', { locale: ar })}
                  </div>
                  <div className="text-muted-foreground">
                    {format(day, 'MMM', { locale: ar })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex">
          <div className="w-64 min-w-[250px] border-r">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className="p-2 border-b flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {getTaskStatusIcon(task)}
                <div className="flex-1">
                  <div className="font-medium">{task.name}</div>
                  <div className="text-xs text-muted-foreground">{task.assignee}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div ref={scrollContainerRef} className="overflow-x-auto flex-1 relative">
            <div style={{ height: `${tasks.length * 41}px` }}>
              {/* Vertical grid lines */}
              <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${visibleDays.length}, 60px)` }}>
                {visibleDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={`border-r h-full ${
                      isWeekend(day) 
                        ? 'bg-gray-100 dark:bg-gray-800' 
                        : isToday(day)
                          ? 'bg-blue-50 dark:bg-blue-900/20' 
                          : ''
                    }`}
                  ></div>
                ))}
              </div>
              
              {/* Gantt bars */}
              {tasks.map((task, taskIndex) => {
                const { left, width } = calculateTaskPosition(task);
                
                return (
                  <div
                    key={task.id}
                    className={`absolute h-8 rounded-md cursor-pointer ${getTaskColor(task)} hover:opacity-80`}
                    style={{
                      left: `${left}px`,
                      width: `${width}px`,
                      top: `${taskIndex * 41 + 6}px`,
                    }}
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="px-2 py-1 text-white text-xs truncate">
                      {task.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>تعديل المهمة</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <TaskForm 
              task={selectedTask} 
              onSubmit={handleUpdateTask} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
