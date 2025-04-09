
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  name: string;
  description?: string;
  projectId: number;
  assigneeId?: string;
  assigneeName?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  priority: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export const getTasks = async (projectId: number): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:assignee_id (id, name)
    `)
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  return data.map(task => ({
    id: task.id,
    name: task.name,
    description: task.description || '',
    projectId: task.project_id,
    assigneeId: task.assignee_id || undefined,
    assigneeName: task.assignee?.name,
    startDate: task.start_date,
    endDate: task.end_date,
    status: task.status,
    priority: task.priority,
    progress: task.progress || 0,
    createdAt: task.created_at,
    updatedAt: task.updated_at
  }));
};

export const createTask = async (task: {
  name: string;
  description?: string;
  project_id: number;
  assignee_id?: string;
  start_date?: string | Date;
  end_date?: string | Date;
  status: string;
  priority: string;
}): Promise<Task | null> => {
  // Convert Date objects to strings if needed
  const taskData = {
    ...task,
    start_date: task.start_date instanceof Date ? task.start_date.toISOString() : task.start_date,
    end_date: task.end_date instanceof Date ? task.end_date.toISOString() : task.end_date
  };

  console.log("Creating task with data:", taskData);

  const { data, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }

  // Get assignee name if applicable
  let assigneeName;
  if (data.assignee_id) {
    const { data: assignee } = await supabase
      .from('employees')
      .select('name')
      .eq('id', data.assignee_id)
      .single();
    
    assigneeName = assignee?.name;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    projectId: data.project_id,
    assigneeId: data.assignee_id,
    assigneeName,
    startDate: data.start_date,
    endDate: data.end_date,
    status: data.status,
    priority: data.priority,
    progress: data.progress || 0,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateTask = async (id: string, task: {
  name?: string;
  description?: string;
  assignee_id?: string;
  start_date?: string | Date;
  end_date?: string | Date;
  status?: string;
  priority?: string;
  progress?: number;
}): Promise<boolean> => {
  // Convert Date objects to strings if needed
  const taskData = {
    ...task,
    start_date: task.start_date instanceof Date ? task.start_date.toISOString() : task.start_date,
    end_date: task.end_date instanceof Date ? task.end_date.toISOString() : task.end_date,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('tasks')
    .update(taskData)
    .eq('id', id);

  if (error) {
    console.error(`Error updating task ${id}:`, error);
    return false;
  }

  return true;
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting task ${id}:`, error);
    return false;
  }

  return true;
};

export const getTaskDependencies = async (taskId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('task_dependencies')
    .select('dependency_id')
    .eq('task_id', taskId);

  if (error) {
    console.error(`Error fetching dependencies for task ${taskId}:`, error);
    return [];
  }

  return data.map(item => item.dependency_id);
};

export const addTaskDependency = async (taskId: string, dependencyId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('task_dependencies')
    .insert({
      task_id: taskId,
      dependency_id: dependencyId
    });

  if (error) {
    console.error(`Error adding dependency between tasks ${taskId} and ${dependencyId}:`, error);
    return false;
  }

  return true;
};

export const removeTaskDependency = async (taskId: string, dependencyId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('task_dependencies')
    .delete()
    .eq('task_id', taskId)
    .eq('dependency_id', dependencyId);

  if (error) {
    console.error(`Error removing dependency between tasks ${taskId} and ${dependencyId}:`, error);
    return false;
  }

  return true;
};
