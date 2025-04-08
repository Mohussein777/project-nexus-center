
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useProjectTasks } from '@/hooks/useProjectTasks';
import { ProjectHeader } from './ProjectHeader';
import { TasksTabsControl } from './TasksTabsControl';
import { TasksContent } from './TasksContent';
import { TaskFormDialog } from './TaskFormDialog';
import { useLanguage } from '@/contexts/LanguageContext';

export function ProjectTasksOverview() {
  const [activeTab, setActiveTab] = useState("list");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { t } = useLanguage();
  
  const {
    tasks,
    project,
    loading,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask
  } = useProjectTasks();
  
  if (loading || !project) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  const handleAddTask = () => {
    setSelectedTask(null);
    setIsDialogOpen(true);
  };
  
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };
  
  const handleTaskSubmit = (taskData) => {
    if (selectedTask) {
      return handleUpdateTask({
        ...selectedTask,
        ...taskData
      });
    } else {
      return handleCreateTask(taskData);
    }
  };
  
  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      
      <TasksTabsControl 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddTask={handleAddTask}
      />
      
      <TasksContent 
        activeTab={activeTab}
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onAddTask={handleAddTask}
      />
      
      <TaskFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleTaskSubmit}
        task={selectedTask}
        isEditing={!!selectedTask}
      />
    </div>
  );
}
