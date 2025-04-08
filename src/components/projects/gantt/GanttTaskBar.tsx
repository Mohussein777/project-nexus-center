
import React from 'react';
import { Task, GanttPosition } from '@/hooks/useGanttChart';

interface GanttTaskBarProps {
  task: Task;
  position: GanttPosition;
  index: number;
  onClick: (task: Task) => void;
}

export function GanttTaskBar({ task, position, index, onClick }: GanttTaskBarProps) {
  const getTaskColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Review': return 'bg-purple-500';
      case 'At Risk': return 'bg-red-500';
      case 'Not Started': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };
  
  return (
    <div
      className={`absolute h-8 rounded-md cursor-pointer ${getTaskColor(task.status)} hover:opacity-80`}
      style={{
        left: `${position.left}px`,
        width: `${position.width}px`,
        top: `${index * 41 + 6}px`,
      }}
      onClick={() => onClick(task)}
    >
      <div className="px-2 py-1 text-white text-xs truncate">
        {task.name}
      </div>
    </div>
  );
}
