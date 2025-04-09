
import { supabase } from "@/integrations/supabase/client";

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
