
import React, { useState, useEffect } from 'react';
import { ViewMode } from './types';
import { getProjects } from '@/services/projectService';
import { ProjectsSearchFilter } from './ProjectsSearchFilter';
import { ViewToggle } from './ViewToggle';
import { ProjectsGridView } from './ProjectsGridView';
import { ProjectsListView } from './ProjectsListView';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function ProjectsOverview() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل المشاريع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [toast]);

  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.tag && project.tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">المشاريع</h1>
        <ProjectsSearchFilter 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onProjectCreated={fetchProjects}
        />
      </div>

      <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold">جميع المشاريع ({filteredProjects.length})</h2>
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProjects.length > 0 ? (
          viewMode === 'grid' ? (
            <ProjectsGridView projects={filteredProjects} />
          ) : (
            <ProjectsListView projects={filteredProjects} />
          )
        ) : (
          <div className="text-center p-12 text-muted-foreground">
            لم يتم العثور على مشاريع. حاول تعديل معايير البحث.
          </div>
        )}
      </div>
    </div>
  );
}
