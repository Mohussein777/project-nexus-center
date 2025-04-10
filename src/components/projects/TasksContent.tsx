
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TaskList } from './TaskList';
import { KanbanBoard } from './KanbanBoard';
import { GanttChart } from './GanttChart';
import { useLanguage } from '@/contexts/LanguageContext';
import { Task } from '@/services/tasks/types';

interface TasksContentProps {
  activeTab: string;
  tasks: Task[];
  onUpdateTask: (task: Task) => Promise<boolean>;
  onDeleteTask: (taskId: string) => Promise<boolean>;
  onAddTask: () => void;
}

export function TasksContent({ 
  activeTab, 
  tasks, 
  onUpdateTask, 
  onDeleteTask, 
  onAddTask 
}: TasksContentProps) {
  const { t } = useLanguage();
  
  // For GanttChart, we'll adapt the response type
  const handleUpdateTaskForGantt = async (task: Task) => {
    const result = await onUpdateTask(task);
    return result;
  };
  
  return (
    <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="list" className="p-0 m-0">
          {tasks.length > 0 ? (
            <TaskList 
              tasks={tasks}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ) : (
            <div className="text-center p-12 text-muted-foreground">
              {t('noTasksFound')}
              <Button 
                variant="link" 
                onClick={onAddTask}
                className="ml-2"
              >
                {t('createYourFirstTask')}
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="kanban" className="p-0 m-0">
          <KanbanBoard 
            tasks={tasks}
            onUpdateTask={onUpdateTask}
          />
        </TabsContent>
        
        <TabsContent value="gantt" className="p-0 m-0">
          <GanttChart 
            tasks={tasks}
            onAddTask={onAddTask}
            onUpdateTask={handleUpdateTaskForGantt}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
