
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createEmployee } from '@/services/employeeService';
import { useToast } from '@/hooks/use-toast';
import { Employee } from './types';

const employeeFormSchema = z.object({
  name: z.string().min(2, { message: 'الاسم مطلوب' }),
  position: z.string().min(2, { message: 'المنصب مطلوب' }),
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
  phone: z.string().optional(),
  department: z.string().min(2, { message: 'القسم مطلوب' }),
  joinDate: z.string().min(2, { message: 'تاريخ التعيين مطلوب' }),
  status: z.enum(['Active', 'On Leave', 'Inactive']),
  employeeId: z.string().optional(),
  manager: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeAdded?: (employee: Employee) => void;
}

export function EmployeeFormDialog({ open, onOpenChange, onEmployeeAdded }: EmployeeFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: '',
      position: '',
      email: '',
      phone: '',
      department: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      employeeId: '',
      manager: '',
      skills: [],
    },
  });

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Fix the type issue by ensuring all required fields are present
      const newEmployee = await createEmployee({
        name: values.name,
        position: values.position,
        email: values.email,
        phone: values.phone || '',
        department: values.department,
        join_date: values.joinDate,
        status: values.status,
        employee_id: values.employeeId || '',
        manager: values.manager || '',
        skills: values.skills || [],
      });
      
      toast({
        title: "تم بنجاح",
        description: "تمت إضافة الموظف بنجاح",
      });
      
      form.reset();
      onOpenChange(false);
      
      if (onEmployeeAdded) {
        onEmployeeAdded(newEmployee);
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: "حدث خطأ",
        description: "فشل في إضافة الموظف. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>إضافة موظف جديد</DialogTitle>
          <DialogDescription>
            أدخل معلومات الموظف الجديد. انقر على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input placeholder="ادخل اسم الموظف" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المنصب</FormLabel>
                    <FormControl>
                      <Input placeholder="ادخل منصب الموظف" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="example@company.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input placeholder="ادخل رقم الهاتف" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>القسم</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر القسم" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="الهندسة المعمارية">الهندسة المعمارية</SelectItem>
                        <SelectItem value="الهندسة">الهندسة</SelectItem>
                        <SelectItem value="المالية">المالية</SelectItem>
                        <SelectItem value="إدارة المشاريع">إدارة المشاريع</SelectItem>
                        <SelectItem value="الموارد البشرية">الموارد البشرية</SelectItem>
                        <SelectItem value="التسويق">التسويق</SelectItem>
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
                        <SelectItem value="Active">نشط</SelectItem>
                        <SelectItem value="On Leave">في إجازة</SelectItem>
                        <SelectItem value="Inactive">غير نشط</SelectItem>
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
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ التعيين</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الموظف</FormLabel>
                    <FormControl>
                      <Input placeholder="EMP-XXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المدير المباشر</FormLabel>
                  <FormControl>
                    <Input placeholder="ادخل اسم المدير المباشر" {...field} />
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
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ الموظف'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
