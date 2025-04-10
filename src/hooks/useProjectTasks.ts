
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProjectById } from '@/services/projectService';
import { getTasks, createTask, updateTask, deleteTask, Task } from '@/services/tasks';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export function useProjectTasks() {
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
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
      console.log("Creating task with data:", taskData);
      const newTask = await createTask({
        ...taskData,
        project_id: projectId
      });
      
      if (newTask) {
        setTasks(prevTasks => [...prevTasks, newTask]);
        toast({
          title: t('success'),
          description: t('taskCreatedSuccessfully'),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: t('error'),
        description: t('errorCreatingTask'),
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleUpdateTask = async (updatedTask) => {
    try {
      // Ensure the task ID is valid
      if (!updatedTask.id) {
        console.error('Cannot update task: Missing task ID');
        toast({
          title: t('error'),
          description: t('errorUpdatingTask') + ': Missing task ID',
          variant: "destructive",
        });
        return false;
      }

      console.log(`Updating task with ID: ${updatedTask.id}`, updatedTask);
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
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: t('error'),
        description: t('errorUpdatingTask'),
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    try {
      if (!taskId) {
        console.error('Cannot delete task: Missing task ID');
        return false;
      }

      const success = await deleteTask(taskId);
      
      if (success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        toast({
          title: t('success'),
          description: t('taskDeletedSuccessfully'),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: t('error'),
        description: t('errorDeletingTask'),
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    tasks,
    project,
    loading,
    projectId,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask
  };
}
