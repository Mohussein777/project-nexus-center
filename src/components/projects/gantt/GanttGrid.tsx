
import React, { RefObject } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Task } from '@/hooks/useGanttChart';

interface GanttGridProps {
  tasks: Task[];
  visibleDays: Date[];
  isWeekend: (date: Date) => boolean;
  isToday: (date: Date) => boolean;
  scrollContainerRef: RefObject<HTMLDivElement>;
  getTaskStatusIcon: (task: Task) => React.ReactNode;
  onTaskClick: (task: Task) => void;
  children: React.ReactNode;
}

export function GanttGrid({
  tasks,
  visibleDays,
  isWeekend,
  isToday,
  scrollContainerRef,
  getTaskStatusIcon,
  onTaskClick,
  children
}: GanttGridProps) {
  return (
    <div className="border rounded-md">
      <div className="flex border-b">
        <div className="w-64 min-w-[250px] p-2 font-medium border-r">المهمة</div>
        <div ref={scrollContainerRef} className="overflow-x-auto">
          <div className="flex">
            {visibleDays.map((day, index) => (
              <div 
                key={index} 
                className={`w-[60px] min-w-[60px] p-2 text-center border-r text-xs ${
                  isWeekend(day) 
                    ? 'bg-gray-100 dark:bg-gray-800' 
                    : isToday(day)
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : ''
                }`}
              >
                <div className="font-medium">
                  {format(day, 'd', { locale: ar })}
                </div>
                <div className="text-muted-foreground">
                  {format(day, 'MMM', { locale: ar })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex">
        <div className="w-64 min-w-[250px] border-r">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="p-2 border-b flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {getTaskStatusIcon(task)}
              <div className="flex-1">
                <div className="font-medium">{task.name}</div>
                <div className="text-xs text-muted-foreground">{task.assignee}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div ref={scrollContainerRef} className="overflow-x-auto flex-1 relative">
          <div style={{ height: `${tasks.length * 41}px` }}>
            {/* Vertical grid lines */}
            <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${visibleDays.length}, 60px)` }}>
              {visibleDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`border-r h-full ${
                    isWeekend(day) 
                      ? 'bg-gray-100 dark:bg-gray-800' 
                      : isToday(day)
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : ''
                  }`}
                ></div>
              ))}
            </div>
            
            {/* Gantt bars (passed as children) */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
