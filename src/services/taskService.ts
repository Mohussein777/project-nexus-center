
// This file is kept for backward compatibility
// New code should import directly from '@/services/tasks'
import {
  Task,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskDependencies,
  addTaskDependency,
  removeTaskDependency
} from './tasks';

export {
  Task,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskDependencies,
  addTaskDependency,
  removeTaskDependency
};

export type { TaskCreate, TaskUpdate } from './tasks/types';
