
import React from 'react';
import { Task } from '@/hooks/useGanttChart';

export function getTaskColor(task: Task) {
  switch (task.status) {
    case 'Completed': return 'bg-green-500';
    case 'In Progress': return 'bg-blue-500';
    case 'Review': return 'bg-purple-500';
    case 'At Risk': return 'bg-red-500';
    case 'Not Started': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
}

export function TaskStatusIcon({ task }: { task: Task }) {
  return (
    <div 
      className={`h-4 w-4 rounded-full ${getTaskColor(task)}`} 
      title={task.status}
    ></div>
  );
}
