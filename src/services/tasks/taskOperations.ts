
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskCreate, TaskUpdate } from './types';
import { mapDbTaskToTask, formatDateFields } from './taskMappers';

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

  return data.map(mapDbTaskToTask);
};

export const createTask = async (task: TaskCreate): Promise<Task | null> => {
  // Format dates if needed
  const taskData = formatDateFields(task);

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

  return mapDbTaskToTask({
    ...data,
    assignee: { name: assigneeName }
  });
};

export const updateTask = async (id: string, task: TaskUpdate): Promise<boolean> => {
  // Format dates and ensure we're using database column names
  const taskData = formatDateFields(task);
  
  // Add updated_at field
  taskData.updated_at = new Date().toISOString();
  
  console.log(`Updating task ${id} with data:`, taskData);

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
