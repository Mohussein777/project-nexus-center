
import React, { useState, useEffect } from 'react';
import { ViewMode } from './types';
import { getProjects } from '@/services/projectService';
import { ProjectsSearchFilter } from './ProjectsSearchFilter';
import { ViewToggle } from './ViewToggle';
import { ProjectsGridView } from './ProjectsGridView';
import { ProjectsListView } from './ProjectsListView';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function ProjectsOverview() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError(t('errorLoadingProjects'));
      toast({
        title: t('error'),
        description: t('errorLoadingProjects'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.tag && project.tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{t('projects')}</h1>
        <ProjectsSearchFilter 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onProjectCreated={fetchProjects}
        />
      </div>

      <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold">{t('allProjects')} ({filteredProjects.length})</h2>
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
            {t('noProjectsFound')}
          </div>
        )}
      </div>
    </div>
  );
}
