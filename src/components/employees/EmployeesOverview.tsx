
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Mail, Phone, Briefcase, Calendar, Clock, Timer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { getEmployees } from '@/services/employeeService';
import { Employee } from './types';

export function EmployeesOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل بيانات الموظفين",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [toast]);

  // تصفية الموظفين حسب البحث
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate department statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const onLeaveEmployees = employees.filter(emp => emp.status === 'On Leave').length;
  const remoteEmployees = totalEmployees - activeEmployees - onLeaveEmployees;
  const departmentsCount = [...new Set(employees.map(emp => emp.department))].length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">الموظفون</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="البحث عن موظف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm w-60 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-gray-800"
            />
          </div>
          
          <button className="inline-flex items-center space-x-1 px-3 py-2 border border-border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter size={16} />
            <span>تصفية</span>
          </button>
          
          <Button>
            <Plus size={16} className="mr-1" />
            <span>إضافة موظف</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="text-center sm:text-right">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300">ملخص الموظفين</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">الإجمالي: {totalEmployees} موظف في {departmentsCount} أقسام</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center px-3">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{activeEmployees}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">نشط</p>
          </div>
          <div className="text-center px-3 border-l border-blue-200 dark:border-blue-700">
            <p className="text-2xl font-bold text-orange-500 dark:text-orange-300">{onLeaveEmployees}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">في إجازة</p>
          </div>
          <div className="text-center px-3 border-l border-blue-200 dark:border-blue-700">
            <p className="text-2xl font-bold text-green-600 dark:text-green-300">{remoteEmployees}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">عن بعد</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => {
            // الحصول على حالة تسجيل الوقت للموظف
            const timeStatus = { isActive: false, currentEntry: null }; // Default value
            
            return (
              <div 
                key={employee.id} 
                className="glass-card dark:glass-card-dark rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/employees/${employee.id}`)}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${employee.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {employee.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                      <div className="mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          employee.status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                          {employee.status === 'Active' ? 'نشط' : 'في إجازة'}
                        </span>
                        <span className="mr-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full px-2 py-0.5">
                          {employee.department}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail size={14} className="ml-2 text-muted-foreground" />
                      <a href={`mailto:${employee.email}`} className="text-primary hover:underline">{employee.email}</a>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone size={14} className="ml-2 text-muted-foreground" />
                      <span>{employee.phone || 'غير متوفر'}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar size={14} className="ml-2 text-muted-foreground" />
                      <span>تاريخ التعيين: {employee.joinDate}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      {timeStatus.isActive ? (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <Timer size={14} className="ml-2 animate-pulse" />
                          <span>يعمل حاليًا</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-muted-foreground">
                          <Clock size={14} className="ml-2" />
                          <span>غير نشط حاليًا</span>
                        </div>
                      )}
                    </div>
                    {employee.projects > 0 && (
                      <div className="flex items-center text-sm">
                        <Briefcase size={14} className="ml-2 text-muted-foreground" />
                        <span>{employee.projects} مشروع نشط</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-border flex divide-x divide-border">
                  <Link to={`/employees/${employee.id}`} className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    الملف الشخصي
                  </Link>
                  <Link to={`/employees/${employee.id}?tab=time`} className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    سجل الوقت
                  </Link>
                  <Link to={`/employees/${employee.id}?tab=projects`} className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    المهام
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          لا يوجد موظفين مطابقين لمعايير البحث
        </div>
      )}
    </div>
  );
}
