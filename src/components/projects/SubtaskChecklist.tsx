
import { useState, useEffect } from 'react';
import { Check, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  getSubtasks, 
  createSubtask, 
  updateSubtask, 
  deleteSubtask,
  Subtask 
} from '@/services/subtaskService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface SubtaskChecklistProps {
  taskId: string;
}

export function SubtaskChecklist({ taskId }: SubtaskChecklistProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadSubtasks = async () => {
      if (!taskId) return;
      
      try {
        setIsLoading(true);
        const data = await getSubtasks(taskId);
        setSubtasks(data);
      } catch (error) {
        console.error('Error loading subtasks:', error);
        toast({
          title: t('error'),
          description: t('errorLoadingSubtasks'),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSubtasks();
  }, [taskId, toast, t]);
  
  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;
    
    try {
      const newSubtask = await createSubtask(taskId, newSubtaskTitle);
      if (newSubtask) {
        setSubtasks(prev => [...prev, newSubtask]);
        setNewSubtaskTitle('');
      }
    } catch (error) {
      console.error('Error adding subtask:', error);
      toast({
        title: t('error'),
        description: t('errorAddingSubtask'),
        variant: "destructive",
      });
    }
  };
  
  const handleToggleSubtask = async (subtask: Subtask) => {
    try {
      const success = await updateSubtask(subtask.id, { completed: !subtask.completed });
      if (success) {
        setSubtasks(prev => 
          prev.map(item => 
            item.id === subtask.id 
              ? { ...item, completed: !item.completed } 
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating subtask:', error);
      toast({
        title: t('error'),
        description: t('errorUpdatingSubtask'),
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteSubtask = async (id: string) => {
    try {
      const success = await deleteSubtask(id);
      if (success) {
        setSubtasks(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting subtask:', error);
      toast({
        title: t('error'),
        description: t('errorDeletingSubtask'),
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Label>{t('subtasks')}</Label>
        <div className="h-20 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Label>{t('subtasks')}</Label>
      
      <div className="space-y-2">
        {subtasks.map(subtask => (
          <div 
            key={subtask.id} 
            className="flex items-center gap-2 p-2 border rounded-md bg-background"
          >
            <Button 
              type="button"
              size="icon"
              variant={subtask.completed ? "default" : "outline"}
              className="h-6 w-6"
              onClick={() => handleToggleSubtask(subtask)}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">
                {subtask.completed ? t('markAsIncomplete') : t('markAsComplete')}
              </span>
            </Button>
            
            <span className={`flex-1 ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
              {subtask.title}
            </span>
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-destructive hover:text-destructive/90"
              onClick={() => handleDeleteSubtask(subtask.id)}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">{t('delete')}</span>
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder={t('newSubtask')}
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
        />
        <Button 
          type="button" 
          size="icon" 
          onClick={handleAddSubtask}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">{t('addSubtask')}</span>
        </Button>
      </div>
    </div>
  );
}
