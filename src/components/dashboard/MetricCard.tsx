
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: ReactNode;
}

export function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  return (
    <div className="glass-card dark:glass-card-dark rounded-xl shadow-md p-4 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
          <div className="flex items-end">
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <span className={`ml-2 text-xs font-medium ${
                trend === 'up' 
                  ? 'text-green-600 dark:text-green-500' 
                  : trend === 'down' 
                    ? 'text-red-600 dark:text-red-500' 
                    : 'text-gray-500 dark:text-gray-400'
              }`}>
                {change}
              </span>
            )}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
