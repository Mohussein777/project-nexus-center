import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatTimeSpent } from './attendance/attendanceUtils';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalHours: number;
  billableHours: number;
  earnings: number;
  projectsCount: number;
  averageDaily: number;
  weeklyTarget: number;
}

export function ClockifyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalHours: 0,
    billableHours: 0,
    earnings: 0,
    projectsCount: 0,
    averageDaily: 0,
    weeklyTarget: 40
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardStats();
  }, [user]);

  const loadDashboardStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('duration, project_id')
        .eq('status', 'completed');

      if (error) throw error;

      const totalSeconds = data?.reduce((sum, entry) => sum + (entry.duration || 0), 0) || 0;
      const totalHours = totalSeconds / 3600;
      const billableHours = totalHours * 0.8; // Assume 80% billable
      const earnings = billableHours * 50; // Default rate
      const projectsCount = new Set(data?.map(entry => entry.project_id).filter(Boolean)).size;

      setStats({
        totalHours,
        billableHours,
        earnings,
        projectsCount,
        averageDaily: totalHours / 30, // Last 30 days average
        weeklyTarget: 40
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold" style={{ color }}>{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <Icon className="h-8 w-8" style={{ color }} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="إجمالي الساعات"
          value={`${stats.totalHours.toFixed(1)}h`}
          icon={Clock}
          color="#3b82f6"
          subtitle="جميع المشاريع"
        />
        <StatCard
          title="ساعات قابلة للفوترة"
          value={`${stats.billableHours.toFixed(1)}h`}
          icon={DollarSign}
          color="#10b981"
          subtitle={`${((stats.billableHours / stats.totalHours) * 100 || 0).toFixed(0)}% من الإجمالي`}
        />
        <StatCard
          title="الأرباح المحققة"
          value={`${stats.earnings.toFixed(0)} ر.س`}
          icon={TrendingUp}
          color="#f59e0b"
          subtitle="بناءً على المعدل الحالي"
        />
        <StatCard
          title="المشاريع النشطة"
          value={stats.projectsCount.toString()}
          icon={Users}
          color="#8b5cf6"
          subtitle="مشاريع تحتوي على ساعات مسجلة"
        />
        <StatCard
          title="المعدل اليومي"
          value={`${stats.averageDaily.toFixed(1)}h`}
          icon={BarChart3}
          color="#06b6d4"
          subtitle="آخر 30 يوم"
        />
        <StatCard
          title="الهدف الأسبوعي"
          value={`${stats.weeklyTarget}h`}
          icon={Calendar}
          color="#ef4444"
          subtitle={`${((stats.averageDaily * 7 / stats.weeklyTarget) * 100).toFixed(0)}% مكتمل`}
        />
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}