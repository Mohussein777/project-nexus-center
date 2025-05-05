
import { useState, useEffect } from 'react';
import { Employee } from '../types';
import { TimeTrackingWidget } from '../TimeTrackingWidget';
import { PersonalStats } from './PersonalStats';
import { PersonalTimeEntries } from './PersonalTimeEntries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PersonalAttendanceProps {
  currentUserEmployee: Employee | null;
}

export function PersonalAttendance({ currentUserEmployee }: PersonalAttendanceProps) {
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const loadTimeEntries = async () => {
    if (!currentUserEmployee) {
      console.log("No current user employee found");
      setLoading(false);
      return;
    }
    
    try {
      console.log("Fetching time entries for employee:", currentUserEmployee.id);
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', currentUserEmployee.id.toString())
        .order('date', { ascending: false });
        
      if (error) {
        console.error("Error fetching user time entries:", error);
        throw error;
      }
      
      console.log("Fetched time entries:", data);
      setTimeEntries(data || []);
    } catch (error) {
      console.error('Error fetching user time entries:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل سجل الدوام الشخصي",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load time entries when component mounts
  useEffect(() => {
    loadTimeEntries();
  }, [currentUserEmployee]);
  
  if (!currentUserEmployee) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>سجل الدوام الشخصي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p>لم يتم العثور على بيانات الموظف. الرجاء تسجيل الدخول للوصول إلى سجل الدوام الشخصي.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeTrackingWidget 
          employeeId={currentUserEmployee.id.toString()} 
          onTimeEntryUpdate={loadTimeEntries} 
        />
        
        <PersonalStats 
          timeEntries={timeEntries}
          employeeName={currentUserEmployee.name}
          loading={loading}
        />
      </div>
      
      <PersonalTimeEntries 
        timeEntries={timeEntries}
        loading={loading}
      />
    </div>
  );
}
