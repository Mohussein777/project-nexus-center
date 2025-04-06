
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { 
  FinancialTransaction, 
  addFinancialTransaction,
  updateFinancialTransaction,
  getAccountTypes,
  getSafes
} from '@/services/financialTransactionService';
import { getProjects } from '@/services/projectService';

const transactionFormSchema = z.object({
  date: z.string().min(1, { message: 'التاريخ مطلوب' }),
  project_id: z.string().optional(),
  account_type: z.string().min(1, { message: 'نوع الحساب مطلوب' }),
  safe: z.string().optional(),
  recipient: z.string().optional(),
  operation_type: z.enum(['PAYMENT', 'DEPOSIT'], { 
    required_error: 'نوع العملية مطلوب' 
  }),
  amount: z.string().min(1, { message: 'المبلغ مطلوب' }).refine(
    val => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: 'المبلغ يجب أن يكون رقمًا أكبر من صفر' }
  ),
  description: z.string().optional()
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdded: () => void;
  transaction?: FinancialTransaction;
}

export function TransactionFormDialog({ 
  open, 
  onOpenChange, 
  onTransactionAdded,
  transaction 
}: TransactionFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [accountTypes, setAccountTypes] = useState<{ id: string; name: string }[]>([]);
  const [safes, setSafes] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();

  const isEditMode = !!transaction;

  const defaultValues: TransactionFormValues = {
    date: transaction?.date || new Date().toISOString().split('T')[0],
    project_id: transaction?.project_id?.toString() || '',
    account_type: transaction?.account_type || '',
    safe: transaction?.safe || '',
    recipient: transaction?.recipient || '',
    operation_type: transaction?.operation_type || 'PAYMENT',
    amount: transaction 
      ? ((transaction.debit || transaction.credit || 0)).toString() 
      : '',
    description: transaction?.description || '',
  };

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues
  });

  // Load dependencies when the dialog opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [projectsData, accountTypesData, safesData] = await Promise.all([
            getProjects(),
            getAccountTypes(),
            getSafes()
          ]);
          
          setProjects(projectsData.map(p => ({ id: p.id, name: p.name })));
          setAccountTypes(accountTypesData);
          setSafes(safesData);
        } catch (error) {
          console.error('Error fetching form dependencies:', error);
          toast({
            title: "خطأ",
            description: "حدث خطأ أثناء تحميل البيانات",
            variant: "destructive",
          });
        }
      };
      
      fetchData();
    }
  }, [open, toast]);

  const onSubmit = async (values: TransactionFormValues) => {
    try {
      setIsSubmitting(true);
      
      const amount = parseFloat(values.amount);
      const isDebit = values.operation_type === 'PAYMENT';
      
      // Find project details if a project was selected
      let projectName = undefined;
      let projectNumber = undefined;
      let client = undefined;
      
      if (values.project_id) {
        const projectObj = projects.find(p => p.id.toString() === values.project_id);
        if (projectObj) {
          projectName = projectObj.name;
          // We would need to fetch more project details here ideally
        }
      }
      
      const transactionData = {
        date: values.date,
        project_id: values.project_id ? parseInt(values.project_id) : undefined,
        project_name: projectName,
        project_number: projectNumber,
        client: client,
        account_type: values.account_type,
        safe: values.safe || undefined,
        recipient: values.recipient || undefined,
        operation_type: values.operation_type,
        debit: isDebit ? amount : undefined,
        credit: !isDebit ? amount : undefined,
        description: values.description || undefined,
      };
      
      if (isEditMode && transaction) {
        await updateFinancialTransaction(transaction.id, transactionData);
        toast({
          title: "تم بنجاح",
          description: "تم تحديث المعاملة المالية بنجاح",
        });
      } else {
        await addFinancialTransaction(transactionData);
        toast({
          title: "تم بنجاح",
          description: "تمت إضافة المعاملة المالية بنجاح",
        });
      }
      
      form.reset();
      onOpenChange(false);
      onTransactionAdded();
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ المعاملة المالية",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'تعديل معاملة مالية' : 'إضافة معاملة مالية جديدة'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التاريخ</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="operation_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع العملية</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع العملية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PAYMENT">صرف</SelectItem>
                        <SelectItem value="DEPOSIT">إيداع</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="account_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الحساب</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الحساب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accountTypes.map(type => (
                          <SelectItem key={type.id} value={type.name}>
                            {type.name}
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المبلغ</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="أدخل المبلغ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المشروع (اختياري)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المشروع" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">عام - بدون مشروع</SelectItem>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
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
                name="safe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الخزينة (اختياري)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الخزينة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">لا يوجد</SelectItem>
                        {safes.map(safe => (
                          <SelectItem key={safe.id} value={safe.name}>
                            {safe.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المستلم/المصدر (اختياري)</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم المستلم أو مصدر الإيداع" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="أدخل أي ملاحظات إضافية" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'جاري الحفظ...' : isEditMode ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
