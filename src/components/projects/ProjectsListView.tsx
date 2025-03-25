
import { Link } from 'react-router-dom';
import { ArrowUpDown } from 'lucide-react';
import { Project } from './types';
import { getStatusColor, getPriorityColor, getProgressBarColor } from './utils/statusUtils';

interface ProjectsListViewProps {
  projects: Project[];
}

export function ProjectsListView({ projects }: ProjectsListViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span>Project</span>
                <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Client</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Progress</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Deadline</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Team</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Priority</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {projects.map(project => (
            <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium">{project.name}</div>
                  <div className="text-xs text-muted-foreground">{project.tag}</div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{project.client}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="w-full max-w-[100px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getProgressBarColor(project.status)}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{project.deadline}</td>
              <td className="px-4 py-3 text-sm">{project.team} members</td>
              <td className="px-4 py-3">
                <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex space-x-2">
                  <Link to={`/projects/${project.id}/tasks`} className="text-primary hover:underline">Tasks</Link>
                  <button className="text-primary hover:underline">Edit</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
