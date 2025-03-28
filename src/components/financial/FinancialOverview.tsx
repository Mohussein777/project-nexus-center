
import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, Calendar, DollarSign, TrendingUp, TrendingDown, BarChart4 } from 'lucide-react';
import { 
  getFinancialSummary, 
  getMonthlyFinancialData, 
  getRecentInvoices, 
  getProjectsProfitability,
  FinancialSummary,
  MonthlyFinancialData,
  Invoice,
  ProjectFinancial
} from '@/services/financialService';
import { useToast } from '@/components/ui/use-toast';

export function FinancialOverview() {
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyFinancialData[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<ProjectFinancial[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [summaryData, monthlyData, invoicesData, projectsData] = await Promise.all([
          getFinancialSummary(period),
          getMonthlyFinancialData(),
          getRecentInvoices(),
          getProjectsProfitability()
        ]);
        
        setSummary(summaryData);
        setMonthlyData(monthlyData);
        setInvoices(invoicesData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        toast({
          title: "Error",
          description: "Failed to load financial data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, toast]);

  if (loading || !summary) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Financial Management</h1>
        </div>
        <div className="space-y-6 opacity-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card dark:glass-card-dark rounded-xl p-4 animate-pulse">
                <div className="h-24 bg-muted"></div>
              </div>
            ))}
          </div>
          <div className="glass-card dark:glass-card-dark rounded-xl p-4 h-64 animate-pulse">
            <div className="h-full bg-muted"></div>
          </div>
          <div className="glass-card dark:glass-card-dark rounded-xl p-4 h-64 animate-pulse">
            <div className="h-full bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-2xl font-bold">${summary.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +{summary.revenueGrowth}% from last month
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
              <p className="text-2xl font-bold">${summary.totalExpenses.toLocaleString()}</p>
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +{summary.expenseGrowth}% from last month
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
              <p className="text-2xl font-bold">${summary.netProfit.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +{summary.profitGrowth}% from last month
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
              <p className="text-2xl font-bold">${summary.pendingInvoices.toLocaleString()}</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">{summary.pendingInvoicesCount} invoices pending</p>
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
            {/* This is a placeholder for a chart - in a real application, we would use Recharts */}
            <div className="flex-1 flex items-end space-x-1">
              {monthlyData.map((month, index) => (
                <React.Fragment key={index}>
                  <div 
                    className="w-1/24 bg-blue-500 rounded-t-md" 
                    style={{ height: `${month.revenue / 1000}px` }}
                  ></div>
                  <div 
                    className="w-1/24 bg-red-500 rounded-t-md" 
                    style={{ height: `${month.expenses / 1000}px` }}
                  ></div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {monthlyData.map((data, index) => (
              <span key={index}>{data.month}</span>
            ))}
          </div>
        </div>

        <div className="glass-card dark:glass-card-dark rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>
          <div className="space-y-3">
            {invoices.map(invoice => (
              <div key={invoice.id} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-border">
                <div>
                  <p className="font-medium">{invoice.number}</p>
                  <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                  <p className="text-xs text-muted-foreground">Due: {invoice.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${invoice.amount.toLocaleString()}</p>
                  <p className={`text-xs px-2 py-0.5 rounded-full ${
                    invoice.status === 'Paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : invoice.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {invoice.status}
                  </p>
                </div>
              </div>
            ))}
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
              {projects.map((project, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="px-4 py-3 text-sm font-medium">{project.projectName}</td>
                  <td className="px-4 py-3 text-sm">{project.clientName}</td>
                  <td className="px-4 py-3 text-sm text-right">${project.budget.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">${project.spent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">${project.remaining.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      project.status === 'On Budget' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : project.status === 'At Risk'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${
                    project.profitMargin > 30 
                      ? 'text-green-600 dark:text-green-400' 
                      : project.profitMargin > 20
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {project.profitMargin}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
