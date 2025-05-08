
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Timer } from "lucide-react";
import { useTimeTracking } from "./hooks/useTimeTracking";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProjectSelector } from "./ProjectSelector";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCurrentUserEmployee } from "./attendanceUtils";

export function TimerButton() {
  const { user } = useAuth();
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Get employee ID from email
  useEffect(() => {
    async function getEmployeeId() {
      if (user?.email) {
        setIsLoading(true);
        const employee = await fetchCurrentUserEmployee(user.email);
        if (employee) {
          setEmployeeId(employee.id.toString());
        }
        setIsLoading(false);
      }
    }
    
    getEmployeeId();
  }, [user]);
  
  const {
    isTracking,
    elapsedTime,
    formatElapsedTime,
    handleStartTracking,
    handleStopTracking,
    loading: trackingLoading
  } = useTimeTracking(employeeId || "", () => {});
  
  const onStart = () => {
    if (selectedProjectId) {
      handleStartTracking(selectedProjectId);
      setIsPopoverOpen(false);
    }
  };
  
  const onStop = () => {
    handleStopTracking();
    setIsPopoverOpen(false);
  };
  
  // If still loading employee ID or tracking data
  if (isLoading || trackingLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
        <Timer className="h-5 w-5 mr-2" />
        جاري التحميل...
      </Button>
    );
  }
  
  // If no employee ID found
  if (!employeeId) {
    return null;
  }
  
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={isTracking ? "text-green-500" : "text-muted-foreground"}
        >
          <Timer className="h-5 w-5 mr-2" />
          {isTracking ? formatElapsedTime(elapsedTime) : "تسجيل الوقت"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium text-lg">تسجيل الوقت</h4>
          
          {isTracking ? (
            <div className="text-center">
              <div className="text-2xl font-mono font-bold mb-4">
                {formatElapsedTime(elapsedTime)}
              </div>
              <Button 
                variant="destructive" 
                onClick={onStop}
                className="w-full"
              >
                <Square className="mr-2 h-5 w-5" />
                إيقاف التسجيل
              </Button>
            </div>
          ) : (
            <>
              <ProjectSelector 
                selectedProjectId={selectedProjectId} 
                onProjectSelect={setSelectedProjectId}
              />
              <Button 
                variant="default" 
                onClick={onStart}
                disabled={!selectedProjectId}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Play className="mr-2 h-5 w-5" />
                بدء التسجيل
              </Button>
              {!selectedProjectId && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  يرجى اختيار مشروع أولاً
                </p>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
