
import React from 'react';

export function GanttLegend() {
  return (
    <div className="mb-4 flex items-center space-x-2">
      <div className="flex items-center">
        <div className="h-3 w-3 bg-green-500 rounded-full mr-1"></div>
        <span className="text-xs text-muted-foreground">مكتملة</span>
      </div>
      <div className="flex items-center">
        <div className="h-3 w-3 bg-blue-500 rounded-full mr-1"></div>
        <span className="text-xs text-muted-foreground">قيد التنفيذ</span>
      </div>
      <div className="flex items-center">
        <div className="h-3 w-3 bg-purple-500 rounded-full mr-1"></div>
        <span className="text-xs text-muted-foreground">في المراجعة</span>
      </div>
      <div className="flex items-center">
        <div className="h-3 w-3 bg-red-500 rounded-full mr-1"></div>
        <span className="text-xs text-muted-foreground">متأخرة</span>
      </div>
      <div className="flex items-center">
        <div className="h-3 w-3 bg-gray-400 rounded-full mr-1"></div>
        <span className="text-xs text-muted-foreground">لم تبدأ</span>
      </div>
    </div>
  );
}
