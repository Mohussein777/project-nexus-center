
import { useState, useEffect, useRef } from 'react';
import { GanttHeader } from './gantt/GanttHeader';
import { GanttGrid } from './gantt/GanttGrid';
import { GanttLegend } from './gantt/GanttLegend';
import { Button } from '@/components/ui/button';
import { Filter, Plus, SlidersHorizontal, Clock } from 'lucide-react';
import { Task } from '@/services/tasks/types';
import { useGanttChart, GanttPosition } from '@/hooks/useGanttChart';
import { useLanguage } from '@/contexts/LanguageContext';
import { TaskFormDialog } from './TaskFormDialog';
import { GanttTaskBar } from './gantt/GanttTaskBar';

interface GanttChartProps {
  tasks: Task[];
  onAddTask: () => void;
  onUpdateTask: (task: Task) => Promise<any>;
}

export function GanttChart({ tasks, onAddTask, onUpdateTask }: GanttChartProps) {
  const { t } = useLanguage();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    selectedTask: ganttSelectedTask,
    setSelectedTask: setGanttSelectedTask,
    isEditDialogOpen,
    setIsEditDialogOpen: setGanttIsEditDialogOpen,
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
  } = useGanttChart();
  
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      // Convert Task to the format expected by useGanttChart
      const formattedTasks = tasks.map(task => ({
        id: task.id,
        name: task.name,
        startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: task.status,
        assignee: task.assigneeName
      }));
      updateVisibleTasks(formattedTasks);
    }
  }, [tasks, updateVisibleTasks]);
  
  const handleTaskClick = (task: any) => {
    const fullTask = tasks.find(t => t.id === task.id);
    if (fullTask) {
      setSelectedTask(fullTask);
      setIsDialogOpen(true);
    }
  };
  
  const handleTaskUpdate = (taskData: Task) => {
    return onUpdateTask(taskData);
  };
  
  // Generate a function that returns the status icon for a task
  const getTaskStatusIcon = (task: any) => {
    // This is implemented elsewhere, just a stub for now
    return null;
  };

  const handlePreviousPeriod = () => {
    // Implementation for going to previous period
    console.log("Navigate to previous period");
  };

  const handleNextPeriod = () => {
    // Implementation for going to next period
    console.log("Navigate to next period");
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t('ganttChart')}</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsFilterVisible(!isFilterVisible)}>
            <Filter className="h-4 w-4 mr-1" />
            {t('filter')}
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-1" />
            {t('timeframe')}
          </Button>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            {t('options')}
          </Button>
          <Button variant="default" size="sm" onClick={onAddTask}>
            <Plus className="h-4 w-4 mr-1" />
            {t('addTask')}
          </Button>
        </div>
      </div>
      
      {isFilterVisible && (
        <div className="mb-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-700">
          {/* Filter controls would go here */}
          <p>{t('filterControlsPlaceholder')}</p>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <div className="min-width-gantt">
          <GanttHeader 
            startDate={startDate}
            dateRange={dateRange}
            cellWidth={cellWidth}
            onPreviousPeriod={handlePreviousPeriod}
            onNextPeriod={handleNextPeriod}
          />
          <GanttGrid 
            tasks={visibleTasks} 
            visibleDays={dateRange}
            isWeekend={isWeekend}
            isToday={isToday}
            scrollContainerRef={scrollContainerRef}
            getTaskStatusIcon={getTaskStatusIcon}
            onTaskClick={handleTaskClick}
          >
            {visibleTasks.map((task, index) => (
              <GanttTaskBar
                key={task.id}
                task={task}
                position={calculateTaskPosition(task)}
                index={index}
                onClick={handleTaskClick}
              />
            ))}
          </GanttGrid>
        </div>
      </div>
      
      <GanttLegend />
      
      <TaskFormDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleTaskUpdate}
        task={selectedTask}
        isEditing={true}
      />
    </div>
  );
}
