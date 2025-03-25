
export interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  progress: number;
  deadline: string;
  team: number;
  priority: string;
  tag: string;
}

export type ViewMode = 'grid' | 'list';
