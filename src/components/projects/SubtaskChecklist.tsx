
import { useState, useEffect } from 'react';
import { 
  Check, 
  Trash, 
  PlusCircle, 
  XCircle
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from '@/contexts/LanguageContext';
import { createSubtask, getSubtasks, updateSubtask, deleteSubtask } from '@/services/subtaskService';

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt?: string;
}

interface SubtaskChecklistProps {
  taskId: string;
}

export function SubtaskChecklist({ taskId }: SubtaskChecklistProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useLanguage();

  // Fetch subtasks on component mount
  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        setIsLoading(true);
        const data = await getSubtasks(taskId);
        setSubtasks(data);
      } catch (error) {
        console.error('Error fetching subtasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubtasks();
  }, [taskId]);

  // Add a new subtask
  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;
    
    try {
      const newSubtask = await createSubtask({
        taskId,
        title: newSubtaskTitle,
        completed: false
      });
      
      if (newSubtask) {
        setSubtasks([...subtasks, newSubtask]);
        setNewSubtaskTitle('');
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  // Toggle subtask completion status
  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    try {
      const success = await updateSubtask(subtaskId, { completed });
      
      if (success) {
        setSubtasks(subtasks.map(subtask => 
          subtask.id === subtaskId 
            ? { ...subtask, completed } 
            : subtask
        ));
      }
    } catch (error) {
      console.error('Error updating subtask:', error);
    }
  };

  // Delete a subtask
  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      const success = await deleteSubtask(subtaskId);
      
      if (success) {
        setSubtasks(subtasks.filter(subtask => subtask.id !== subtaskId));
      }
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-spin h-5 w-5 border-t-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{t('subtasks')}</h4>
        {!isAdding && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs"
            onClick={() => setIsAdding(true)}
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            {t('addSubtask')}
          </Button>
        )}
      </div>
      
      {subtasks.length === 0 && !isAdding && (
        <div className="text-sm text-muted-foreground py-2 text-center">
          {t('noSubtasksYet')}
        </div>
      )}
      
      {isAdding && (
        <div className="flex items-center gap-2">
          <Input
            placeholder={t('enterSubtaskTitle')}
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            className="text-sm h-8"
            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
          />
          <Button 
            size="sm" 
            className="h-8 px-2"
            onClick={handleAddSubtask}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2"
            onClick={() => setIsAdding(false)}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <ul className="space-y-2">
        {subtasks.map((subtask) => (
          <li key={subtask.id} className="flex items-center gap-2 group">
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={(checked) => 
                handleToggleSubtask(subtask.id, checked === true)
              }
              id={`subtask-${subtask.id}`}
            />
            <label
              htmlFor={`subtask-${subtask.id}`}
              className={`flex-1 text-sm ${
                subtask.completed ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {subtask.title}
            </label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDeleteSubtask(subtask.id)}
            >
              <Trash className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
