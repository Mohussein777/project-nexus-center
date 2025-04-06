
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Edit, Save, X } from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ProjectFinancialSummary, 
  getProjectFinancialSummaries,
  saveProjectFinancials
} from '@/services/financialTransactionService';
import { formatCurrency } from '@/lib/utils';

const projectFinancialFormSchema = z.object({
  total_deal: z.string().optional(),
  total_payment: z.string().optional(),
  deserved_amount: z.string().optional(),
  balance_client: z.string().optional(),
  project_progress: z.string().refine(
    val => val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100),
    { message: 'نسبة التقدم يجب أن تكون بين 0 و 100' }
  ).optional(),
  notes: z.string().optional()
});

type ProjectFinancialFormValues = z.infer<typeof projectFinancialFormSchema>;

export function ProjectFinancials() {
  const [projects, setProjects] = useState<ProjectFinancialSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ProjectFinancialFormValues>({
    resolver: zodResolver(projectFinancialFormSchema),
    defaultValues: {}
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjectFinancialSummaries();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching project financials:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات المشاريع المالية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [toast]);

  const handleEditClick = (project: ProjectFinancialSummary) => {
    setEditingProjectId(project.project_id);
    form.reset({
      total_deal: project.total_deal.toString(),
      total_payment: project.total_payment.toString(),
      deserved_amount: project.deserved_amount.toString(),
      balance_client: project.balance_client.toString(),
      project_progress: project.project_progress.toString(),
      notes: '' // We don't have notes in the summary
    });
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    form.reset();
  };

  const handleSave = async (projectId: number) => {
    try {
      setSubmitting(true);
      const values = form.getValues();
      
      const financialData = {
        total_deal: values.total_deal ? parseFloat(values.total_deal) : undefined,
        total_payment: values.total_payment ? parseFloat(values.total_payment) : undefined,
        deserved_amount: values.deserved_amount ? parseFloat(values.deserved_amount) : undefined,
        balance_client: values.balance_client ? parseFloat(values.balance_client) : undefined,
        project_progress: values.project_progress ? parseFloat(values.project_progress) : undefined,
        notes: values.notes
      };
      
      await saveProjectFinancials(projectId, financialData);
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث البيانات المالية للمشروع بنجاح",
      });
      
      setEditingProjectId(null);
      form.reset();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project financials:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ البيانات المالية للمشروع",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">البيانات المالية للمشاريع</h3>
      
      <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المشروع</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead className="text-left">القيمة الكلية</TableHead>
                <TableHead className="text-left">المدفوع</TableHead>
                <TableHead className="text-left">المستحق</TableHead>
                <TableHead className="text-left">المتبقي للعميل</TableHead>
                <TableHead>تقدم المشروع</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    جاري تحميل البيانات...
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    لا توجد مشاريع بعد
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.project_id}>
                    {editingProjectId === project.project_id ? (
                      <TableCell colSpan={8}>
                        <Form {...form}>
                          <form 
                            onSubmit={form.handleSubmit(() => handleSave(project.project_id))} 
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">المشروع: {project.project_name}</p>
                                <p className="text-sm text-muted-foreground">العميل: {project.client_name}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="project_progress"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>نسبة التقدم (%)</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="0" max="100" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4">
                              <FormField
                                control={form.control}
                                name="total_deal"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>القيمة الكلية</FormLabel>
                                    <FormControl>
                                      <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="total_payment"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>المدفوع</FormLabel>
                                    <FormControl>
                                      <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="deserved_amount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>المستحق</FormLabel>
                                    <FormControl>
                                      <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="balance_client"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>المتبقي للعميل</FormLabel>
                                    <FormControl>
                                      <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ملاحظات</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} rows={2} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end space-x-2">
                              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                <X size={16} className="mr-2" />
                                إلغاء
                              </Button>
                              <Button type="submit" disabled={submitting}>
                                <Save size={16} className="mr-2" />
                                {submitting ? 'جاري الحفظ...' : 'حفظ'}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </TableCell>
                    ) : (
                      <>
                        <TableCell>{project.project_name}</TableCell>
                        <TableCell>{project.client_name}</TableCell>
                        <TableCell className="text-left">{formatCurrency(project.total_deal)}</TableCell>
                        <TableCell className="text-left">{formatCurrency(project.total_payment)}</TableCell>
                        <TableCell className="text-left">{formatCurrency(project.deserved_amount)}</TableCell>
                        <TableCell className="text-left">{formatCurrency(project.balance_client)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={project.project_progress} className="h-2" />
                            <span className="text-xs">{project.project_progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(project)}>
                            <Edit size={16} />
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
