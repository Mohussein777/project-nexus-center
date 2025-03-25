
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { CalendarIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const taskSchema = z.object({
  name: z.string().min(2, {
    message: 'يجب أن يحتوي اسم المهمة على حرفين على الأقل',
  }),
  description: z.string().optional(),
  assignee: z.string().min(2, {
    message: 'يرجى تحديد الشخص المسؤول عن المهمة',
  }),
  startDate: z.date({
    required_error: 'يرجى تحديد تاريخ البدء',
  }),
  endDate: z.date({
    required_error: 'يرجى تحديد تاريخ الانتهاء',
  }),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent'], {
    required_error: 'يرجى تحديد الأولوية',
  }),
  status: z.enum(['Not Started', 'In Progress', 'Review', 'At Risk', 'Completed'], {
    required_error: 'يرجى تحديد الحالة',
  }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const defaultValues: Partial<TaskFormValues> = {
    name: task?.name || '',
    description: task?.description || '',
    assignee: task?.assignee || '',
    startDate: task?.startDate ? new Date(task.startDate) : new Date(),
    endDate: task?.endDate ? new Date(task.endDate) : new Date(),
    priority: task?.priority || 'Medium',
    status: task?.status || 'Not Started',
  };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  function onFormSubmit(values: TaskFormValues) {
    onSubmit({
      ...task,
      ...values,
      startDate: format(values.startDate, 'yyyy-MM-dd'),
      endDate: format(values.endDate, 'yyyy-MM-dd'),
      progress: task?.progress || 0,
      dependencies: task?.dependencies || [],
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المهمة</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسم المهمة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المسؤول</FormLabel>
                <FormControl>
                  <Input placeholder="اسم المسؤول عن المهمة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>تاريخ البدء</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={
                          "w-full justify-start text-left font-normal"
                        }
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ar })
                        ) : (
                          <span>اختر تاريخ البدء</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>تاريخ الانتهاء</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={
                          "w-full justify-start text-left font-normal"
                        }
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ar })
                        ) : (
                          <span>اختر تاريخ الانتهاء</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الأولوية</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">منخفضة</SelectItem>
                    <SelectItem value="Medium">متوسطة</SelectItem>
                    <SelectItem value="High">عالية</SelectItem>
                    <SelectItem value="Urgent">عاجلة</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الحالة</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Not Started">لم تبدأ</SelectItem>
                    <SelectItem value="In Progress">قيد التنفيذ</SelectItem>
                    <SelectItem value="Review">في المراجعة</SelectItem>
                    <SelectItem value="At Risk">متأخرة</SelectItem>
                    <SelectItem value="Completed">مكتملة</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="وصف تفصيلي للمهمة"
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            إلغاء
          </Button>
          <Button type="submit">
            {task ? 'تحديث المهمة' : 'إنشاء المهمة'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
