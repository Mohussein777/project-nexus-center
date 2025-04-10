
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GanttLegend } from './GanttLegend';
import { GanttHeaderProps } from './GanttHeaderProps';

export function GanttHeader({ 
  startDate, 
  dateRange, 
  cellWidth,
  onPreviousPeriod,
  onNextPeriod
}: GanttHeaderProps) {
  return (
    <div className="mb-4 flex justify-between">
      <GanttLegend />
      
      <div className="flex items-center space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onPreviousPeriod}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>السابق</span>
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={onNextPeriod}
        >
          <span>التالي</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
