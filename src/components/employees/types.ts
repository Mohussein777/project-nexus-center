export interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  department: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  avatar: string;
  color: string;
  projects: number;
  skills?: string[];
  employeeId?: string;
  manager?: string;
  workHours?: {
    start: string;
    end: string;
  };
}

export interface TimeEntry {
  id: string | number;
  employeeId: string | number;
  projectId: number | null;
  taskId: string | null;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  description: string;
  date: string;
  status: string;
}

export interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  color: string;
}

export interface Leave {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  type: 'Annual' | 'Sick' | 'Personal' | 'Other';
  status: 'Approved' | 'Pending' | 'Rejected';
  reason: string;
}

export interface TimeStats {
  today: number;
  week: number;
  month: number;
  projects: {[projectId: number]: number};
  totalHours?: number;
  averageDaily?: number;
  trend?: 'up' | 'down' | 'stable';
  percentage?: number;
}
