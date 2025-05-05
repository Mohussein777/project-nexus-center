
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatTimeSpent } from '@/services/employeeService';

export function useTimeTracking(employeeId: string, onTimeEntryUpdate: () => void) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Check active time entry when component loads
  useEffect(() => {
    const checkActiveTimeEntry = async () => {
      try {
        if (!employeeId) {
          console.log("No employee ID provided");
          setLoading(false);
          return;
        }

        console.log("Checking active time entry for employee:", employeeId);
        const { data, error } = await supabase
          .from('time_entries')
          .select('*')
          .eq('employee_id', employeeId)
          .eq('status', 'active')
          .order('start_time', { ascending: false })
          .limit(1);
          
        if (error) {
          console.error("Error checking active time entry:", error);
          throw error;
        }
          
        console.log("Active time entry data:", data);
        if (data && data.length > 0) {
          const entry = data[0];
          setCurrentEntry(entry);
          setIsTracking(true);
          
          // Calculate elapsed time since tracking started
          const startTime = new Date(entry.start_time).getTime();
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
    };
    
    if (employeeId) {
      checkActiveTimeEntry();
    } else {
      setLoading(false);
    }
  }, [employeeId, toast]);
  
  // Update elapsed time counter every second if tracking is active
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTracking) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTracking]);
  
  const handleStartTracking = async () => {
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

      console.log("Starting time tracking for employee:", employeeId);
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('time_entries')
        .insert([{
          employee_id: employeeId,
          date: today,
          start_time: now.toISOString(),
          status: 'active',
        }])
        .select();
        
      if (error) {
        console.error("Error inserting time entry:", error);
        throw error;
      }
      
      console.log("Successfully created time entry:", data);
      setCurrentEntry(data[0]);
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
  
  const handleStopTracking = async () => {
    if (!currentEntry) {
      console.error("Cannot stop tracking: No active entry found");
      return;
    }
    
    try {
      console.log("Stopping time tracking for entry:", currentEntry.id);
      const now = new Date();
      const startTime = new Date(currentEntry.start_time).getTime();
      const endTime = now.getTime();
      const duration = Math.floor((endTime - startTime) / 1000); // in seconds
      
      const { error } = await supabase
        .from('time_entries')
        .update({
          end_time: now.toISOString(),
          duration: duration,
          status: 'completed',
        })
        .eq('id', currentEntry.id);
        
      if (error) {
        console.error("Error updating time entry:", error);
        throw error;
      }
      
      console.log("Successfully completed time entry");
      setIsTracking(false);
      setCurrentEntry(null);
      
      toast({
        title: "تم تسجيل الانصراف",
        description: `انتهى تسجيل الوقت. المدة: ${formatTimeSpent(duration)}`,
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

  // Format elapsed time for display (HH:MM:SS)
  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
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
