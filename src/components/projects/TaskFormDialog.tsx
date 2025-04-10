
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from './TaskForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Task } from "@/services/tasks/types";

interface TaskFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (taskData: Task) => Promise<any>;
  task?: Task | null;
  isEditing?: boolean;
}

export function TaskFormDialog({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  task, 
  isEditing = false 
}: TaskFormDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (taskData: any) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting task data:", taskData);
      const result = await onSubmit(taskData);
      
      if (result) {
        toast({
          title: isEditing ? t('taskUpdated') : t('taskCreated'),
          description: isEditing 
            ? t('taskUpdatedSuccessfully') 
            : t('taskCreatedSuccessfully'),
        });
        onOpenChange(false);
      } else {
        throw new Error(t('failedToSaveTask'));
      }
    } catch (error) {
      console.error("Error saving task:", error);
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('errorSavingTask'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('editTask') : t('addNewTask')}
          </DialogTitle>
          {!isEditing && (
            <DialogDescription>
              {t('addNewTaskDescription')}
            </DialogDescription>
          )}
        </DialogHeader>
        <TaskForm 
          task={task} 
          onSubmit={handleSubmit} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
