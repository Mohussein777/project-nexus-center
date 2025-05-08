
import { supabase } from "@/integrations/supabase/client";
import { TimeEntry } from "@/components/employees/types";

// Get the current active time entry for an employee
export const getCurrentTimeEntry = async (employeeId: string) => {
  if (!employeeId) {
    console.log("No employee ID provided to getCurrentTimeEntry");
    return { data: null, error: new Error("No employee ID provided") };
  }
  
  console.log(`Fetching current time entry for employee ${employeeId}`);
  
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
    console.log(`No active time entry found for employee ${employeeId}`);
    return { data: null, error: null };
  }
  
  const entry = data[0];
  console.log(`Found active time entry for employee ${employeeId}:`, entry);
  
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
  if (!entry.employee_id || !entry.project_id) {
    console.error("Employee ID or Project ID missing for startTimeTracking");
    return null;
  }
  
  console.log(`Starting time tracking for employee ${entry.employee_id} on project ${entry.project_id}`);
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  try {
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

    console.log('Time tracking started successfully:', data);
    
    return {
      id: Number(data.id),
      employeeId: Number(data.employee_id),
      projectId: data.project_id,
      taskId: data.task_id || null,
      startTime: data.start_time,
      endTime: null,
      duration: null,
      description: data.description || '',
      date: data.date,
      status: 'active'
    };
  } catch (error) {
    console.error('Exception in startTimeTracking:', error);
    return null;
  }
};

export const stopTimeTracking = async (entryId: string | number): Promise<boolean> => {
  const entryIdStr = entryId.toString();
  console.log(`Stopping time tracking for entry ${entryIdStr}`);
  
  // Get the existing entry to calculate duration
  try {
    const { data: existingEntry } = await supabase
      .from('time_entries')
      .select('*')
      .eq('id', entryIdStr)
      .single();

    if (!existingEntry || !existingEntry.start_time) {
      console.error(`Time entry ${entryIdStr} not found or invalid`);
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
      .eq('id', entryIdStr);

    if (error) {
      console.error(`Error stopping time entry ${entryIdStr}:`, error);
      return false;
    }

    console.log(`Time entry ${entryIdStr} stopped successfully`);
    return true;
  } catch (error) {
    console.error(`Exception in stopTimeTracking for entry ${entryIdStr}:`, error);
    return false;
  }
};

// Format time in seconds to HH:MM format
export const formatTimeSpent = (seconds: number | null): string => {
  if (!seconds) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
