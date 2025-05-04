
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Stop, Clock, Timer } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { formatTimeSpent } from '@/services/employeeService';

interface TimeTrackingWidgetProps {
  employeeId: string;
  onTimeEntryUpdate: () => void;
}

export function TimeTrackingWidget({ employeeId, onTimeEntryUpdate }: TimeTrackingWidgetProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // تحميل حالة التتبع الحالية عند تحميل المكون
  useEffect(() => {
    const checkActiveTimeEntry = async () => {
      try {
        const { data, error } = await supabase
          .from('time_entries')
          .select('*')
          .eq('employee_id', employeeId)
          .eq('status', 'active')
          .order('start_time', { ascending: false })
          .limit(1);
          
        if (error) throw error;
          
        if (data && data.length > 0) {
          const entry = data[0];
          setCurrentEntry(entry);
          setIsTracking(true);
          
          // حساب الوقت المنقضي منذ بدء التتبع
          const startTime = new Date(entry.start_time).getTime();
          const now = new Date().getTime();
          setElapsedTime(Math.floor((now - startTime) / 1000));
        }
      } catch (error) {
        console.error('Error checking active time entry:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل بيانات التتبع الحالية",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkActiveTimeEntry();
  }, [employeeId, toast]);
  
  // تحديث الوقت المنقضي كل ثانية إذا كان التتبع نشطًا
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTracking) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTracking]);
  
  const handleStartTracking = async () => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('time_entries')
        .insert([{
          employee_id: employeeId,
          date: today,
          start_time: now.toISOString(),
          status: 'active',
        }])
        .select();
        
      if (error) throw error;
      
      setCurrentEntry(data[0]);
      setIsTracking(true);
      setElapsedTime(0);
      
      toast({
        title: "تم تسجيل الحضور",
        description: `بدأ تسجيل الوقت في ${now.toLocaleTimeString()}`,
      });
      
      onTimeEntryUpdate(); // تحديث بيانات الصفحة الرئيسية
      
    } catch (error) {
      console.error('Error starting time tracking:', error);
      toast({
        title: "خطأ",
        description: "فشل في بدء تتبع الوقت",
        variant: "destructive",
      });
    }
  };
  
  const handleStopTracking = async () => {
    if (!currentEntry) return;
    
    try {
      const now = new Date();
      const startTime = new Date(currentEntry.start_time).getTime();
      const endTime = now.getTime();
      const duration = Math.floor((endTime - startTime) / 1000); // بالثواني
      
      const { error } = await supabase
        .from('time_entries')
        .update({
          end_time: now.toISOString(),
          duration: duration,
          status: 'completed',
        })
        .eq('id', currentEntry.id);
        
      if (error) throw error;
      
      setIsTracking(false);
      setCurrentEntry(null);
      
      toast({
        title: "تم تسجيل الانصراف",
        description: `انتهى تسجيل الوقت. المدة: ${formatTimeSpent(duration)}`,
      });
      
      onTimeEntryUpdate(); // تحديث بيانات الصفحة الرئيسية
      
    } catch (error) {
      console.error('Error stopping time tracking:', error);
      toast({
        title: "خطأ",
        description: "فشل في إيقاف تتبع الوقت",
        variant: "destructive",
      });
    }
  };
  
  // تنسيق الوقت المنقضي للعرض (ساعات:دقائق:ثواني)
  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            تسجيل الوقت
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-32 mt-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          تسجيل الوقت
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-3xl font-bold font-mono">
            {formatElapsedTime(elapsedTime)}
          </div>
          
          <div>
            {isTracking ? (
              <Button 
                variant="destructive" 
                size="lg" 
                onClick={handleStopTracking}
                disabled={!isTracking}
              >
                <Stop className="mr-2 h-5 w-5" />
                تسجيل انصراف
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="lg" 
                onClick={handleStartTracking}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="mr-2 h-5 w-5" />
                تسجيل حضور
              </Button>
            )}
          </div>
          
          {isTracking && (
            <div className="text-sm text-muted-foreground">
              بدأ في {new Date(currentEntry?.start_time).toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
