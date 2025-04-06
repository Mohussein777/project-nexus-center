
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmployeesOverview } from '../components/employees/EmployeesOverview';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CalendarClock, UserPlus } from 'lucide-react';
import { EmployeeFormDialog } from '../components/employees/EmployeeFormDialog';
import { Employee } from '../components/employees/types';
import { useToast } from '@/hooks/use-toast';

const Employees = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleEmployeeAdded = (employee: Employee) => {
    toast({
      title: "تم بنجاح",
      description: `تمت إضافة الموظف ${employee.name} بنجاح`,
    });
    // This will automatically update the EmployeesOverview component
    // since we'll refetch employees when the dialog closes
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/employees/attendance">
              <CalendarClock size={16} className="mr-2" />
              إدارة الحضور والانصراف
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setIsFormOpen(true)}>
            <UserPlus size={16} className="mr-2" />
            إضافة موظف جديد
          </Button>
        </div>
      </div>
      <EmployeesOverview />
      
      <EmployeeFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onEmployeeAdded={handleEmployeeAdded}
      />
    </MainLayout>
  );
};

export default Employees;
