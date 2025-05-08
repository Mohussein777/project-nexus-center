import { supabase } from "@/integrations/supabase/client";
import { TimeEntry } from "@/components/employees/types";

// Get the current active time entry for an employee
export const getCurrentTimeEntry = async (employeeId: string) => {
  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('status', 'active')
    .order('start_time', { ascending: false })
    .limit(1);
    
  if (error) {
    console.error(`Error fetching current time entry for employee ${employeeId}:`, error);
    return { data: null, error };
  }
  
  if (!data || data.length === 0) {
    return { data: null, error: null };
  }
  
  const entry = data[0];
  return { 
    data: {
      id: Number(entry.id),
      employeeId: Number(entry.employee_id),
      projectId: entry.project_id,
      taskId: entry.task_id || null,
      startTime: entry.start_time,
      endTime: null,
      duration: null,
      description: entry.description || '',
      date: entry.date,
      status: 'active'
    }, 
    error: null 
  };
};

export const startTimeTracking = async (entry: {
  employee_id: string;
  project_id: number;
  task_id?: string;
  description?: string;
}): Promise<TimeEntry | null> => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('time_entries')
    .insert({
      employee_id: entry.employee_id,
      project_id: entry.project_id,
      task_id: entry.task_id,
      description: entry.description,
      start_time: now.toISOString(),
      date: today,
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    console.error('Error starting time tracking:', error);
    return null;
  }

  return {
    id: Number(data.id), // Convert string ID to number for frontend compatibility
    employeeId: Number(data.employee_id),
    projectId: data.project_id,
    taskId: data.task_id || null, // Task ID is a string (UUID) from Supabase
    startTime: data.start_time,
    endTime: null,
    duration: null,
    description: data.description || '',
    date: data.date,
    status: 'active'
  };
};

export const stopTimeTracking = async (entryId: string): Promise<boolean> => {
  // Get the existing entry to calculate duration
  const { data: existingEntry } = await supabase
    .from('time_entries')
    .select('*')
    .eq('id', entryId)
    .single();

  if (!existingEntry || !existingEntry.start_time) {
    console.error(`Time entry ${entryId} not found or invalid`);
    return false;
  }

  const now = new Date();
  const startTime = new Date(existingEntry.start_time);
  const durationSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);

  const { error } = await supabase
    .from('time_entries')
    .update({
      end_time: now.toISOString(),
      duration: durationSeconds,
      status: 'completed'
    })
    .eq('id', entryId);

  if (error) {
    console.error(`Error stopping time entry ${entryId}:`, error);
    return false;
  }

  return true;
};

// Format time in seconds to HH:MM format
export const formatTimeSpent = (seconds: number | null): string => {
  if (!seconds) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
