
export interface Task {
  id: string;
  name: string;
  description?: string;
  projectId: number;
  assigneeId?: string;
  assigneeName?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  priority: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreate {
  name: string;
  description?: string;
  project_id: number;
  assignee_id?: string;
  start_date?: string | Date;
  end_date?: string | Date;
  status: string;
  priority: string;
  progress?: number;
}

export interface TaskUpdate {
  name?: string;
  description?: string;
  assignee_id?: string;
  start_date?: string | Date;
  end_date?: string | Date;
  status?: string;
  priority?: string;
  progress?: number;
}
