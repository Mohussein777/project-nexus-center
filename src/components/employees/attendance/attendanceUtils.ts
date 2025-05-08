
import { supabase } from "@/integrations/supabase/client";

// Fetch employee by email
export const fetchCurrentUserEmployee = async (email: string) => {
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
    return data;
  } catch (error) {
    console.error("Exception in fetchCurrentUserEmployee:", error);
    return null;
  }
};

// Format a date object to YYYY-MM-DD string
export const formatDateForApi = (date: Date): string => {
  return date.toISOString().split('T')[0];
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
