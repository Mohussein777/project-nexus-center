
import { Clock } from 'lucide-react';

export function RecentActivity() {
  const activities = [
    { 
      user: 'Ahmad Hassan', 
      action: 'completed task', 
      target: 'Structural Analysis for Gulf Heights', 
      time: '2 hours ago',
      avatar: 'AH',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      user: 'Sarah Mohammed', 
      action: 'created invoice', 
      target: '#INV-2023-056 for Al Madina Group', 
      time: '4 hours ago',
      avatar: 'SM',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      user: 'Khalid Al-Otaibi', 
      action: 'added new client', 
      target: 'Gulf Contractors Ltd.', 
      time: 'Yesterday, 14:30',
      avatar: 'KO',
      color: 'from-amber-500 to-orange-500'
    },
    { 
      user: 'Fatima Rashid', 
      action: 'updated project', 
      target: 'Al Hamra Tower Phase 2', 
      time: 'Yesterday, 11:15',
      avatar: 'FR',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  return (
    <div className="glass-card dark:glass-card-dark rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <button className="text-sm text-primary font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start space-x-3">
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
                <Clock size={12} className="mr-1" />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
