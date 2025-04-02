
import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ProjectForm } from './ProjectForm';
import { createProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectsSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onProjectCreated: () => void;
}

export function ProjectsSearchFilter({
  searchQuery,
  setSearchQuery,
  onProjectCreated,
}: ProjectsSearchFilterProps) {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleCreateProject = async (values: any) => {
    console.log('Form values to create project:', values);
    
    try {
      const result = await createProject(values);
      
      if (result) {
        toast({
          title: t('projectCreatedSuccess'),
          variant: 'default',
        });
        setShowNewProjectDialog(false);
        onProjectCreated();
      } else {
        toast({
          title: t('error'),
          description: t('projectCreateError'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: t('error'),
        description: t('projectCreateError'),
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('searchProjects')}
          className="pl-8 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="absolute right-2 top-2.5 h-4 w-4 rounded-sm text-muted-foreground hover:text-foreground"
            onClick={() => setSearchQuery('')}
          >
            ×
          </button>
        )}
      </div>
      
      <Button onClick={() => setShowNewProjectDialog(true)}>
        <Plus className="h-4 w-4 mr-1" />
        {t('newProject')}
      </Button>
      
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 w-[95vw] sm:max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw]">
          <DialogHeader>
            <DialogTitle>{t('newProject')}</DialogTitle>
            <DialogDescription>
              {t('fillProjectDetails')}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <ProjectForm 
              onSubmit={handleCreateProject} 
              onCancel={() => setShowNewProjectDialog(false)} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
