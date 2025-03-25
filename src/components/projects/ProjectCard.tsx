
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Project } from './types';
import { getStatusColor, getPriorityColor, getProgressBarColor } from './utils/statusUtils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{project.name}</h3>
            <p className="text-sm text-muted-foreground">{project.client}</p>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getProgressBarColor(project.status)}`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Deadline</p>
            <p className="font-medium flex items-center">
              <Clock size={14} className="mr-1" />
              {project.deadline}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Team</p>
            <p className="font-medium">{project.team} members</p>
          </div>
          <div>
            <p className="text-muted-foreground">Priority</p>
            <p className={`font-medium ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium">{project.tag}</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-border px-4 py-2 bg-gray-50 dark:bg-gray-800 flex justify-between">
        <Link to={`/projects/${project.id}/tasks`} className="text-sm text-primary hover:underline">Tasks</Link>
        <button className="text-sm text-primary hover:underline">Details</button>
        <button className="text-sm text-primary hover:underline">Files</button>
      </div>
    </div>
  );
}
