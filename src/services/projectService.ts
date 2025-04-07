
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/components/projects/types";
import { useToast } from '@/hooks/use-toast';

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
    project_number: project.project_number || '',
    client: project.clients?.name || 'N/A',
    status: project.status,
    progress: project.progress || 0,
    deadline: project.end_date || 'N/A',
    team: 0, // Will count team members below
    priority: project.priority || 'Medium',
    tag: project.tag || project.description?.substring(0, 10) || ''
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
    project_number: data.project_number || '',
    client: data.clients?.name || 'N/A',
    status: data.status,
    progress: data.progress || 0,
    deadline: data.end_date || 'N/A',
    team: count || 0,
    priority: data.priority || 'Medium',
    tag: data.tag || data.description?.substring(0, 10) || ''
  };
};

export const checkProjectNumberExists = async (projectNumber: string, excludeId?: number): Promise<boolean> => {
  let query = supabase
    .from('projects')
    .select('id')
    .eq('project_number', projectNumber);
    
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error checking project number existence:', error);
    return false;
  }
  
  return data && data.length > 0;
};

export const createProject = async (project: {
  name: string;
  project_number: string;
  description?: string;
  client_id: number;
  status: string;
  start_date: string | Date;
  end_date?: string | Date;
  budget?: number;
  priority?: string;
  tag?: string;
}): Promise<Project | null> => {
  // Check if project number already exists
  const exists = await checkProjectNumberExists(project.project_number);
  if (exists) {
    throw new Error('رقم المشروع موجود بالفعل. الرجاء اختيار رقم مشروع آخر.');
  }

  // Convert to lowercase with underscores for status to match database constraint
  const statusValue = project.status.toLowerCase().replace(' ', '_');
  
  // Filter out properties not in the database schema
  const { priority, tag, ...projectData } = project;
  
  // Convert Date objects to strings if needed
  const cleanProjectData = {
    ...projectData,
    status: statusValue,
    start_date: projectData.start_date instanceof Date 
      ? projectData.start_date.toISOString() 
      : projectData.start_date,
    end_date: projectData.end_date instanceof Date 
      ? projectData.end_date.toISOString() 
      : projectData.end_date,
    priority: priority,
    tag: tag
  };

  console.log('Creating project with data:', cleanProjectData);

  const { data, error } = await supabase
    .from('projects')
    .insert(cleanProjectData)
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  console.log('Project created successfully:', data);

  // Get client name
  const { data: client } = await supabase
    .from('clients')
    .select('name')
    .eq('id', data.client_id)
    .single();

  return {
    id: data.id,
    name: data.name,
    project_number: data.project_number || '',
    client: client?.name || 'N/A',
    status: data.status,
    progress: data.progress || 0,
    deadline: data.end_date || 'N/A',
    team: 0,
    priority: data.priority || 'Medium',
    tag: data.tag || data.description?.substring(0, 10) || ''
  };
};

export const updateProject = async (id: number, project: {
  name?: string;
  project_number?: string;
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
  // Check if project number already exists (excluding current project)
  if (project.project_number) {
    const exists = await checkProjectNumberExists(project.project_number, id);
    if (exists) {
      throw new Error('رقم المشروع موجود بالفعل. الرجاء اختيار رقم مشروع آخر.');
    }
  }
  
  // Convert status if present
  const updatedProject = { ...project };
  if (project.status) {
    updatedProject.status = project.status.toLowerCase().replace(' ', '_');
  }
  
  const { error } = await supabase
    .from('projects')
    .update({
      ...updatedProject,
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
