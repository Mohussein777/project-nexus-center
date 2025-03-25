
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, AlertOctagon, GripVertical } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';

interface KanbanTaskProps {
  id: string;
  task: any;
  onEdit: () => void;
}

export function KanbanTask({ id, task, onEdit }: KanbanTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'High': return 'bg-orange-200 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Medium': return 'bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Low': return 'bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'عاجلة';
      case 'High': return 'عالية';
      case 'Medium': return 'متوسطة';
      case 'Low': return 'منخفضة';
      default: return priority;
    }
  };
  
  // Calculate if the task is overdue
  const isOverdue = () => {
    if (task.status === 'Completed') return false;
    const today = new Date();
    const endDate = new Date(task.endDate);
    return today > endDate;
  };
  
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-move relative overflow-hidden", 
        isDragging ? "opacity-50 z-10 shadow-lg" : "opacity-100",
        isOverdue() && "border-red-300 dark:border-red-700"
      )}
      onClick={onEdit}
    >
      {isOverdue() && (
        <div className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-md">
          <AlertOctagon className="h-3 w-3" />
        </div>
      )}
      
      <div className="absolute top-2 left-2 text-gray-400" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </div>
      
      <CardContent className="p-3">
        <h4 className="font-medium mb-2 pl-5">{task.name}</h4>
        
        <div className="flex justify-between items-center mb-2">
          <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
            {getPriorityText(task.priority)}
          </span>
          
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {task.endDate}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{task.assignee}</span>
          
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                task.status === 'Completed' 
                  ? 'bg-green-500' 
                  : task.status === 'At Risk' 
                    ? 'bg-red-500' 
                    : task.status === 'Review'
                      ? 'bg-purple-500'
                      : 'bg-blue-500'
              }`} 
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
