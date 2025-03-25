
import { Project } from './types';
import { ProjectCard } from './ProjectCard';

interface ProjectsGridViewProps {
  projects: Project[];
}

export function ProjectsGridView({ projects }: ProjectsGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
