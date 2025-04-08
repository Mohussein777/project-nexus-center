
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectHeaderProps {
  project: any;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate('/projects')}
        className="h-8 w-8"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <span className="text-sm font-semibold text-muted-foreground">#{project.project_number}</span>
        </div>
        <p className="text-sm text-muted-foreground">{project.client}</p>
      </div>
    </div>
  );
}
