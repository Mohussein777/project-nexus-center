
import { useState, useEffect } from 'react';
import { Briefcase, Users, Clock, Calendar, BarChart4, Layers, CheckCircle, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { RecentActivity } from './RecentActivity';
import { getFinancialSummary, getMonthlyFinancialData, getRecentInvoices, getProjectsProfitability } from '@/services/financialDashboardService';
import { getProjects } from '@/services/projectService';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export function DashboardOverview() {
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [financialSummary, setFinancialSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [financialData, projectsData] = await Promise.all([
          getFinancialSummary(period),
          getProjects()
        ]);

        setFinancialSummary(financialData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل البيانات",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [period, toast]);

  // Calculate project status counts
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const atRiskProjects = projects.filter(p => ['At Risk', 'Delayed'].includes(p.status)).length;

  // Calculate percentages
  const onTrackPercentage = totalProjects ? Math.round((inProgressProjects / totalProjects) * 100) : 0;
  const atRiskPercentage = totalProjects ? Math.round((atRiskProjects / totalProjects) * 100) : 0;
  const delayedPercentage = 100 - onTrackPercentage - atRiskPercentage;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">لوحة التحكم</h1>
        <div className="flex items-center space-x-2">
          <select 
            className="bg-white dark:bg-gray-800 border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="week">آخر 7 أيام</option>
            <option value="month">آخر 30 يوم</option>
            <option value="quarter">هذا الربع</option>
            <option value="year">هذه السنة</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="المشاريع النشطة" 
          value={inProgressProjects.toString()} 
          change={totalProjects ? `من إجمالي ${totalProjects}` : undefined} 
          trend="up" 
          icon={<Briefcase size={20} />} 
        />
        <MetricCard 
          title="ساعات العمل" 
          value="1,284" 
          change="هذا الشهر" 
          trend="up" 
          icon={<Clock size={20} />} 
        />
        <MetricCard 
          title="إجمالي الإيرادات" 
          value={financialSummary ? formatCurrency(financialSummary.totalRevenue.toString()) : "..."} 
          change={financialSummary ? `${financialSummary.revenueGrowth}% من الشهر الماضي` : undefined} 
          trend="up" 
          icon={<DollarSign size={20} />} 
        />
        <MetricCard 
          title="الفواتير المعلقة" 
          value={financialSummary ? formatCurrency(financialSummary.pendingInvoices.toString()) : "..."} 
          change={financialSummary ? `${financialSummary.pendingInvoicesCount} فواتير` : undefined} 
          trend="neutral" 
          icon={<Calendar size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card dark:glass-card-dark rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">ملخص حالة المشاريع</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">في المسار الصحيح</span>
                <span className="text-sm font-medium text-green-600">{onTrackPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${onTrackPercentage}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">في خطر</span>
                <span className="text-sm font-medium text-yellow-600">{atRiskPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${atRiskPercentage}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">متأخرة</span>
                <span className="text-sm font-medium text-red-600">{delayedPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${delayedPercentage}%` }}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Layers className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">إجمالي المشاريع</p>
              <p className="text-lg font-bold">{totalProjects}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <CheckCircle className="w-5 h-5 mx-auto mb-2 text-green-500" />
              <p className="text-xs font-medium text-muted-foreground">مكتملة</p>
              <p className="text-lg font-bold">{completedProjects}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Briefcase className="w-5 h-5 mx-auto mb-2 text-blue-500" />
              <p className="text-xs font-medium text-muted-foreground">قيد التنفيذ</p>
              <p className="text-lg font-bold">{inProgressProjects}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <AlertCircle className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
              <p className="text-xs font-medium text-muted-foreground">تحتاج اهتمام</p>
              <p className="text-lg font-bold">{atRiskProjects}</p>
            </div>
          </div>
        </div>

        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">ملخص مالي</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الإيرادات الشهرية</p>
                <p className="text-xl font-bold">
                  {financialSummary ? formatCurrency(financialSummary.totalRevenue) : "..."}
                </p>
              </div>
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <BarChart4 size={20} />
              </div>
            </div>
            <div className="h-[2px] bg-border"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الفواتير غير المدفوعة</p>
                <p className="text-xl font-bold">
                  {financialSummary ? formatCurrency(financialSummary.pendingInvoices) : "..."}
                </p>
              </div>
              <p className="text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-0.5 rounded">
                {financialSummary ? financialSummary.pendingInvoicesCount : "..."} متأخرة
              </p>
            </div>
            <div className="h-[2px] bg-border"></div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">هامش الربح (سنوي)</span>
                <span className="font-medium">
                  {financialSummary ? 
                    `${Math.round(financialSummary.profitGrowth)}%` : 
                    "..."}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: financialSummary ? `${Math.round(financialSummary.profitGrowth)}%` : '0%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card dark:glass-card-dark rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">مالية المشاريع</h2>
            <a href="/financial" className="text-sm text-primary font-medium">
              عرض الكل
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">المشروع</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">العميل</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">الميزانية</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">المصروف</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">المتبقي</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">التقدم</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  [1, 2, 3].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="py-3 px-3">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                ) : projects.slice(0, 3).map((project) => (
                  <tr key={project.id}>
                    <td className="py-3 px-3 text-sm">{project.name}</td>
                    <td className="py-3 px-3 text-sm">{project.client}</td>
                    <td className="py-3 px-3 text-sm">{formatCurrency(Math.random() * 200000 + 100000)}</td>
                    <td className="py-3 px-3 text-sm">{formatCurrency(Math.random() * 100000 + 50000)}</td>
                    <td className="py-3 px-3 text-sm">{formatCurrency(Math.random() * 50000 + 10000)}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-2" />
                        <span className="text-xs">{project.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">المواعيد النهائية القادمة</h2>
          <div className="space-y-3">
            {projects
              .filter(p => p.status !== 'Completed' && p.deadline)
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
              .slice(0, 4)
              .map((project, i) => {
                const deadlineDate = new Date(project.deadline);
                const today = new Date();
                const diffTime = deadlineDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                let colorClass = 'bg-blue-50 dark:bg-blue-900/20 border-blue-500';
                let textColorClass = 'text-blue-600 dark:text-blue-400';
                
                if (diffDays <= 3) {
                  colorClass = 'bg-red-50 dark:bg-red-900/20 border-red-500';
                  textColorClass = 'text-red-600 dark:text-red-400';
                } else if (diffDays <= 7) {
                  colorClass = 'bg-orange-50 dark:bg-orange-900/20 border-orange-500';
                  textColorClass = 'text-orange-600 dark:text-orange-400';
                } else if (diffDays <= 14) {
                  colorClass = 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500';
                  textColorClass = 'text-yellow-600 dark:text-yellow-400';
                }
                
                return (
                  <div key={i} className={`${colorClass} border-l-4 p-3 rounded-r-lg`}>
                    <p className="text-sm font-medium">{project.name}</p>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{project.deadline}</p>
                      <p className={`text-xs font-medium ${textColorClass}`}>
                        {diffDays > 0 ? `${diffDays} أيام متبقية` : 'اليوم'}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <RecentActivity />
    </div>
  );
}
