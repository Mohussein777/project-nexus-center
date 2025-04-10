
import { Dispatch, SetStateAction } from 'react';

export interface GanttHeaderProps {
  startDate: Date;
  dateRange: Date[];
  cellWidth: number;
  onPreviousPeriod?: () => void;
  onNextPeriod?: () => void;
}
