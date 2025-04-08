
import { Badge } from '../ui/badge';
import { Clock, CheckCircle } from 'lucide-react';

interface TaskAssignmentProps {
  task: any;
  isOverCapacity?: boolean;
  isUnassigned?: boolean;
}

export function TaskAssignment({ task, isOverCapacity = false, isUnassigned = false }: TaskAssignmentProps) {
  const getTaskColor = () => {
    if (isOverCapacity) return 'bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    
    switch (task.status) {
      case 'Completed': return 'bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'In Progress': return 'bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Review': return 'bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'At Risk': return 'bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Not Started': return 'bg-gray-200 text-gray-800 dark:bg-gray-800/60 dark:text-gray-400';
      default: return 'bg-gray-200 text-gray-800 dark:bg-gray-800/60 dark:text-gray-400';
    }
  };

  const getTaskBorderColor = () => {
    switch (task.status) {
      case 'Completed': return 'border-green-400';
      case 'In Progress': return 'border-blue-400';
      case 'Review': return 'border-purple-400';
      case 'At Risk': return 'border-red-400';
      case 'Not Started': return 'border-gray-400';
      default: return 'border-gray-400';
    }
  };
  
  const taskHours = 8; // Default to 8 hours per task, could be dynamic based on task data
  
  return (
    <div 
      className={`mb-1 p-2 rounded ${getTaskColor()} border-l-4 ${getTaskBorderColor()} text-xs hover:opacity-90`}
    >
      <div className="font-medium mb-0.5">{task.name}</div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          {task.status === 'Completed' ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          <span>{taskHours}h</span>
        </div>
        
        {task.projectId && (
          <Badge variant="outline" className="text-[0.65rem] h-4">
            #{task.projectId}
          </Badge>
        )}
      </div>
    </div>
  );
}
