import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ArrowLeft, CheckSquare, AlignCenter, Clock, BarChart } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { KanbanBoard } from './KanbanBoard';
import { GanttChart } from './GanttChart';
import { getProjectById } from '@/services/projectService';
import { getTasks, createTask, updateTask, deleteTask } from '@/services/taskService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export function ProjectTasksOverview() {
  const [activeTab, setActiveTab] = useState("list");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const projectId = parseInt(location.pathname.split('/projects/')[1]?.split('/')[0]);
  
  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      if (!projectId || isNaN(projectId)) {
        navigate('/projects');
        return;
      }
      
      setLoading(true);
      try {
        const projectData = await getProjectById(projectId);
        if (!projectData) {
          throw new Error('Project not found');
        }
        
        setProject(projectData);
        
        const tasksData = await getTasks(projectId);
        setTasks(tasksData || []);
      } catch (error) {
        console.error('Error fetching project data:', error);
        toast({
          title: t('error'),
          description: t('errorLoadingProjectData'),
          variant: "destructive",
        });
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectAndTasks();
  }, [projectId, navigate, toast, t]);
  
  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await createTask({
        ...taskData,
        project_id: projectId
      });
      
      if (newTask) {
        setTasks(prevTasks => [...prevTasks, newTask]);
        setIsDialogOpen(false);
        toast({
          title: t('success'),
          description: t('taskCreatedSuccessfully'),
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: t('error'),
        description: t('errorCreatingTask'),
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateTask = async (updatedTask) => {
    try {
      const success = await updateTask(updatedTask.id, updatedTask);
      
      if (success) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          )
        );
        toast({
          title: t('success'),
          description: t('taskUpdatedSuccessfully'),
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: t('error'),
        description: t('errorUpdatingTask'),
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    try {
      const success = await deleteTask(taskId);
      
      if (success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        toast({
          title: t('success'),
          description: t('taskDeletedSuccessfully'),
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: t('error'),
        description: t('errorDeletingTask'),
        variant: "destructive",
      });
    }
  };
  
  if (loading || !project) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
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
      
      <div className="flex items-center justify-between">
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('addTask')}
            </Button>
          </div>
        </Tabs>
      </div>
      
      <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="list" className="p-0 m-0">
            {tasks.length > 0 ? (
              <TaskList 
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            ) : (
              <div className="text-center p-12 text-muted-foreground">
                {t('noTasksFound')}
                <Button 
                  variant="link" 
                  onClick={() => setIsDialogOpen(true)}
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
              onUpdateTask={handleUpdateTask}
            />
          </TabsContent>
          
          <TabsContent value="gantt" className="p-0 m-0">
            <GanttChart 
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{t('addNewTask')}</DialogTitle>
            <DialogDescription>
              {t('addNewTaskDescription')}
            </DialogDescription>
          </DialogHeader>
          <TaskForm 
            onSubmit={handleCreateTask} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
