
import { useState } from 'react';
import { ViewMode } from './types';
import { projects } from './projectsData';
import { ProjectsSearchFilter } from './ProjectsSearchFilter';
import { ViewToggle } from './ViewToggle';
import { ProjectsGridView } from './ProjectsGridView';
import { ProjectsListView } from './ProjectsListView';

export function ProjectsOverview() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <ProjectsSearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold">All Projects ({filteredProjects.length})</h2>
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        
        {viewMode === 'grid' ? (
          <ProjectsGridView projects={filteredProjects} />
        ) : (
          <ProjectsListView projects={filteredProjects} />
        )}
      </div>
    </div>
  );
}
