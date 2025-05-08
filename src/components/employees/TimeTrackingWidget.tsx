
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';
import { useTimeTracking } from './attendance/hooks/useTimeTracking';
import { TimeDisplayCounter } from './attendance/TimeDisplayCounter';
import { TrackingControls } from './attendance/TrackingControls';
import { TrackingStartTime } from './attendance/TrackingStartTime';
import { LoadingTracker } from './attendance/LoadingTracker';
import { ProjectSelector } from './attendance/ProjectSelector';
import { useState } from 'react';

interface TimeTrackingWidgetProps {
  employeeId: string;
  onTimeEntryUpdate: () => void;
}

export function TimeTrackingWidget({ employeeId, onTimeEntryUpdate }: TimeTrackingWidgetProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  
  const {
    isTracking,
    currentEntry,
    elapsedTime,
    loading,
    formatElapsedTime,
    handleStartTracking,
    handleStopTracking
  } = useTimeTracking(employeeId, onTimeEntryUpdate);
  
  const onStart = () => {
    if (selectedProjectId) {
      handleStartTracking(selectedProjectId);
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            تسجيل الوقت
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <LoadingTracker />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          تسجيل الوقت
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <TimeDisplayCounter time={formatElapsedTime(elapsedTime)} />
          
          {!isTracking && (
            <ProjectSelector 
              selectedProjectId={selectedProjectId} 
              onProjectSelect={setSelectedProjectId}
            />
          )}
          
          <TrackingControls 
            isTracking={isTracking}
            onStart={onStart}
            onStop={handleStopTracking}
            projectSelected={selectedProjectId !== null || isTracking}
          />
          
          {isTracking && currentEntry && (
            <TrackingStartTime startTime={currentEntry.start_time} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
