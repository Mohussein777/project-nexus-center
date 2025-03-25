
import { Project } from './types';

export const projects: Project[] = [
  {
    id: 1,
    name: 'Al Hamra Tower',
    client: 'Al Hamra Real Estate',
    status: 'In Progress',
    progress: 65,
    deadline: 'Aug 15, 2023',
    team: 8,
    priority: 'High',
    tag: 'Commercial'
  },
  {
    id: 2,
    name: 'Marina Residence',
    client: 'Gulf Developers',
    status: 'At Risk',
    progress: 45,
    deadline: 'Jul 30, 2023',
    team: 6,
    priority: 'Medium',
    tag: 'Residential'
  },
  {
    id: 3,
    name: 'Tech Park',
    client: 'Ministry of Technology',
    status: 'On Track',
    progress: 72,
    deadline: 'Oct 10, 2023',
    team: 12,
    priority: 'High',
    tag: 'Government'
  },
  {
    id: 4,
    name: 'Gulf Heights',
    client: 'Al Madina Group',
    status: 'Delayed',
    progress: 35,
    deadline: 'Jun 20, 2023',
    team: 9,
    priority: 'Urgent',
    tag: 'Mixed Use'
  },
  {
    id: 5,
    name: 'Central Hospital',
    client: 'Ministry of Health',
    status: 'On Track',
    progress: 85,
    deadline: 'Sep 5, 2023',
    team: 15,
    priority: 'High',
    tag: 'Healthcare'
  },
  {
    id: 6,
    name: 'Sunset Mall',
    client: 'Retail Ventures',
    status: 'On Hold',
    progress: 25,
    deadline: 'N/A',
    team: 4,
    priority: 'Low',
    tag: 'Retail'
  }
];
