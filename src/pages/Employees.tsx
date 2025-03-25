
import { Link } from 'react-router-dom';
import { EmployeesOverview } from '../components/employees/EmployeesOverview';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CalendarClock, UserPlus } from 'lucide-react';

const Employees = () => {
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
          <Button variant="outline">
            <UserPlus size={16} className="mr-2" />
            إضافة موظف جديد
          </Button>
        </div>
      </div>
      <EmployeesOverview />
    </MainLayout>
  );
};

export default Employees;
