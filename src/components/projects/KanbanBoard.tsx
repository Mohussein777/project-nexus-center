
import { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTask } from './KanbanTask';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { TaskForm } from './TaskForm';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Task } from '@/services/tasks/types';

export interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => Promise<boolean>;
}

export function KanbanBoard({ tasks, onUpdateTask }: KanbanBoardProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const columns = [
    { id: 'Not Started', title: t('notStarted') || 'لم تبدأ' },
    { id: 'In Progress', title: t('inProgress') || 'قيد التنفيذ' },
    { id: 'Review', title: t('inReview') || 'في المراجعة' },
    { id: 'At Risk', title: t('atRisk') || 'متأخرة' },
    { id: 'Completed', title: t('completed') || 'مكتملة' },
  ];
  
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Extract the task ID from the draggable item ID
      const taskIdStr = active.id.toString().split('-')[1]; 
      const taskId = taskIdStr;
      
      // The target status is the column ID
      const newStatus = over.id.toString();
      
      if (columns.some(col => col.id === newStatus)) {
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
          console.log(`Moving task ${taskId} to ${newStatus}`);
          const updatedTask = { ...taskToUpdate, status: newStatus };
          
          onUpdateTask(updatedTask)
            .then(success => {
              if (success) {
                toast({
                  title: t('taskUpdated'),
                  description: t('taskStatusUpdated'),
                });
              } else {
                toast({
                  title: t('error'),
                  description: t('errorUpdatingTask'),
                  variant: "destructive",
                });
              }
            })
            .catch(error => {
              console.error("Error updating task status:", error);
              toast({
                title: t('error'),
                description: t('errorUpdatingTask'),
                variant: "destructive",
              });
            });
        }
      }
    }
  };
  
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditDialogOpen(true);
  };
  
  // تعديل نوع البيانات لتصحيح الخطأ - معالج تحديث المهمة
  const handleUpdateTask = async (updatedTask: Task): Promise<void> => {
    await onUpdateTask(updatedTask);
    setIsEditDialogOpen(false);
    setSelectedTask(null);
  };
  
  return (
    <div className="p-4">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {columns.map(column => (
            <KanbanColumn 
              key={column.id} 
              id={column.id} 
              title={column.title}
              tasksCount={getTasksByStatus(column.id).length}
            >
              <SortableContext
                items={getTasksByStatus(column.id).map(task => `task-${task.id}`)}
                strategy={verticalListSortingStrategy}
              >
                {getTasksByStatus(column.id).map(task => (
                  <KanbanTask 
                    key={task.id} 
                    id={`task-${task.id}`}
                    task={task}
                    onEdit={() => handleEditTask(task)}
                  />
                ))}
              </SortableContext>
            </KanbanColumn>
          ))}
        </div>
      </DndContext>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{t('editTask') || 'تعديل المهمة'}</DialogTitle>
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
