
import { useState, useEffect } from 'react';
import { GanttHeader } from './gantt/GanttHeader';
import { GanttGrid } from './gantt/GanttGrid';
import { GanttLegend } from './gantt/GanttLegend';
import { Button } from '@/components/ui/button';
import { Filter, Plus, SlidersHorizontal, Clock } from 'lucide-react';
import { Task } from '@/services/tasks/types';
import { useGanttChart } from '@/hooks/useGanttChart';
import { useLanguage } from '@/contexts/LanguageContext';
import { TaskFormDialog } from './TaskFormDialog';

interface GanttChartProps {
  tasks: Task[];
  onAddTask: () => void;
  onUpdateTask: (task: Task) => Promise<boolean>;
}

export function GanttChart({ tasks, onAddTask, onUpdateTask }: GanttChartProps) {
  const { t } = useLanguage();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { 
    startDate, 
    endDate,
    dateRange,
    cellWidth,
    visibleTasks,
    updateVisibleTasks,
    setStartDate,
    setEndDate,
    handleTaskDateChange,
  } = useGanttChart();
  
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      // Convert Task to the format expected by useGanttChart
      const formattedTasks = tasks.map(task => ({
        id: task.id,
        name: task.name,
        startDate: task.startDate ? new Date(task.startDate) : new Date(),
        endDate: task.endDate ? new Date(task.endDate) : new Date(),
        status: task.status,
        priority: task.priority,
        progress: task.progress,
        assigneeId: task.assigneeId,
        assigneeName: task.assigneeName,
        projectId: task.projectId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }));
      updateVisibleTasks(formattedTasks);
    }
  }, [tasks, updateVisibleTasks]);
  
  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsDialogOpen(true);
    }
  };
  
  const handleTaskUpdate = (taskData: Task) => {
    return onUpdateTask(taskData);
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
          />
          <GanttGrid 
            tasks={visibleTasks} 
            dateRange={dateRange} 
            cellWidth={cellWidth}
            onTaskClick={handleTaskClick}
            onTaskDateChange={(taskId, newStartDate, newEndDate) => {
              const task = tasks.find(t => t.id === taskId);
              if (task) {
                const updatedTask = {
                  ...task,
                  startDate: newStartDate.toISOString().split('T')[0],
                  endDate: newEndDate.toISOString().split('T')[0]
                };
                handleTaskUpdate(updatedTask);
              }
            }}
          />
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
