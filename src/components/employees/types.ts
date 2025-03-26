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
  id: number;
  employeeId: number;
  projectId: number | null;
  taskId: number | null;
  startTime: string;
  endTime: string | null;
  duration: number | null; // في الثواني
  description: string;
  date: string;
  status: 'active' | 'completed';
}

export interface Project {
  id: number;
  name: string;
  client: string;
  status: 'Active' | 'Completed' | 'On Hold';
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
  totalHours: number;
  averageDaily: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}
