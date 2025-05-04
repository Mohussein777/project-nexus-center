
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeTrackingWidget } from '../TimeTrackingWidget';
import { PersonalStats } from './PersonalStats';
import { PersonalTimeEntries } from './PersonalTimeEntries';
import { Employee, TimeEntry } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { mapTimeEntry } from './attendanceUtils';
import { useToast } from "@/hooks/use-toast";

interface PersonalAttendanceProps {
  currentUserEmployee: Employee | null;
}

export function PersonalAttendance({ currentUserEmployee }: PersonalAttendanceProps) {
  const [currentUserTimeEntries, setCurrentUserTimeEntries] = useState<TimeEntry[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!currentUserEmployee) return;
    
    const fetchUserTimeEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('time_entries')
          .select('*')
          .eq('employee_id', currentUserEmployee.id.toString())
          .order('date', { ascending: false })
          .order('start_time', { ascending: false })
          .limit(20);
          
        if (error) throw error;
        
        // Convert the Supabase data to our TimeEntry type
        const timeEntriesData = data.map(mapTimeEntry);
        
        setCurrentUserTimeEntries(timeEntriesData);
      } catch (error) {
        console.error('Error fetching user time entries:', error);
      }
    };
    
    fetchUserTimeEntries();
  }, [currentUserEmployee]);

  const handleTimeEntryUpdate = async () => {
    if (!currentUserEmployee) return;
    
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', currentUserEmployee.id.toString())
        .order('date', { ascending: false })
        .order('start_time', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      // Convert the Supabase data to our TimeEntry type
      const timeEntriesData = data.map(mapTimeEntry);
      
      setCurrentUserTimeEntries(timeEntriesData);
    } catch (error) {
      console.error('Error refreshing time entries data:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث بيانات الحضور",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        {currentUserEmployee ? (
          <TimeTrackingWidget 
            employeeId={currentUserEmployee.id.toString()} 
            onTimeEntryUpdate={handleTimeEntryUpdate}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>تسجيل الوقت</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8 text-muted-foreground">
              لم نتمكن من العثور على معلومات الموظف الخاصة بك
            </CardContent>
          </Card>
        )}
        
        <PersonalStats />
      </div>
      
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>سجل الحضور الشخصي</CardTitle>
            <CardDescription>آخر 20 تسجيل للحضور</CardDescription>
          </CardHeader>
          <CardContent>
            <PersonalTimeEntries timeEntries={currentUserTimeEntries} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
