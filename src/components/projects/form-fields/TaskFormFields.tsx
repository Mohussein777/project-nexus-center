
import { useLanguage } from '@/contexts/LanguageContext';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerField } from './DatePickerField';
import { SelectField } from './SelectField';
import { TaskAssignment } from '../TaskAssignment';

interface TaskFormFieldsProps {
  control: any;
  assigneeId: string | null;
  setAssigneeId: (value: string | null) => void;
}

export function TaskFormFields({ control, assigneeId, setAssigneeId }: TaskFormFieldsProps) {
  const { t } = useLanguage();
  
  const statusOptions = [
    { value: "Not Started", label: t('notStarted') },
    { value: "In Progress", label: t('inProgress') },
    { value: "Review", label: t('review') },
    { value: "Completed", label: t('completed') },
    { value: "At Risk", label: t('atRisk') }
  ];
  
  const priorityOptions = [
    { value: "Low", label: t('low') },
    { value: "Medium", label: t('medium') },
    { value: "High", label: t('high') },
    { value: "Urgent", label: t('urgent') }
  ];
  
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('taskName')}</FormLabel>
              <FormControl>
                <Input placeholder={t('enterTaskName')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <TaskAssignment 
          value={assigneeId}
          onChange={setAssigneeId}
        />
        
        <SelectField
          control={control}
          name="status"
          label={t('status')}
          placeholder={t('selectStatus')}
          options={statusOptions}
        />
        
        <SelectField
          control={control}
          name="priority"
          label={t('priority')}
          placeholder={t('selectPriority')}
          options={priorityOptions}
        />
        
        <DatePickerField
          control={control}
          name="startDate"
          label={t('startDate')}
        />
        
        <DatePickerField
          control={control}
          name="endDate"
          label={t('endDate')}
        />
      </div>
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('description')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t('enterDescription')}
                className="min-h-32"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
