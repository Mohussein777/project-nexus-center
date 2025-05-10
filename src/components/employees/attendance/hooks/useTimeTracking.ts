
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { formatElapsedTime } from '@/utils/timeFormatUtils';
import { 
  getCurrentTimeEntry, 
  startTimeTracking, 
  stopTimeTracking 
} from '@/services/timeTrackingService';
import { TimeEntry } from '../../types';

export function useTimeTracking(employeeId: string, onTimeEntryUpdate: () => void) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Initialize time tracking by checking for active time entries
  const initializeTimeEntry = useCallback(async () => {
    try {
      if (!employeeId) {
        console.log("No employee ID provided");
        setLoading(false);
        return;
      }

      console.log("Checking active time entry for employee:", employeeId);
      const { data, error } = await getCurrentTimeEntry(employeeId);
          
      if (error) {
        console.error("Error checking active time entry:", error);
        throw error;
      }
          
      console.log("Active time entry data:", data);
      if (data) {
        setCurrentEntry(data);
        setIsTracking(true);
        
        // Calculate elapsed time since tracking started
        const startTime = new Date(data.startTime).getTime();
        const now = new Date().getTime();
        setElapsedTime(Math.floor((now - startTime) / 1000));
      }
    } catch (error) {
      console.error('Error checking active time entry:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات التتبع الحالية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [employeeId, toast]);
  
  // Initialize time entry on component mount
  useEffect(() => {
    if (employeeId) {
      console.log("Initializing time entry for employee:", employeeId);
      initializeTimeEntry();
    } else {
      setLoading(false);
    }
  }, [employeeId, initializeTimeEntry]);
  
  // Update elapsed time counter every second if tracking is active
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTracking) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      console.log("Time tracking timer started");
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
        console.log("Time tracking timer cleared");
      }
    };
  }, [isTracking]);
  
  // Handle start tracking function
  const handleStartTracking = async (projectId: number) => {
    try {
      if (!employeeId) {
        console.error("Cannot start tracking: No employee ID provided");
        toast({
          title: "خطأ",
          description: "لا يمكن بدء التتبع، معرف الموظف غير متوفر",
          variant: "destructive",
        });
        return;
      }

      if (!projectId) {
        console.error("Cannot start tracking: No project selected");
        toast({
          title: "خطأ",
          description: "يرجى اختيار مشروع أولاً",
          variant: "destructive",
        });
        return;
      }

      console.log("Starting time tracking for employee:", employeeId, "on project:", projectId);
      const now = new Date();
      
      const entry = await startTimeTracking({
        employee_id: employeeId,
        project_id: projectId
      });
      
      if (!entry) {
        throw new Error("Failed to create time entry");
      }
      
      console.log("Successfully created time entry:", entry);
      setCurrentEntry(entry);
      setIsTracking(true);
      setElapsedTime(0);
      
      toast({
        title: "تم تسجيل الحضور",
        description: `بدأ تسجيل الوقت في ${now.toLocaleTimeString()}`,
      });
      
      onTimeEntryUpdate(); // Update parent component data
      
    } catch (error) {
      console.error('Error starting time tracking:', error);
      toast({
        title: "خطأ",
        description: "فشل في بدء تتبع الوقت",
        variant: "destructive",
      });
    }
  };
  
  // Handle stop tracking function
  const handleStopTracking = async () => {
    if (!currentEntry || !currentEntry.id) {
      console.error("Cannot stop tracking: No active entry found or invalid entry ID");
      toast({
        title: "خطأ",
        description: "لا يوجد تسجيل وقت نشط للإيقاف",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Make sure we have a string ID
      const entryId = String(currentEntry.id);
      console.log("Stopping time tracking for entry:", entryId);
      
      const now = new Date();
      const startTime = new Date(currentEntry.startTime).getTime();
      const endTime = now.getTime();
      const duration = Math.floor((endTime - startTime) / 1000); // in seconds
      
      const success = await stopTimeTracking(entryId);
        
      if (!success) {
        throw new Error("Failed to update time entry");
      }
      
      console.log("Successfully completed time entry");
      setIsTracking(false);
      setCurrentEntry(null);
      
      toast({
        title: "تم تسجيل الانصراف",
        description: `انتهى تسجيل الوقت. المدة: ${formatElapsedTime(duration)}`,
      });
      
      onTimeEntryUpdate(); // Update parent component data
      
    } catch (error) {
      console.error('Error stopping time tracking:', error);
      toast({
        title: "خطأ",
        description: "فشل في إيقاف تتبع الوقت",
        variant: "destructive",
      });
    }
  };
  
  return {
    isTracking,
    currentEntry,
    elapsedTime,
    loading,
    formatElapsedTime,
    handleStartTracking,
    handleStopTracking
  };
}
