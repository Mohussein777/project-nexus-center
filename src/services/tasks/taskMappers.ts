
import { Task } from './types';

export const mapDbTaskToTask = (dbTask: any): Task => {
  return {
    id: dbTask.id,
    name: dbTask.name,
    description: dbTask.description || '',
    projectId: dbTask.project_id,
    assigneeId: dbTask.assignee_id || undefined,
    assigneeName: dbTask.assignee?.name,
    startDate: dbTask.start_date,
    endDate: dbTask.end_date,
    status: dbTask.status,
    priority: dbTask.priority,
    progress: dbTask.progress || 0,
    createdAt: dbTask.created_at,
    updatedAt: dbTask.updated_at
  };
};

export const formatDateFields = (task: any): any => {
  return {
    ...task,
    start_date: task.start_date instanceof Date ? task.start_date.toISOString() : task.start_date,
    end_date: task.end_date instanceof Date ? task.end_date.toISOString() : task.end_date
  };
};
