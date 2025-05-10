
import { supabase } from "@/integrations/supabase/client";
import { Employee, TimeEntry } from '../types';

// Fetch employee by email
export const fetchCurrentUserEmployee = async (email: string): Promise<Employee | null> => {
  console.log("Fetching employee data for email:", email);
  
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error("Error fetching employee by email:", error);
      return null;
    }
    
    if (!data) {
      console.log("No employee found with email:", email);
      return null;
    }
    
    console.log("Found employee:", data);
    // Map the database response to match the Employee type
    return {
      id: Number(data.id),
      name: data.name,
      position: data.position,
      email: data.email,
      phone: data.phone || '',
      department: data.department,
      joinDate: data.join_date,
      status: data.status as 'Active' | 'On Leave' | 'Inactive',
      avatar: data.name.split(' ').map(n => n[0]).join(''),
      color: 'from-blue-500 to-cyan-500', // Default color
      projects: 0,
      employeeId: data.employee_id || '',
      manager: data.manager || ''
    };
  } catch (error) {
    console.error("Exception in fetchCurrentUserEmployee:", error);
    return null;
  }
};

// Format a date object to YYYY-MM-DD string
export const formatDateForApi = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Format date in Arabic
export const formatDateInArabic = (dateStr: string): string => {
  if (!dateStr) return '-';
  
  try {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    
    return date.toLocaleDateString('ar-EG', options);
  } catch (error) {
    console.error('Error formatting date to Arabic:', error);
    return dateStr;
  }
};

// Format time spent in seconds to HH:MM format
export const formatTimeSpent = (seconds: number | null): string => {
  if (seconds === null || seconds === undefined) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Get the start and end of a date range
export const getDateRange = (period: 'today' | 'week' | 'month'): { start: Date, end: Date } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  
  const start = new Date(today);
  
  if (period === 'week') {
    // Set start to the beginning of the week (Sunday)
    const dayOfWeek = start.getDay();
    start.setDate(start.getDate() - dayOfWeek);
  } else if (period === 'month') {
    // Set start to the first day of the month
    start.setDate(1);
  }
  
  return { start, end };
};

// Map TimeEntry from database format to application format
export const mapTimeEntry = (entry: any): TimeEntry => {
  return {
    id: entry.id || 0,
    employeeId: entry.employee_id || '',
    projectId: entry.project_id || null,
    taskId: entry.task_id || null,
    startTime: entry.start_time || '',
    endTime: entry.end_time || null,
    duration: entry.duration || null,
    description: entry.description || '',
    date: entry.date || '',
    status: entry.status || 'completed'
  };
};
