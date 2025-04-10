
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
  // Create a new object for the formatted task data
  const formattedTask = { ...task };
  
  // If startDate is provided in the task object, map it to start_date
  if (task.startDate !== undefined) {
    formattedTask.start_date = task.startDate instanceof Date 
      ? task.startDate.toISOString() 
      : task.startDate;
    delete formattedTask.startDate;
  }
  
  // If endDate is provided in the task object, map it to end_date
  if (task.endDate !== undefined) {
    formattedTask.end_date = task.endDate instanceof Date 
      ? task.endDate.toISOString() 
      : task.endDate;
    delete formattedTask.endDate;
  }
  
  // Handle the case when start_date and end_date are directly provided
  if (task.start_date instanceof Date) {
    formattedTask.start_date = task.start_date.toISOString();
  }
  
  if (task.end_date instanceof Date) {
    formattedTask.end_date = task.end_date.toISOString();
  }
  
  return formattedTask;
};
