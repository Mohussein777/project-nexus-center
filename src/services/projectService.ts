import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/components/projects/types";

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      clients:client_id (name)
    `);

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return data.map(project => ({
    id: project.id,
    name: project.name,
    client: project.clients?.name || 'N/A',
    status: project.status,
    progress: project.progress || 0, // Default to 0 if not available
    deadline: project.end_date || 'N/A',
    team: 0, // Will count team members below
    priority: project.priority || 'Medium', // Default to Medium if not available
    tag: project.tag || '' // Default to empty string if not available
  }));
};

export const getProjectById = async (id: number): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      clients:client_id (name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }

  // Count team members
  const { count } = await supabase
    .from('project_employees')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', id);

  return {
    id: data.id,
    name: data.name,
    client: data.clients?.name || 'N/A',
    status: data.status,
    progress: data.progress || 0, // Default to 0 if not available
    deadline: data.end_date || 'N/A',
    team: count || 0,
    priority: data.priority || 'Medium', // Default to Medium if not available
    tag: data.tag || '' // Default to empty string if not available
  };
};

export const createProject = async (project: {
  name: string;
  description?: string;
  client_id: number;
  status: string;
  start_date: string;
  end_date?: string;
  budget?: number;
  priority?: string;
  tag?: string;
}): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  // Get client name
  const { data: client } = await supabase
    .from('clients')
    .select('name')
    .eq('id', data.client_id)
    .single();

  return {
    id: data.id,
    name: data.name,
    client: client?.name || 'N/A',
    status: data.status,
    progress: data.progress || 0, // Default to 0 if not available
    deadline: data.end_date || 'N/A',
    team: 0,
    priority: data.priority || 'Medium', // Default to Medium if not available
    tag: data.tag || '' // Default to empty string if not available
  };
};

export const updateProject = async (id: number, project: {
  name?: string;
  description?: string;
  client_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  progress?: number;
  priority?: string;
  tag?: string;
}): Promise<boolean> => {
  const { error } = await supabase
    .from('projects')
    .update({
      ...project,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error(`Error updating project ${id}:`, error);
    return false;
  }

  return true;
};

export const deleteProject = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting project ${id}:`, error);
    return false;
  }

  return true;
};

export const assignEmployeeToProject = async (projectId: number, employeeId: string, role: string): Promise<boolean> => {
  const { error } = await supabase
    .from('project_employees')
    .insert({
      project_id: projectId,
      employee_id: employeeId,
      role: role
    });

  if (error) {
    console.error(`Error assigning employee ${employeeId} to project ${projectId}:`, error);
    return false;
  }

  return true;
};

export const removeEmployeeFromProject = async (projectId: number, employeeId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('project_employees')
    .delete()
    .eq('project_id', projectId)
    .eq('employee_id', employeeId);

  if (error) {
    console.error(`Error removing employee ${employeeId} from project ${projectId}:`, error);
    return false;
  }

  return true;
};

export const getProjectEmployees = async (projectId: number): Promise<{ id: string; name: string; position: string; role: string }[]> => {
  const { data, error } = await supabase
    .from('project_employees')
    .select(`
      role,
      employees:employee_id (id, name, position)
    `)
    .eq('project_id', projectId);

  if (error) {
    console.error(`Error fetching employees for project ${projectId}:`, error);
    return [];
  }

  return data.map(item => ({
    id: item.employees.id,
    name: item.employees.name,
    position: item.employees.position,
    role: item.role
  }));
};
