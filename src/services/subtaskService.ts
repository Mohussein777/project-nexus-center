
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
    // Use direct query instead of edge function to avoid CORS issues
    const { data, error } = await supabase
      .from('subtasks')
      .select('*')
      .eq('task_id', taskId);

    if (error) {
      console.error('Error fetching subtasks:', error);
      return [];
    }

    if (!data || !Array.isArray(data)) {
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
    // Use direct query instead of edge function to avoid CORS issues
    const { data, error } = await supabase
      .from('subtasks')
      .insert([{ task_id: taskId, title, completed: false }])
      .select()
      .single();

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
    // Use direct query instead of edge function to avoid CORS issues
    const { error } = await supabase
      .from('subtasks')
      .update(updates)
      .eq('id', id);

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
    // Use direct query instead of edge function to avoid CORS issues
    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', id);

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
