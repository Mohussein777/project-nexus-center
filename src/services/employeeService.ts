import { supabase } from "@/integrations/supabase/client";
import { Employee, Leave, TimeEntry, TimeStats } from "@/components/employees/types";

export const getEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*');

  if (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }

  return data.map(emp => ({
    id: Number(emp.id),
    name: emp.name,
    position: emp.position,
    email: emp.email,
    phone: emp.phone || '',
    department: emp.department,
    joinDate: emp.join_date,
    status: emp.status as 'Active' | 'On Leave' | 'Inactive',
    avatar: emp.name.split(' ').map(n => n[0]).join(''),
    color: getRandomColor(),
    projects: 0,
    employeeId: emp.employee_id || '',
    manager: emp.manager || '',
    skills: []
  }));
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    return null;
  }

  const { data: skills } = await supabase
    .from('employee_skills')
    .select('skill')
    .eq('employee_id', id);

  const { count } = await supabase
    .from('project_employees')
    .select('*', { count: 'exact', head: true })
    .eq('employee_id', id);

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
    color: getRandomColor(),
    projects: count || 0,
    employeeId: data.employee_id || '',
    manager: data.manager || '',
    skills: skills?.map(s => s.skill) || []
  };
};

export const createEmployee = async (employee: Omit<Employee, 'id' | 'avatar' | 'color' | 'projects'>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert({
      name: employee.name,
      position: employee.position,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      join_date: employee.joinDate,
      status: employee.status,
      employee_id: employee.employeeId,
      manager: employee.manager,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating employee:', error);
    throw error;
  }

  if (employee.skills && employee.skills.length > 0) {
    const skillsToInsert = employee.skills.map(skill => ({
      employee_id: data.id,
      skill
    }));

    const { error: skillsError } = await supabase
      .from('employee_skills')
      .insert(skillsToInsert);

    if (skillsError) {
      console.error('Error adding employee skills:', skillsError);
    }
  }

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
    color: getRandomColor(),
    projects: 0,
    employeeId: data.employee_id || '',
    manager: data.manager || '',
    skills: employee.skills || []
  };
};

