
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeEntry } from "../types";
import { formatTimeSpent } from '@/services/employeeService';

interface PersonalStatsProps {
  timeEntries: TimeEntry[];
  employeeName: string;
  loading: boolean;
}

export function PersonalStats({ timeEntries, employeeName, loading }: PersonalStatsProps) {
  // Calculate statistics from time entries
  const calculateStats = () => {
    if (!timeEntries.length) {
      return {
        dailyAvg: "0:00",
        weeklyTotal: "0:00",
        monthlyTotal: "0:00"
      };
    }
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Weekly entries
    const weekEntries = timeEntries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo && entry.status === 'completed'
    );
    
    // Monthly entries
    const monthEntries = timeEntries.filter(entry => 
      new Date(entry.date) >= oneMonthAgo && entry.status === 'completed'
    );
    
    // Calculate totals
    const weeklyTotalSeconds = weekEntries.reduce((total, entry) => total + (entry.duration || 0), 0);
    const monthlyTotalSeconds = monthEntries.reduce((total, entry) => total + (entry.duration || 0), 0);
    
    // Calculate daily average
    const uniqueDays = new Set(timeEntries.map(entry => entry.date)).size;
    const dailyAvgSeconds = uniqueDays > 0 ? 
      timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0) / uniqueDays : 0;
    
    return {
      dailyAvg: formatTimeSpent(dailyAvgSeconds),
      weeklyTotal: formatTimeSpent(weeklyTotalSeconds),
      monthlyTotal: formatTimeSpent(monthlyTotalSeconds)
    };
  };
  
  const stats = calculateStats();
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">الإحصائيات الشخصية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">الإحصائيات الشخصية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">معدل العمل اليومي</span>
            <span className="font-medium">{stats.dailyAvg} ساعة</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">إجمالي ساعات هذا الأسبوع</span>
            <span className="font-medium">{stats.weeklyTotal} ساعة</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">إجمالي ساعات هذا الشهر</span>
            <span className="font-medium">{stats.monthlyTotal} ساعة</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
