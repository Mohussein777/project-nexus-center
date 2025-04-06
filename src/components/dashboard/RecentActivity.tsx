
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Activity {
  user: string;
  action: string;
  target: string;
  time: string;
  avatar: string;
  color: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecentActivities = async () => {
      setLoading(true);
      try {
        // Fetch financial transactions for activities
        const { data: transactions, error: transactionsError } = await supabase
          .from('financial_transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (transactionsError) throw transactionsError;

        // Create activities from transactions
        const transactionActivities = transactions.slice(0, 4).map((transaction) => {
          let action = transaction.operation_type === 'PAYMENT' ? 'سجل صرف مالي' : 'سجل إيداع مالي';
          let target = transaction.description || 
                      (transaction.project_name ? `للمشروع: ${transaction.project_name}` : 'عام');
          
          // Generate initials for the avatar
          let name = transaction.recipient || 'مستخدم النظام';
          let initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
          
          // Choose a random color gradient for variety
          const colors = [
            'from-blue-500 to-cyan-500',
            'from-purple-500 to-pink-500',
            'from-amber-500 to-orange-500',
            'from-green-500 to-emerald-500',
            'from-red-500 to-pink-500',
            'from-indigo-500 to-blue-500'
          ];
          
          return {
            user: name,
            action,
            target,
            time: getRelativeTime(new Date(transaction.created_at)),
            avatar: initials,
            color: colors[Math.floor(Math.random() * colors.length)]
          };
        });

        setActivities(transactionActivities);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل الأنشطة الحديثة",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, [toast]);

  // Function to format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) {
      return 'الآن';
    } else if (diffMin < 60) {
      return `منذ ${diffMin} دقيقة`;
    } else if (diffHour < 24) {
      return `منذ ${diffHour} ساعة`;
    } else if (diffDay < 7) {
      return `منذ ${diffDay} يوم`;
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  if (loading) {
    return (
      <div className="glass-card dark:glass-card-dark rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">الأنشطة الحديثة</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card dark:glass-card-dark rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">الأنشطة الحديثة</h2>
        <button className="text-sm text-primary font-medium">
          عرض الكل
        </button>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">لا توجد أنشطة حديثة</p>
        ) : (
          activities.map((activity, i) => (
            <div key={i} className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activity.color} flex items-center justify-center text-white font-medium text-xs`}>
                {activity.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>
                  {' '}{activity.action}{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Clock size={12} className="mr-1 rtl:ml-1 rtl:mr-0" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
