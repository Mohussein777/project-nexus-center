
import { Briefcase, Users, Clock, Calendar, BarChart4, Layers, CheckCircle, AlertCircle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { RecentActivity } from './RecentActivity';

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="flex items-center space-x-2">
          <select className="bg-white dark:bg-gray-800 border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Active Projects" 
          value="24" 
          change="+2 from last month" 
          trend="up" 
          icon={<Briefcase size={20} />} 
        />
        <MetricCard 
          title="Total Clients" 
          value="142" 
          change="+12 YTD" 
          trend="up" 
          icon={<Users size={20} />} 
        />
        <MetricCard 
          title="Billable Hours" 
          value="1,284" 
          change="-32 from last month" 
          trend="down" 
          icon={<Clock size={20} />} 
        />
        <MetricCard 
          title="Upcoming Deadlines" 
          value="8" 
          change="This week" 
          trend="neutral" 
          icon={<Calendar size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card dark:glass-card-dark rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Project Status Summary</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">On Track</span>
                <span className="text-sm font-medium text-green-600">68%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">At Risk</span>
                <span className="text-sm font-medium text-yellow-600">21%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '21%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Delayed</span>
                <span className="text-sm font-medium text-red-600">11%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '11%' }}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Layers className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Total Projects</p>
              <p className="text-lg font-bold">32</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <CheckCircle className="w-5 h-5 mx-auto mb-2 text-green-500" />
              <p className="text-xs font-medium text-muted-foreground">Completed</p>
              <p className="text-lg font-bold">8</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Briefcase className="w-5 h-5 mx-auto mb-2 text-blue-500" />
              <p className="text-xs font-medium text-muted-foreground">In Progress</p>
              <p className="text-lg font-bold">16</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <AlertCircle className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
              <p className="text-xs font-medium text-muted-foreground">Need Attention</p>
              <p className="text-lg font-bold">8</p>
            </div>
          </div>
        </div>

        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-xl font-bold">$128,540</p>
              </div>
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <BarChart4 size={20} />
              </div>
            </div>
            <div className="h-[2px] bg-border"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Invoices</p>
                <p className="text-xl font-bold">$42,150</p>
              </div>
              <p className="text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-0.5 rounded">
                4 Overdue
              </p>
            </div>
            <div className="h-[2px] bg-border"></div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Profit Margin (YTD)</span>
                <span className="font-medium">32%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card dark:glass-card-dark rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Resource Allocation</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-32 text-sm">Architecture</div>
              <div className="flex-1">
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="w-10 text-sm text-right">85%</div>
            </div>
            <div className="flex items-center">
              <div className="w-32 text-sm">Civil Eng.</div>
              <div className="flex-1">
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="w-10 text-sm text-right">70%</div>
            </div>
            <div className="flex items-center">
              <div className="w-32 text-sm">MEP</div>
              <div className="flex-1">
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="w-10 text-sm text-right">65%</div>
            </div>
            <div className="flex items-center">
              <div className="w-32 text-sm">Structural</div>
              <div className="flex-1">
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className="w-10 text-sm text-right">50%</div>
            </div>
            <div className="flex items-center">
              <div className="w-32 text-sm">Project Mgmt</div>
              <div className="flex-1">
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div className="w-10 text-sm text-right">90%</div>
            </div>
          </div>
        </div>

        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-3 rounded-r-lg">
              <p className="text-sm font-medium">Al Hamra Tower - Design Review</p>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">June 10, 2023</p>
                <p className="text-xs font-medium text-orange-600 dark:text-orange-400">3 days left</p>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 rounded-r-lg">
              <p className="text-sm font-medium">Gulf Heights - Final Submission</p>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">June 12, 2023</p>
                <p className="text-xs font-medium text-red-600 dark:text-red-400">5 days left</p>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 rounded-r-lg">
              <p className="text-sm font-medium">Marina Residence - Client Meeting</p>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">June 15, 2023</p>
                <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">8 days left</p>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded-r-lg">
              <p className="text-sm font-medium">Tech Park - Progress Report</p>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">June 20, 2023</p>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">13 days left</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecentActivity />
    </div>
  );
}
