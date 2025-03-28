
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  ListChecks, 
  Layers, 
  FileText,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { KanbanBoard } from './KanbanBoard';
import { GanttChart } from './GanttChart';
import { getProjectById } from '@/services/projectService';
import { getTasks, createTask, updateTask, deleteTask } from '@/services/taskService';

type ViewMode = 'list' | 'kanban' | 'gantt';

export function ProjectTasksOverview() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      if (!projectId) return;
      
      try {
        const projectData = await getProjectById(Number(projectId));
        if (!projectData) {
          toast({
            title: "خطأ",
            description: "لم يتم العثور على المشروع",
            variant: "destructive",
          });
          navigate('/projects');
          return;
        }
        
        setProject(projectData);
        
        const tasksData = await getTasks(Number(projectId));
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching project data:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل بيانات المشروع",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectAndTasks();
  }, [projectId, navigate, toast]);
  
  const handleCreateTask = async (newTask) => {
    try {
      const taskData = {
        name: newTask.name,
        description: newTask.description,
        project_id: Number(projectId),
        assignee_id: newTask.assigneeId,
        start_date: newTask.startDate,
        end_date: newTask.endDate,
        status: newTask.status,
        priority: newTask.priority,
        progress: newTask.progress || 0
      };
      
      const createdTask = await createTask(taskData);
      if (createdTask) {
        setTasks([...tasks, createdTask]);
        setIsAddingTask(false);
        
        toast({
          title: "مهمة جديدة",
          description: "تم إنشاء المهمة بنجاح",
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء المهمة",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateTask = async (updatedTask) => {
    try {
      const success = await updateTask(updatedTask.id, {
        name: updatedTask.name,
        description: updatedTask.description,
        assignee_id: updatedTask.assigneeId,
        start_date: updatedTask.startDate,
        end_date: updatedTask.endDate,
        status: updatedTask.status,
        priority: updatedTask.priority,
        progress: updatedTask.progress
      });
      
      if (success) {
        setTasks(tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ));
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث المهمة بنجاح",
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث المهمة",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      const success = await updateTask(taskId, {
        status: newStatus
      });
      
      if (success) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        ));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة المهمة",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    try {
      const success = await deleteTask(taskId);
      
      if (success) {
        setTasks(tasks.filter(task => task.id !== taskId));
        
        toast({
          title: "تم الحذف",
          description: "تم حذف المهمة بنجاح",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف المهمة",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-bold mb-2">المشروع غير موجود</h2>
        <p className="text-muted-foreground mb-4">لم نتمكن من العثور على المشروع المطلوب</p>
        <Button onClick={() => navigate('/projects')}>العودة إلى المشاريع</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with project info */}
      <div className="glass-card dark:glass-card-dark rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/projects')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
            project.status === 'On Track' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            project.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
            project.status === 'Delayed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
            project.status === 'On Hold' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' :
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {project.status}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">الموعد النهائي</p>
              <p className="font-medium">{project.deadline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">فريق العمل</p>
              <p className="font-medium">{project.team} أعضاء</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">النوع</p>
              <p className="font-medium">{project.tag || 'غير محدد'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center"
              onClick={() => setViewMode('list')}
            >
              <ListChecks className="h-4 w-4 mr-2" />
              <span>قائمة</span>
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center"
              onClick={() => setViewMode('kanban')}
            >
              <Layers className="h-4 w-4 mr-2" />
              <span>كانبان</span>
            </Button>
            <Button
              variant={viewMode === 'gantt' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center"
              onClick={() => setViewMode('gantt')}
            >
              <Clock className="h-4 w-4 mr-2" />
              <span>مخطط جانت</span>
            </Button>
          </div>
          
          <Button onClick={() => setIsAddingTask(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            <span>إضافة مهمة</span>
          </Button>
        </div>
      </div>
      
      {/* Task Content Area */}
      <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
        {isAddingTask ? (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">إضافة مهمة جديدة</h2>
            <TaskForm 
              onSubmit={handleCreateTask} 
              onCancel={() => setIsAddingTask(false)} 
            />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground">
            لا توجد مهام لهذا المشروع بعد. أضف مهمة جديدة للبدء.
          </div>
        ) : (
          <>
            {viewMode === 'list' && (
              <TaskList 
                tasks={tasks} 
                onUpdateTask={handleUpdateTask} 
                onDeleteTask={handleDeleteTask} 
              />
            )}
            
            {viewMode === 'kanban' && (
              <KanbanBoard 
                tasks={tasks} 
                onUpdateTaskStatus={handleUpdateTaskStatus} 
                onUpdateTask={handleUpdateTask}
              />
            )}
            
            {viewMode === 'gantt' && (
              <GanttChart 
                tasks={tasks} 
                onUpdateTask={handleUpdateTask} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
