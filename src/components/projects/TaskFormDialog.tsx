
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from './TaskForm';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaskFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (taskData: any) => Promise<boolean>;
  task?: any;
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
  
  const handleSubmit = async (taskData: any) => {
    const success = await onSubmit(taskData);
    if (success) {
      onOpenChange(false);
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
