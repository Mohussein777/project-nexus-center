
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Employee, TimeEntry } from '../types';
import { supabase } from '@/integrations/supabase/client';

// تنسيق التاريخ باللغة العربية
export const formatDateInArabic = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, 'EEEE، d MMMM yyyy', { locale: ar });
  } catch (error) {
    return dateStr;
  }
};

// تنسيق الوقت المنقضي للعرض (ساعات:دقائق:ثواني)
export const formatElapsedTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return [
    hrs.toString().padStart(2, '0'),
    mins.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
};

// Map Supabase employee data to our Employee type
export const mapEmployee = (data: any): Employee => {
  return {
    id: Number(data.id),
    name: data.name,
    position: data.position,
    email: data.email,
    phone: data.phone || '',
    department: data.department,
    joinDate: data.join_date,
    status: data.status as 'Active' | 'On Leave' | 'Inactive',
    avatar: data.name.split(' ').map((n: string) => n[0]).join(''),
    color: 'from-blue-500 to-cyan-500',
    projects: 0,
    employeeId: data.employee_id || '',
    manager: data.manager || ''
  };
};

// Map Supabase time entry data to our TimeEntry type
export const mapTimeEntry = (entry: any): TimeEntry => {
  return {
    id: Number(entry.id),
    employeeId: Number(entry.employee_id),
    projectId: entry.project_id,
    taskId: entry.task_id || null,
    startTime: entry.start_time,
    endTime: entry.end_time || null,
    duration: entry.duration || null,
    description: entry.description || '',
    date: entry.date,
    status: entry.status as 'active' | 'completed'
  };
};

// Format time in HH:MM format from seconds
export const formatTimeSpent = (seconds: number | null): string => {
  if (!seconds) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Fetch the current user's employee record
export const fetchCurrentUserEmployee = async (userEmail: string | undefined) => {
  if (!userEmail) return null;

  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', userEmail)
      .single();
    
    if (error) {
      console.error('Error fetching current user employee:', error);
      return null;
    }
    
    if (data) {
      return mapEmployee(data);
    }
    return null;
  } catch (error) {
    console.error('Error in fetchCurrentUserEmployee:', error);
    return null;
  }
};
