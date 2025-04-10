
import { supabase } from '@/integrations/supabase/client';

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

// Helper function to convert database row to our frontend model
const mapDbSubtaskToSubtask = (item: any): Subtask => ({
  id: String(item.id),
  taskId: item.task_id,
  title: item.title,
  completed: item.completed,
  createdAt: item.created_at
});

// Get subtasks for a task
export const getSubtasks = async (taskId: string): Promise<Subtask[]> => {
  try {
    // Use Supabase API to query 'subtasks' explicitly as a string
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

    return data.map(mapDbSubtaskToSubtask);
  } catch (err) {
    console.error('Error in getSubtasks:', err);
    return [];
  }
};

// Create a new subtask
export const createSubtask = async (taskId: string, title: string): Promise<Subtask | null> => {
  try {
    // Use Supabase API to insert into 'subtasks' explicitly as a string
    const { data, error } = await supabase
      .from('subtasks')
      .insert([{ task_id: taskId, title, completed: false }])
      .select();

    if (error) {
      console.error('Error creating subtask:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return mapDbSubtaskToSubtask(data[0]);
  } catch (err) {
    console.error('Error in createSubtask:', err);
    return null;
  }
};

// Update a subtask
export const updateSubtask = async (id: string, updates: { title?: string; completed?: boolean }): Promise<boolean> => {
  try {
    // Use Supabase API to update 'subtasks' explicitly as a string
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
    // Use Supabase API to delete from 'subtasks' explicitly as a string
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
