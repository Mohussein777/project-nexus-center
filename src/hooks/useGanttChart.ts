
import { useState, useEffect, RefObject, useRef } from 'react';
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

export function useGanttChart(initialTasks: Task[] = []) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [visibleDays, setVisibleDays] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 30));
  const [visibleTasks, setVisibleTasks] = useState<Task[]>([]);
  const cellWidth = 60; // Width of each day column
  
  // Calculate project duration
  useEffect(() => {
    if (initialTasks.length > 0) {
      const projectStartDates = initialTasks.map(task => new Date(task.startDate));
      const projectEndDates = initialTasks.map(task => new Date(task.endDate));
      
      const earliestDate = new Date(Math.min(...projectStartDates.map(date => date.getTime())));
      const latestDate = new Date(Math.max(...projectEndDates.map(date => date.getTime())));
      
      setStartDate(earliestDate);
      setEndDate(latestDate);
      setVisibleTasks(initialTasks);
    }
  }, [initialTasks]);
  
  // Generate visible days (date range)
  useEffect(() => {
    const days: Date[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    setVisibleDays(days);
  }, [startDate, endDate]);
  
  const updateVisibleTasks = (tasks: Task[]) => {
    setVisibleTasks(tasks);
  };
  
  const handleTaskDateChange = (taskId: string, newStartDate: Date, newEndDate: Date) => {
    setVisibleTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              startDate: newStartDate.toISOString().split('T')[0],
              endDate: newEndDate.toISOString().split('T')[0]
            } 
          : task
      )
    );
  };
  
  const calculateTaskPosition = (task: Task): GanttPosition => {
    if (!task.startDate || !task.endDate) return { left: 0, width: 0 };
    
    try {
      const taskStartDate = parseISO(task.startDate);
      const taskEndDate = parseISO(task.endDate);
      
      // Calculate position based on visible days
      const startDiff = differenceInDays(taskStartDate, startDate);
      const duration = differenceInDays(taskEndDate, taskStartDate) + 1;
      
      const left = startDiff * cellWidth;
      const width = duration * cellWidth;
      
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
  
  // Create computed date range for header
  const dateRange = visibleDays;
  
  return {
    selectedTask,
    setSelectedTask,
    isEditDialogOpen,
    setIsEditDialogOpen,
    visibleDays,
    startDate,
    endDate,
    dateRange,
    cellWidth,
    visibleTasks,
    updateVisibleTasks,
    setStartDate,
    setEndDate,
    handleTaskDateChange,
    calculateTaskPosition,
    isWeekend,
    isToday
  };
}
