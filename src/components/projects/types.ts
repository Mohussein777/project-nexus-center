
export interface Project {
  id: number;
  name: string;
  project_number?: string;
  client: string;
  status: string;
  progress: number;  // Currently using default value 0 since not in DB
  deadline: string;
  team: number;
  priority: string;  // Currently using default value 'Medium' since not in DB
  tag: string;       // Currently using substring of description since not in DB
}

export type ViewMode = 'grid' | 'list';
