
import { Calendar, Clock, UserCheck, AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface AttendanceStatsProps {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  attendanceRate: number;
}

export function StatsCards({ 
  totalEmployees,
  presentToday,
  absentToday,
  attendanceRate
}: AttendanceStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">الحاضرون</p>
              <p className="text-3xl font-bold mt-1">{presentToday}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <UserCheck size={24} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">الغائبون</p>
              <p className="text-3xl font-bold mt-1">{absentToday}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertCircle size={24} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">معدل الحضور</p>
              <p className="text-3xl font-bold mt-1">{attendanceRate}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Calendar size={24} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">إجمالي الموظفين</p>
              <p className="text-3xl font-bold mt-1">{totalEmployees}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Clock size={24} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
