
import { useState, useEffect, RefObject } from 'react';
import { addDays, differenceInDays, parseISO } from 'date-fns';

export interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  assignee?: string;
}

export interface GanttPosition {
  left: number;
  width: number;
}

export function useGanttChart(tasks: Task[], scrollContainerRef: RefObject<HTMLDivElement>) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
  }, [visibleDays, scrollContainerRef]);
  
  const calculateTaskPosition = (task: Task): GanttPosition => {
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
  
  return {
    selectedTask,
    setSelectedTask,
    isEditDialogOpen,
    setIsEditDialogOpen,
    visibleDays,
    calculateTaskPosition,
    isWeekend,
    isToday
  };
}
