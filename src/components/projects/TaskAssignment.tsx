
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployeesList } from '@/hooks/useEmployeesList';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaskAssignmentProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function TaskAssignment({ value, onChange }: TaskAssignmentProps) {
  const { employees, loading } = useEmployeesList();
  const { t } = useLanguage();
  
  if (loading) {
    return (
      <div className="space-y-2">
        <Label>{t('assignTo')}</Label>
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <Label>{t('assignTo')}</Label>
      <Select 
        value={value || undefined} 
        onValueChange={(val) => onChange(val === "" ? null : val)}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('selectEmployee')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unassigned">
            {t('unassigned')}
          </SelectItem>
          {employees.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
