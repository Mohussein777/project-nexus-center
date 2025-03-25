
import { useState } from 'react';
import { Search, Plus, Filter, Download, Calendar, DollarSign, TrendingUp, TrendingDown, BarChart4 } from 'lucide-react';

export function FinancialOverview() {
  const [period, setPeriod] = useState('month');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Financial Management</h1>
        
        <div className="flex items-center space-x-2">
          <select 
            className="py-2 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-gray-800"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <button className="inline-flex items-center space-x-1 px-3 py-2 border border-border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">$427,890</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <DollarSign size={20} />
            </div>
          </div>
        </div>
        
        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold">$156,240</p>
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +8.3% from last month
              </p>
            </div>
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <DollarSign size={20} />
            </div>
          </div>
        </div>
        
        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className="text-2xl font-bold">$271,650</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +15.2% from last month
              </p>
            </div>
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <BarChart4 size={20} />
            </div>
          </div>
        </div>
        
        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Pending Invoices</p>
              <p className="text-2xl font-bold">$84,320</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">8 invoices pending</p>
            </div>
            <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <Calendar size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card dark:glass-card-dark rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Revenue & Expenses</h2>
            <div className="flex space-x-1">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">Revenue</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {/* This is a placeholder for a chart */}
            <div className="flex-1 flex items-end space-x-1">
              <div className="w-1/12 h-20 bg-blue-500 rounded-t-md"></div>
              <div className="w-1/12 h-12 bg-red-500 rounded-t-md"></div>
              <div className="w-1/12 h-36 bg-blue-500 rounded-t-md"></div>
              <div className="w-1/12 h-16 bg-red-500 rounded-t-md"></div>
              <div className="w-1/12 h-48 bg-blue-500 rounded-t-md"></div>
              <div className="w-1/12 h-24 bg-red-500 rounded-t-md"></div>
              <div className="w-1/12 h-40 bg-blue-500 rounded-t-md"></div>
              <div className="w-1/12 h-20 bg-red-500 rounded-t-md"></div>
              <div className="w-1/12 h-56 bg-blue-500 rounded-t-md"></div>
              <div className="w-1/12 h-28 bg-red-500 rounded-t-md"></div>
              <div className="w-1/12 h-44 bg-blue-500 rounded-t-md"></div>
              <div className="w-1/12 h-24 bg-red-500 rounded-t-md"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-border">
              <div>
                <p className="font-medium">INV-2023-056</p>
                <p className="text-sm text-muted-foreground">Al Madina Group</p>
                <p className="text-xs text-muted-foreground">Due: Jun 15, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$24,500</p>
                <p className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">Pending</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-border">
              <div>
                <p className="font-medium">INV-2023-055</p>
                <p className="text-sm text-muted-foreground">Gulf Developers</p>
                <p className="text-xs text-muted-foreground">Due: Jun 12, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$18,750</p>
                <p className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">Paid</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-border">
              <div>
                <p className="font-medium">INV-2023-054</p>
                <p className="text-sm text-muted-foreground">Al Hamra Real Estate</p>
                <p className="text-xs text-muted-foreground">Due: Jun 10, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$32,800</p>
                <p className="text-xs px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">Overdue</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-border">
              <div>
                <p className="font-medium">INV-2023-053</p>
                <p className="text-sm text-muted-foreground">Ministry of Technology</p>
                <p className="text-xs text-muted-foreground">Due: Jun 8, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$45,000</p>
                <p className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">Paid</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 py-2 text-center text-sm text-primary border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            View All Invoices
          </button>
        </div>
      </div>

      <div className="glass-card dark:glass-card-dark rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4">Project Profitability</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Project</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Client</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Budget</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Spent</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Remaining</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Profit Margin</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-sm font-medium">Al Hamra Tower</td>
                <td className="px-4 py-3 text-sm">Al Hamra Real Estate</td>
                <td className="px-4 py-3 text-sm text-right">$240,000</td>
                <td className="px-4 py-3 text-sm text-right">$156,000</td>
                <td className="px-4 py-3 text-sm text-right">$84,000</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    On Budget
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-green-600 dark:text-green-400">35%</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-sm font-medium">Marina Residence</td>
                <td className="px-4 py-3 text-sm">Gulf Developers</td>
                <td className="px-4 py-3 text-sm text-right">$180,000</td>
                <td className="px-4 py-3 text-sm text-right">$135,000</td>
                <td className="px-4 py-3 text-sm text-right">$45,000</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    At Risk
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-yellow-600 dark:text-yellow-400">25%</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-sm font-medium">Tech Park</td>
                <td className="px-4 py-3 text-sm">Ministry of Technology</td>
                <td className="px-4 py-3 text-sm text-right">$350,000</td>
                <td className="px-4 py-3 text-sm text-right">$252,000</td>
                <td className="px-4 py-3 text-sm text-right">$98,000</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    On Budget
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-green-600 dark:text-green-400">28%</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-sm font-medium">Gulf Heights</td>
                <td className="px-4 py-3 text-sm">Al Madina Group</td>
                <td className="px-4 py-3 text-sm text-right">$210,000</td>
                <td className="px-4 py-3 text-sm text-right">$189,000</td>
                <td className="px-4 py-3 text-sm text-right">$21,000</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    Over Budget
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-red-600 dark:text-red-400">10%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium">Central Hospital</td>
                <td className="px-4 py-3 text-sm">Ministry of Health</td>
                <td className="px-4 py-3 text-sm text-right">$420,000</td>
                <td className="px-4 py-3 text-sm text-right">$294,000</td>
                <td className="px-4 py-3 text-sm text-right">$126,000</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    On Budget
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-green-600 dark:text-green-400">30%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
