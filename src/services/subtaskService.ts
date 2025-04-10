
import { supabase } from '@/integrations/supabase/client';

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

// Get subtasks for a task
export const getSubtasks = async (taskId: string): Promise<Subtask[]> => {
  try {
    // Manually specify the type of the expected response to work around TypeScript issues
    type SubtaskResponse = {
      id: string;
      task_id: string;
      title: string;
      completed: boolean;
      created_at: string;
    }[];

    const { data, error } = await supabase
      .rpc('get_subtasks_for_task', { task_id_param: taskId }) as { data: SubtaskResponse | null, error: any };

    if (error) {
      console.error('Error fetching subtasks:', error);
      return [];
    }

    // Return empty array if no data
    if (!data) {
      return [];
    }

    return data.map(item => ({
      id: String(item.id),
      taskId: item.task_id,
      title: item.title,
      completed: item.completed,
      createdAt: item.created_at
    }));
  } catch (err) {
    console.error('Error in getSubtasks:', err);
    return [];
  }
};

// Create a new subtask
export const createSubtask = async (taskId: string, title: string): Promise<Subtask | null> => {
  try {
    // Manually specify the type of the expected response
    type SubtaskResponse = {
      id: string;
      task_id: string;
      title: string;
      completed: boolean;
      created_at: string;
    };

    const { data, error } = await supabase
      .rpc('create_subtask', { 
        task_id_param: taskId,
        title_param: title,
        completed_param: false
      }) as { data: SubtaskResponse | null, error: any };

    if (error) {
      console.error('Error creating subtask:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: String(data.id),
      taskId: data.task_id,
      title: data.title,
      completed: data.completed,
      createdAt: data.created_at
    };
  } catch (err) {
    console.error('Error in createSubtask:', err);
    return null;
  }
};

// Update a subtask
export const updateSubtask = async (id: string, updates: { title?: string; completed?: boolean }): Promise<boolean> => {
  try {
    // Only send parameters that are provided in updates
    const params: Record<string, any> = { id_param: id };
    
    if (updates.title !== undefined) {
      params.title_param = updates.title;
    }
    
    if (updates.completed !== undefined) {
      params.completed_param = updates.completed;
    }
    
    const { error } = await supabase
      .rpc('update_subtask', params) as { data: any, error: any };

    if (error) {
      console.error('Error updating subtask:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in updateSubtask:', err);
    return false;
  }
};

// Delete a subtask
export const deleteSubtask = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .rpc('delete_subtask', { id_param: id }) as { data: any, error: any };

    if (error) {
      console.error('Error deleting subtask:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in deleteSubtask:', err);
    return false;
  }
};
