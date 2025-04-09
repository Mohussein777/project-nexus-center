
import { supabase } from "@/integrations/supabase/client";
import { Subtask } from "@/components/projects/SubtaskChecklist";

// Get all subtasks for a task
export const getSubtasks = async (taskId: string): Promise<Subtask[]> => {
  const { data, error } = await supabase
    .from('subtasks')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching subtasks:', error);
    throw error;
  }

  return (data || []).map(item => ({
    id: item.id,
    taskId: item.task_id,
    title: item.title,
    completed: item.completed,
    createdAt: item.created_at
  }));
};

// Create a new subtask
export const createSubtask = async (subtask: {
  taskId: string;
  title: string;
  completed: boolean;
}): Promise<Subtask | null> => {
  const { data, error } = await supabase
    .from('subtasks')
    .insert({
      task_id: subtask.taskId,
      title: subtask.title,
      completed: subtask.completed
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subtask:', error);
    return null;
  }

  return {
    id: data.id,
    taskId: data.task_id,
    title: data.title,
    completed: data.completed,
    createdAt: data.created_at
  };
};

// Update a subtask
export const updateSubtask = async (
  id: string,
  updates: Partial<Omit<Subtask, 'id' | 'taskId' | 'createdAt'>>
): Promise<boolean> => {
  const { error } = await supabase
    .from('subtasks')
    .update({
      title: updates.title,
      completed: updates.completed
    })
    .eq('id', id);

  if (error) {
    console.error(`Error updating subtask ${id}:`, error);
    return false;
  }

  return true;
};

// Delete a subtask
export const deleteSubtask = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('subtasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting subtask ${id}:`, error);
    return false;
  }

  return true;
};
