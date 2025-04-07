
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Client {
  id: number;
  name: string;
}

const formSchema = z.object({
  name: z.string().min(1, "اسم المشروع مطلوب"),
  project_number: z.string().min(1, "رقم المشروع مطلوب"),
  description: z.string().optional(),
  client_id: z.coerce.number().min(1, "يرجى اختيار عميل"),
  status: z.string().min(1, "حالة المشروع مطلوبة"),
  start_date: z.date({
    required_error: "تاريخ البدء مطلوب",
  }),
  end_date: z.date().optional(),
  budget: z.coerce.number().nonnegative().optional(),
  priority: z.string().default("Medium"),
  tag: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<FormValues>;
}

export function ProjectForm({ onSubmit, onCancel, initialData }: ProjectFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextProjectNumber, setNextProjectNumber] = useState("");
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      project_number: initialData?.project_number || "",
      description: initialData?.description || "",
      client_id: initialData?.client_id || undefined,
      status: initialData?.status || "planning",
      start_date: initialData?.start_date || new Date(),
      end_date: initialData?.end_date,
      budget: initialData?.budget || undefined,
      priority: initialData?.priority || "Medium",
      tag: initialData?.tag || "",
    },
  });
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, name')
          .order('name');
          
        if (error) {
          throw error;
        }
        
        setClients(data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: t('error'),
          description: t('errorLoadingClients'),
          variant: "destructive",
        });
      }
    };
    
    fetchClients();
  }, [toast, t]);
  
  useEffect(() => {
    const generateNextProjectNumber = async () => {
      // Only generate number for new projects, not when editing
      if (initialData?.project_number) {
        return;
      }

      try {
        // Fetch the latest project number from the database
        const { data, error } = await supabase
          .from('projects')
          .select('project_number')
          .not('project_number', 'is', null)
          .order('project_number', { ascending: false })
          .limit(1);
        
        if (error) {
          throw error;
        }
        
        let nextNumber = 1000; // Start with 1000 if no projects exist
        
        if (data && data.length > 0 && data[0].project_number) {
          // Parse the last project number and increment by 1
          const lastNumber = parseInt(data[0].project_number);
          nextNumber = isNaN(lastNumber) ? 1000 : lastNumber + 1;
        }
        
        setNextProjectNumber(nextNumber.toString());
        form.setValue('project_number', nextNumber.toString());
      } catch (error) {
        console.error('Error generating project number:', error);
        toast({
          title: t('error'),
          description: t('errorGeneratingProjectNumber'),
          variant: "destructive",
        });
      }
    };
    
    generateNextProjectNumber();
  }, [form, initialData, toast, t]);
  
  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('projectName')}</FormLabel>
                <FormControl>
                  <Input placeholder={language === 'ar' ? "أدخل اسم المشروع" : "Enter project name"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="project_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('projectNumber')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={language === 'ar' ? "أدخل رقم المشروع" : "Enter project number"} 
                    {...field} 
                    readOnly={!initialData?.project_number}
                    className={!initialData?.project_number ? "bg-gray-100" : ""}
                  />
                </FormControl>
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
              <FormLabel>{t('projectDescription')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={language === 'ar' ? "أدخل وصف المشروع" : "Enter project description"} 
                  className="h-20" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('client')}</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectClient')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
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
                <FormLabel>{t('status')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectStatus')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planning">{t('planning')}</SelectItem>
                    <SelectItem value="on_track">{t('onTrack')}</SelectItem>
                    <SelectItem value="at_risk">{t('atRisk')}</SelectItem>
                    <SelectItem value="delayed">{t('delayed')}</SelectItem>
                    <SelectItem value="on_hold">{t('onHold')}</SelectItem>
                    <SelectItem value="completed">{t('completed')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('startDate')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t('selectDate')}</span>
                        )}
                        <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('endDate')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t('selectDate')}</span>
                        )}
                        <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('budget')}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={language === 'ar' ? "أدخل الميزانية" : "Enter budget"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('priority')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectPriority')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">{t('low')}</SelectItem>
                    <SelectItem value="Medium">{t('medium')}</SelectItem>
                    <SelectItem value="High">{t('high')}</SelectItem>
                    <SelectItem value="Urgent">{t('urgent')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('projectType')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectProjectType')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Development">{t('development')}</SelectItem>
                    <SelectItem value="Design">{t('design')}</SelectItem>
                    <SelectItem value="Marketing">{t('marketing')}</SelectItem>
                    <SelectItem value="Research">{t('research')}</SelectItem>
                    <SelectItem value="Consulting">{t('consulting')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? t('saving') : initialData ? t('updateProject') : t('createProject')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
