
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { createInteraction } from '@/services/clients/interactionsService';
import { useToast } from '@/hooks/use-toast';
import { Interaction } from './types';

const formSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  summary: z.string().min(1, 'Summary is required'),
  employee: z.string().min(1, 'Employee is required'),
  followup_date: z.string().optional(),
  sentiment: z.string().optional(),
});

interface InteractionFormProps {
  clientId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function InteractionForm({ clientId, onSuccess, onCancel }: InteractionFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      summary: '',
      employee: '',
      followup_date: '',
      sentiment: '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Create the interaction with required fields
      const interactionData: Omit<Interaction, 'id'> = {
        clientId: clientId,
        date: new Date().toISOString(),
        type: values.type as "Meeting" | "Call" | "Email" | "Note",
        summary: values.summary,
        employee: values.employee,
        sentiment: values.sentiment as "Positive" | "Neutral" | "Negative" | undefined,
        followupDate: values.followup_date
      };
      
      await createInteraction(clientId, interactionData);
      toast({
        title: t('success'),
        description: t('interactionAddedSuccessfully'),
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating interaction:', error);
      toast({
        title: t('error'),
        description: t('errorCreatingInteraction'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('interactionType')}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectType')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Meeting">{t('meeting')}</SelectItem>
                  <SelectItem value="Call">{t('call')}</SelectItem>
                  <SelectItem value="Email">{t('email')}</SelectItem>
                  <SelectItem value="Note">{t('note')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('summary')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('enterSummary')}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="employee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('employee')}</FormLabel>
              <FormControl>
                <Input placeholder={t('enterEmployeeName')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="followup_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('followupDate')}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sentiment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('sentiment')}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectSentiment')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Positive">{t('positive')}</SelectItem>
                  <SelectItem value="Neutral">{t('neutral')}</SelectItem>
                  <SelectItem value="Negative">{t('negative')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('saving') : t('save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
