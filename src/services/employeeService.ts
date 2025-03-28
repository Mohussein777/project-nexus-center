
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
    projects: 0, // Will be populated separately
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

  // Get employee skills
  const { data: skills } = await supabase
    .from('employee_skills')
    .select('skill')
    .eq('employee_id', id);

  // Count employee projects
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

  // Add skills if provided
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

  // Update skills if provided
  if (employee.skills) {
    // Delete existing skills
    await supabase
      .from('employee_skills')
      .delete()
      .eq('employee_id', id);
    
    // Add new skills
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

// Helper function to generate random gradient colors for employee avatars
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

// Calculate time stats for an employee
export const calculateTimeStats = async (employeeId: string): Promise<TimeStats> => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Get completed time entries
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

  // Calculate totals
  const todaySeconds = data
    .filter(entry => entry.date === today)
    .reduce((total, entry) => total + (entry.duration || 0), 0);
  
  const weekSeconds = data
    .filter(entry => new Date(entry.date) >= weekStart)
    .reduce((total, entry) => total + (entry.duration || 0), 0);
  
  const monthSeconds = data
    .filter(entry => new Date(entry.date) >= monthStart)
    .reduce((total, entry) => total + (entry.duration || 0), 0);
  
  // Calculate per-project totals
  const projectSeconds = data.reduce((projects, entry) => {
    if (entry.project_id !== null) {
      if (!projects[entry.project_id]) {
        projects[entry.project_id] = 0;
      }
      projects[entry.project_id] += entry.duration || 0;
    }
    return projects;
  }, {} as {[projectId: number]: number});
  
  // Calculate additional stats
  const totalHours = Math.round(monthSeconds / 36) / 100; // Convert to hours with 2 decimal places
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const averageDaily = totalHours / currentDay;
  
  // Get previous month's data for trend analysis
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
