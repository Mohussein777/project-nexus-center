
import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasksCount: number;
  children: ReactNode;
}

export function KanbanColumn({ id, title, tasksCount, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'Not Started': return 'border-gray-400 bg-gray-50 dark:bg-gray-800';
      case 'In Progress': return 'border-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'Review': return 'border-purple-400 bg-purple-50 dark:bg-purple-900/20';
      case 'At Risk': return 'border-red-400 bg-red-50 dark:bg-red-900/20';
      case 'Completed': return 'border-green-400 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  return (
    <div 
      ref={setNodeRef}
      className={`border-t-4 rounded-md shadow-sm ${getColumnColor(id)} ${
        isOver ? 'ring-2 ring-primary ring-inset' : ''
      }`}
    >
      <div className="p-2 flex items-center justify-between border-b">
        <h3 className="font-medium">{title}</h3>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
          {tasksCount}
        </span>
      </div>
      <div className="p-2 min-h-[200px] space-y-2">
        {children}
      </div>
    </div>
  );
}
