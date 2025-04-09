
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams } from 'react-router-dom';
import { TaskFormFields } from './form-fields/TaskFormFields';
import { SubtaskChecklist } from "./SubtaskChecklist";

// Define proper props for the TaskForm component
interface TaskFormProps {
  task: any;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const { t } = useLanguage();
  const { projectId } = useParams();
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || null);
  
  const form = useForm({
    defaultValues: {
      name: task?.name || "",
      description: task?.description || "",
      startDate: task?.startDate ? new Date(task.startDate) : undefined,
      endDate: task?.endDate ? new Date(task.endDate) : undefined,
      status: task?.status || "Not Started",
      priority: task?.priority || "Medium",
    },
  });

  const onFormSubmit = async (values) => {
    try {
      console.log("Form submission values:", {
        ...values,
        assignee_id: assigneeId,
        project_id: Number(projectId),
      });
      
      await onSubmit({
        ...values,
        assignee_id: assigneeId,
        project_id: Number(projectId),
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <TaskFormFields 
          control={form.control}
          assigneeId={assigneeId}
          setAssigneeId={setAssigneeId}
        />
        
        {task?.id && <SubtaskChecklist taskId={task.id} />}
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button type="submit">
            {task ? t('updateTask') : t('createTask')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
