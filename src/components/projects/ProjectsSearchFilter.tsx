
import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from './ProjectForm';
import { createProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ProjectsSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onProjectCreated?: () => void;
}

export function ProjectsSearchFilter({ searchQuery, setSearchQuery, onProjectCreated }: ProjectsSearchFilterProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleCreateProject = async (formData: any) => {
    try {
      // Format dates for API
      const projectData = {
        ...formData,
        start_date: format(formData.start_date, 'yyyy-MM-dd'),
        end_date: formData.end_date ? format(formData.end_date, 'yyyy-MM-dd') : undefined
      };
      
      const newProject = await createProject(projectData);
      
      if (newProject) {
        toast({
          title: "نجاح",
          description: "تم إنشاء المشروع بنجاح",
        });
        
        setIsDialogOpen(false);
        
        // Refresh projects list
        if (onProjectCreated) {
          onProjectCreated();
        }
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء المشروع",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="البحث عن مشروع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm w-60 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-gray-800"
          />
        </div>
        
        <button className="inline-flex items-center space-x-1 px-3 py-2 border border-border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Filter size={16} />
          <span>تصفية</span>
        </button>
        
        <Button onClick={() => setIsDialogOpen(true)} className="inline-flex items-center space-x-1 px-3 py-2">
          <Plus size={16} />
          <span>إنشاء مشروع</span>
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>إنشاء مشروع جديد</DialogTitle>
          </DialogHeader>
          <ProjectForm 
            onSubmit={handleCreateProject} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
