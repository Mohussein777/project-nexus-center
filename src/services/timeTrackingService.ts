
import { supabase } from "@/integrations/supabase/client";
import { TimeEntry } from "@/components/employees/types";

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
};

export const stopTimeTracking = async (entryId: string): Promise<TimeEntry | null> => {
  // Get the existing entry to calculate duration
  const { data: existingEntry } = await supabase
    .from('time_entries')
    .select('*')
    .eq('id', entryId)
    .single();

  if (!existingEntry || !existingEntry.start_time) {
    console.error(`Time entry ${entryId} not found or invalid`);
    return null;
  }

  const now = new Date();
  const startTime = new Date(existingEntry.start_time);
  const durationSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);

  const { data, error } = await supabase
    .from('time_entries')
    .update({
      end_time: now.toISOString(),
      duration: durationSeconds,
      status: 'completed'
    })
    .eq('id', entryId)
    .select()
    .single();

  if (error) {
    console.error(`Error stopping time entry ${entryId}:`, error);
    return null;
  }

  return {
    id: Number(data.id),
    employeeId: Number(data.employee_id),
    projectId: data.project_id,
    taskId: data.task_id || null,
    startTime: data.start_time,
    endTime: data.end_time,
    duration: data.duration,
    description: data.description || '',
    date: data.date,
    status: 'completed'
  };
};

export const getCurrentTimeEntry = async (employeeId: string): Promise<TimeEntry | null> => {
  const { data, error } = await supabase
    .from('time_entries')
    .select(`
      *,
      projects:project_id (name),
      tasks:task_id (name)
    `)
    .eq('employee_id', employeeId)
    .eq('status', 'active')
    .order('start_time', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return null;
    }
    console.error(`Error fetching current time entry for employee ${employeeId}:`, error);
    return null;
  }

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
};

// Format time in seconds to HH:MM format
export const formatTimeSpent = (seconds: number | null): string => {
  if (!seconds) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
