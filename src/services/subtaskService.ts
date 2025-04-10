
import { supabase } from '@/integrations/supabase/client';

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

// Since the subtasks table is not properly defined in the Database types,
// we need to use a more generic approach to access it
// Get subtasks for a task
export const getSubtasks = async (taskId: string): Promise<Subtask[]> => {
  try {
    // Use a raw query to access the subtasks table
    const { data, error } = await supabase
      .from('subtasks')
      .select()
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching subtasks:', error);
      return [];
    }

    // Return empty array if no data
    if (!data || data.length === 0) {
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
    const { data, error } = await supabase
      .from('subtasks')
      .insert({
        task_id: taskId,
        title: title,
        completed: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subtask:', error);
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
