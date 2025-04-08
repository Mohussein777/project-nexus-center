
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, BarChart, CheckSquare, AlignCenter, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface TasksTabsControlProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  onAddTask: () => void;
}

export function TasksTabsControl({ activeTab, setActiveTab, onAddTask }: TasksTabsControlProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4" />
            <span>{t('taskList')}</span>
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-1">
            <AlignCenter className="h-4 w-4" />
            <span>{t('kanban')}</span>
          </TabsTrigger>
          <TabsTrigger value="gantt" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{t('gantt')}</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/workload')}
          >
            <BarChart className="h-4 w-4 mr-2" />
            {t('workloadPreview')}
          </Button>
          
          <Button onClick={onAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            {t('addTask')}
          </Button>
        </div>
      </Tabs>
    </div>
  );
}
