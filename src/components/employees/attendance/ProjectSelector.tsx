
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: number;
  name: string;
}

interface ProjectSelectorProps {
  selectedProjectId: number | null;
  onProjectSelect: (projectId: number | null) => void;
}

export function ProjectSelector({ selectedProjectId, onProjectSelect }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .order('name');

        if (error) {
          throw error;
        }

        setProjects(data || []);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل المشاريع",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [toast]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="w-full text-center py-2 text-muted-foreground">
        لا توجد مشاريع متاحة
      </div>
    );
  }

  return (
    <div className="w-full">
      <Select 
        value={selectedProjectId?.toString() || ""} 
        onValueChange={(value) => onProjectSelect(value ? Number(value) : null)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر المشروع" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id.toString()}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
