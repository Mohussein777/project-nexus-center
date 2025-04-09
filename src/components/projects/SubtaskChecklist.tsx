import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createSubtask, getSubtasks, updateSubtask, deleteSubtask } from "@/services/subtaskService";
import { useLanguage } from '@/contexts/LanguageContext';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface SubtaskChecklistProps {
  taskId: string;
}

export function SubtaskChecklist({ taskId }: SubtaskChecklistProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const fetchedSubtasks = await getSubtasks(taskId);
        setSubtasks(fetchedSubtasks);
      } catch (error) {
        console.error("Error fetching subtasks:", error);
        toast({
          title: t('error'),
          description: t('errorFetchingSubtasks'),
          variant: "destructive",
        });
      }
    };

    if (taskId) {
      fetchSubtasks();
    }
  }, [taskId, t, toast]);

  const handleCreateSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;

    try {
      const newSubtask = await createSubtask(taskId, newSubtaskTitle);
      if (newSubtask) {
        setSubtasks([...subtasks, {
          id: newSubtask.id,
          title: newSubtask.title,
          completed: newSubtask.completed,
        }]);
        setNewSubtaskTitle('');
        toast({
          title: t('success'),
          description: t('subtaskCreatedSuccessfully'),
        });
      } else {
        throw new Error(t('failedToCreateSubtask'));
      }
    } catch (error) {
      console.error("Error creating subtask:", error);
      toast({
        title: t('error'),
        description: t('errorCreatingSubtask'),
        variant: "destructive",
      });
    }
  };

  const handleUpdateSubtask = async (subtaskId: string, updates: { title?: string; completed?: boolean }) => {
    try {
      const success = await updateSubtask(subtaskId, updates);
      if (success) {
        setSubtasks(subtasks.map(subtask =>
          subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
        ));
        toast({
          title: t('success'),
          description: t('subtaskUpdatedSuccessfully'),
        });
      } else {
        throw new Error(t('failedToUpdateSubtask'));
      }
    } catch (error) {
      console.error("Error updating subtask:", error);
      toast({
        title: t('error'),
        description: t('errorUpdatingSubtask'),
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      await deleteSubtask(subtaskId, taskId);
      setSubtasks(subtasks.filter(subtask => subtask.id !== subtaskId));
      toast({
        title: t('success'),
        description: t('subtaskDeletedSuccessfully'),
      });
    } catch (error) {
      console.error("Error deleting subtask:", error);
      toast({
        title: t('error'),
        description: t('errorDeletingSubtask'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">{t('subtasks')}</h4>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder={t('addSubtask')}
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
        />
        <Button size="sm" onClick={handleCreateSubtask}>
          {t('create')}
        </Button>
      </div>
      <ul className="space-y-2">
        {subtasks.map((subtask) => (
          <li key={subtask.id} className="flex items-center space-x-2">
            <Checkbox
              id={`subtask-${subtask.id}`}
              checked={subtask.completed}
              onCheckedChange={(checked) => handleUpdateSubtask(subtask.id, { completed: checked === true })}
            />
            <label
              htmlFor={`subtask-${subtask.id}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed flex-1"
            >
              {subtask.title}
            </label>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteSubtask(subtask.id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trash-2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
