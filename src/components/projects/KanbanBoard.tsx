
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

interface KanbanBoardProps {
  tasks: any[];
  onUpdateTaskStatus: (taskId: number, newStatus: string) => void;
  onUpdateTask: (task: any) => void;
}

export function KanbanBoard({ tasks, onUpdateTaskStatus, onUpdateTask }: KanbanBoardProps) {
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const columns = [
    { id: 'Not Started', title: 'لم تبدأ' },
    { id: 'In Progress', title: 'قيد التنفيذ' },
    { id: 'Review', title: 'في المراجعة' },
    { id: 'At Risk', title: 'متأخرة' },
    { id: 'Completed', title: 'مكتملة' },
  ];
  
  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = Number(active.id.toString().split('-')[1]);
      const newStatus = over.id.toString();
      
      if (columns.some(col => col.id === newStatus)) {
        onUpdateTaskStatus(taskId, newStatus);
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث حالة المهمة بنجاح",
        });
      }
    }
  };
  
  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateTask = (updatedTask: any) => {
    onUpdateTask(updatedTask);
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
