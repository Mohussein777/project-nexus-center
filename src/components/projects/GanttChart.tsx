
import { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { TaskForm } from './TaskForm';
import { useGanttChart } from '@/hooks/useGanttChart';
import { Task } from '@/services/tasks';
import { GanttHeader } from './gantt/GanttHeader';
import { GanttTaskBar } from './gantt/GanttTaskBar';
import { GanttGrid } from './gantt/GanttGrid';
import { TaskStatusIcon } from './gantt/TaskStatusIcon';

export interface GanttChartProps {
  tasks: Task[];
  onUpdateTask: (task: any) => Promise<void>;
}

export function GanttChart({ tasks, onUpdateTask }: GanttChartProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    selectedTask,
    setSelectedTask,
    isEditDialogOpen,
    setIsEditDialogOpen,
    visibleDays,
    calculateTaskPosition,
    isWeekend,
    isToday
  } = useGanttChart(tasks, scrollContainerRef);
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateTask = async (updatedTask: any) => {
    await onUpdateTask(updatedTask);
    setIsEditDialogOpen(false);
  };
  
  return (
    <div className="p-4">
      <GanttHeader />
      
      <GanttGrid
        tasks={tasks}
        visibleDays={visibleDays}
        isWeekend={isWeekend}
        isToday={isToday}
        scrollContainerRef={scrollContainerRef}
        getTaskStatusIcon={(task) => <TaskStatusIcon task={task} />}
        onTaskClick={handleTaskClick}
      >
        {/* Gantt bars */}
        {tasks.map((task, taskIndex) => {
          const position = calculateTaskPosition(task);
          
          return (
            <GanttTaskBar
              key={task.id}
              task={task}
              position={position}
              index={taskIndex}
              onClick={handleTaskClick}
            />
          );
        })}
      </GanttGrid>
      
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