export const updateEmployee = async (id: string, employee: Partial<Omit<Employee, 'id' | 'avatar' | 'color' | 'projects'>>): Promise<boolean> => {
  const { error } = await supabase
    .from('employees')
    .update({
      name: employee.name,
      position: employee.position,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      join_date: employee.joinDate,
      status: employee.status,
      employee_id: employee.employeeId,
      manager: employee.manager,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error(`Error updating employee ${id}:`, error);
    return false;
  }

  if (employee.skills) {
    await supabase
      .from('employee_skills')
      .delete()
      .eq('employee_id', id);
    
    const skillsToInsert = employee.skills.map(skill => ({
      employee_id: id,
      skill
    }));

    if (skillsToInsert.length > 0) {
      const { error: skillsError } = await supabase
        .from('employee_skills')
        .insert(skillsToInsert);

      if (skillsError) {
        console.error('Error updating employee skills:', skillsError);
        return false;
      }
    }
  }

  return true;
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting employee ${id}:`, error);
    return false;
  }

  return true;
};

export const getEmployeeTimeEntries = async (employeeId: string): Promise<TimeEntry[]> => {
  const { data, error } = await supabase
    .from('time_entries')
    .select(`
      *,
      projects:project_id (name),
      tasks:task_id (name)
    `)
    .eq('employee_id', employeeId)
    .order('date', { ascending: false });

  if (error) {
    console.error(`Error fetching time entries for employee ${employeeId}:`, error);
    return [];
  }

  return data.map(entry => ({
    id: Number(entry.id),
    employeeId: Number(entry.employee_id),
    projectId: entry.project_id,
    taskId: entry.task_id || null,
    startTime: entry.start_time,
    endTime: entry.end_time || null,
    duration: entry.duration || null,
    description: entry.description || '',
    date: entry.date,
    status: entry.status as 'active' | 'completed',
  }));
};

export const getEmployeeLeaves = async (employeeId: string): Promise<Leave[]> => {
  const { data, error } = await supabase
    .from('leaves')
    .select('*')
    .eq('employee_id', employeeId)
    .order('start_date', { ascending: false });

  if (error) {
    console.error(`Error fetching leaves for employee ${employeeId}:`, error);
    return [];
  }

  return data.map(leave => ({
    id: Number(leave.id),
    employeeId: Number(leave.employee_id),
    startDate: leave.start_date,
    endDate: leave.end_date,
    type: leave.type as 'Annual' | 'Sick' | 'Personal' | 'Other',
    status: leave.status as 'Approved' | 'Pending' | 'Rejected',
    reason: leave.reason || '',
  }));
};

function getRandomColor(): string {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-amber-500 to-orange-500',
    'from-green-500 to-emerald-500',
    'from-red-500 to-pink-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-cyan-500',
    'from-rose-500 to-red-500',
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

export const calculateTimeStats = async (employeeId: string): Promise<TimeStats> => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const { data, error } = await supabase
    .from('time_entries')
    .select('duration, date, project_id')
    .eq('employee_id', employeeId)
    .eq('status', 'completed');

  if (error) {
    console.error(`Error calculating time stats for employee ${employeeId}:`, error);
    return {
      today: 0,
      week: 0,
      month: 0,
      projects: {}
    };
  }

  const todaySeconds = data
    .filter(entry => entry.date === today)
    .reduce((total, entry) => total + (entry.duration || 0), 0);
  
  const weekSeconds = data
    .filter(entry => new Date(entry.date) >= weekStart)
    .reduce((total, entry) => total + (entry.duration || 0), 0);
  
  const monthSeconds = data
    .filter(entry => new Date(entry.date) >= monthStart)
    .reduce((total, entry) => total + (entry.duration || 0), 0);
  
  const projectSeconds = data.reduce((projects, entry) => {
    if (entry.project_id !== null) {
      if (!projects[entry.project_id]) {
        projects[entry.project_id] = 0;
      }
      projects[entry.project_id] += entry.duration || 0;
    }
    return projects;
  }, {} as {[projectId: number]: number});
  
  const totalHours = Math.round(monthSeconds / 36) / 100;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const averageDaily = totalHours / currentDay;
  
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  
  const { data: prevMonthData } = await supabase
    .from('time_entries')
    .select('duration')
    .eq('employee_id', employeeId)
    .eq('status', 'completed')
    .gte('date', prevMonthStart.toISOString().split('T')[0])
    .lte('date', prevMonthEnd.toISOString().split('T')[0]);
  
  const prevMonthSeconds = prevMonthData?.reduce((total, entry) => total + (entry.duration || 0), 0) || 0;
  const prevMonthHours = Math.round(prevMonthSeconds / 36) / 100;
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  let percentage = 0;
  
  if (prevMonthHours > 0) {
    const diff = totalHours - prevMonthHours;
    percentage = Math.round((diff / prevMonthHours) * 100);
    
    if (percentage > 5) trend = 'up';
    else if (percentage < -5) trend = 'down';
  }
  
  return {
    today: todaySeconds,
    week: weekSeconds,
    month: monthSeconds,
    projects: projectSeconds,
    totalHours,
    averageDaily,
    trend,
    percentage: Math.abs(percentage)
  };
};

export const getTimeEntries = async (date?: string): Promise<TimeEntry[]> => {
  let query = supabase
    .from('time_entries')
    .select(`
      *,
      projects:project_id (name),
      tasks:task_id (name)
    `)
    .order('date', { ascending: false });
  
  if (date) {
    query = query.eq('date', date);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching time entries:', error);
    return [];
  }

  return data.map(entry => ({
    id: Number(entry.id),
    employeeId: Number(entry.employee_id),
    projectId: entry.project_id,
    taskId: entry.task_id || null,
    startTime: entry.start_time,
    endTime: entry.end_time || null,
    duration: entry.duration || null,
    description: entry.description || '',
    date: entry.date,
    status: entry.status as 'active' | 'completed',
  }));
};

export const formatTimeSpent = (seconds: number): string => {
  if (!seconds) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getCurrentEmployeeStatus = async (employeeId: string) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('employee_id', employeeId)
      .gte('start_time', startOfDay)
      .lte('start_time', endOfDay)
      .order('start_time', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching employee status:', error);
      return { isActive: false, currentEntry: null };
    }

    if (!data || data.length === 0) {
      return { isActive: false, currentEntry: null };
    }

    const latestEntry = data[0];
    const isActive = !latestEntry.end_time;

    return {
      isActive,
      currentEntry: isActive ? latestEntry : null
    };
  } catch (error) {
    console.error('Error in getCurrentEmployeeStatus:', error);
    return { isActive: false, currentEntry: null };
  }
};

export const getCurrentEmployeeStatusAsync = async (employeeId: number): Promise<{
  isActive: boolean;
  currentEntry: TimeEntry | null;
}> => {
  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('status', 'active')
    .order('start_time', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return {
      isActive: false,
      currentEntry: null
    };
  }

  return {
    isActive: true,
    currentEntry: {
      id: Number(data[0].id),
      employeeId: Number(data[0].employee_id),
      projectId: data[0].project_id,
      taskId: data[0].task_id || null,
      startTime: data[0].start_time,
      endTime: data[0].end_time || null,
      duration: data[0].duration || null,
      description: data[0].description || '',
      date: data[0].date,
      status: data[0].status as 'active' | 'completed',
    }
  };
};
