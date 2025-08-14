import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Square,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatTimeSpent } from './attendance/attendanceUtils';
import { supabase } from '@/integrations/supabase/client';

interface TimeEntry {
  id: string;
  description: string;
  project_name?: string;
  start_time: string;
  end_time?: string;
  duration: number;
  date: string;
  status: 'active' | 'completed';
}

interface DayData {
  date: string;
  entries: TimeEntry[];
  totalDuration: number;
  isToday: boolean;
}

export function WeeklyTimesheet() {
  const { user } = useAuth();
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWeekData();
  }, [currentWeekStart, user]);

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getWeekDates(startDate: Date): Date[] {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  const loadWeekData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const weekDates = getWeekDates(currentWeekStart);
      const startDate = weekDates[0].toISOString().split('T')[0];
      const endDate = weekDates[6].toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          projects:project_id (name)
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('start_time', { ascending: true });

      if (error) throw error;

      const today = new Date().toISOString().split('T')[0];
      
      const weekData: DayData[] = weekDates.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const dayEntries = data?.filter(entry => entry.date === dateStr) || [];
        
        return {
          date: dateStr,
          entries: dayEntries.map(entry => ({
            id: entry.id,
            description: entry.description || '',
            project_name: entry.projects?.name,
            start_time: entry.start_time,
            end_time: entry.end_time,
            duration: entry.duration || 0,
            date: entry.date,
            status: entry.status as 'active' | 'completed'
          })),
          totalDuration: dayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0),
          isToday: dateStr === today
        };
      });

      setWeekData(weekData);
    } catch (error) {
      console.error('Error loading week data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const formatWeekRange = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);
    
    return `${currentWeekStart.toLocaleDateString('ar')} - ${endDate.toLocaleDateString('ar')}`;
  };

  const getDayName = (date: string) => {
    const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return dayNames[new Date(date).getDay()];
  };

  const getWeekTotal = () => {
    return weekData.reduce((sum, day) => sum + day.totalDuration, 0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            الجدول الأسبوعي
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-3">
              {formatWeekRange()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Week Summary */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">إجمالي الأسبوع:</span>
            </div>
            <div className="font-mono text-lg font-bold text-primary">
              {formatTimeSpent(getWeekTotal())}
            </div>
          </div>

          {/* Daily Breakdown */}
          <div className="space-y-3">
            {weekData.map((day) => (
              <div
                key={day.date}
                className={`border rounded-lg p-4 transition-all ${
                  day.isToday 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">
                      {getDayName(day.date)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('ar')}
                    </div>
                    {day.isToday && (
                      <Badge variant="default" className="text-xs">
                        اليوم
                      </Badge>
                    )}
                  </div>
                  <div className="font-mono font-medium text-primary">
                    {formatTimeSpent(day.totalDuration)}
                  </div>
                </div>

                {/* Day's Time Entries */}
                {day.entries.length > 0 ? (
                  <div className="space-y-2">
                    {day.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 bg-background/50 rounded border"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {entry.description || 'مهمة بدون وصف'}
                          </div>
                          {entry.project_name && (
                            <div className="text-xs text-muted-foreground">
                              {entry.project_name}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-mono">
                              {formatTimeSpent(entry.duration)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(entry.start_time).toLocaleTimeString('ar', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                              {entry.end_time && (
                                ` - ${new Date(entry.end_time).toLocaleTimeString('ar', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}`
                              )}
                            </div>
                          </div>
                          
                          {entry.status === 'active' && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <Play className="h-3 w-3 mr-1" />
                              نشط
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    لا توجد إدخالات وقت لهذا اليوم
                  </div>
                )}
              </div>
            ))}
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}