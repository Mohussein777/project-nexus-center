
export interface Project {
  id: number;
  name: string;
  project_number: string;  // Changed from optional to required
  client: string;
  status: string;
  progress: number;
  deadline: string;
  team: number;
  priority: string;
  tag: string;
}

export type ViewMode = 'grid' | 'list';
