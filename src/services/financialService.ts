
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

export interface FinancialMetric {
  id: string;
  title: string;
  value: string;
  previousValue: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  color: string;
  description?: string;
}

export interface RevenueData {
  date: string;
  amount: number;
}

export interface ExpenseData {
  date: string;
  amount: number;
}

export interface ProjectFinancial {
  id: string;
  projectId: string;
  projectName: string;
  budget: number;
  spent: number;
  progress: number;
  status: 'On Track' | 'At Risk' | 'Over Budget';
}

export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export async function getFinancialSummary(): Promise<{
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  profitMargin: number;
}> {
  try {
    // Get revenue (credits)
    const { data: revenueData, error: revenueError } = await supabase
      .from('financial_transactions')
      .select('credit')
      .not('credit', 'is', null);

    if (revenueError) throw revenueError;

    // Get expenses (debits)
    const { data: expenseData, error: expenseError } = await supabase
      .from('financial_transactions')
      .select('debit')
      .not('debit', 'is', null);

    if (expenseError) throw expenseError;

    const totalRevenue = revenueData.reduce((sum, item) => sum + (item.credit || 0), 0);
    const totalExpenses = expenseData.reduce((sum, item) => sum + (item.debit || 0), 0);
    const totalProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      profitMargin
    };
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      totalProfit: 0,
      profitMargin: 0
    };
  }
}

export async function getFinancialMetrics(): Promise<FinancialMetric[]> {
  try {
    const { totalRevenue, totalExpenses, totalProfit, profitMargin } = await getFinancialSummary();

    // For a real app, you would compare with previous period data
    // Here we're just showing example data
    return [
      {
        id: '1',
        title: 'الإيرادات',
        value: formatCurrency(totalRevenue.toString()),
        previousValue: formatCurrency('120000'),
        change: 12.5,
        trend: 'up',
        color: 'bg-green-500',
        description: 'إجمالي الإيرادات'
      },
      {
        id: '2',
        title: 'المصروفات',
        value: formatCurrency(totalExpenses.toString()),
        previousValue: formatCurrency('75000'),
        change: -5.2,
        trend: 'down',
        color: 'bg-red-500',
        description: 'إجمالي المصروفات'
      },
      {
        id: '3',
        title: 'الأرباح',
        value: formatCurrency(totalProfit.toString()),
        previousValue: formatCurrency('45000'),
        change: 28.3,
        trend: 'up',
        color: 'bg-blue-500',
        description: 'إجمالي الأرباح'
      },
      {
        id: '4',
        title: 'هامش الربح',
        value: `${profitMargin.toFixed(1)}%`,
        previousValue: '35.5%',
        change: 4.8,
        trend: 'up',
        color: 'bg-purple-500',
        description: 'نسبة الربح من الإيرادات'
      }
    ];
  } catch (error) {
    console.error('Error fetching financial metrics:', error);
    return [];
  }
}

export async function getRevenueExpenseData(): Promise<{
  revenue: RevenueData[];
  expenses: ExpenseData[];
}> {
  try {
    // Get transactions grouped by month
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('date, credit, debit')
      .order('date', { ascending: true });

    if (error) throw error;

    // Process the data to group by month
    const monthlyData = data.reduce((acc: any, transaction) => {
      const monthYear = format(new Date(transaction.date), 'MMM yyyy');
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          revenue: 0,
          expenses: 0
        };
      }
      
      if (transaction.credit) {
        acc[monthYear].revenue += transaction.credit;
      }
      
      if (transaction.debit) {
        acc[monthYear].expenses += transaction.debit;
      }
      
      return acc;
    }, {});

    // Convert to arrays for charts
    const revenue: RevenueData[] = [];
    const expenses: ExpenseData[] = [];

    Object.entries(monthlyData).forEach(([month, data]: [string, any]) => {
      revenue.push({
        date: month,
        amount: data.revenue
      });
      
      expenses.push({
        date: month,
        amount: data.expenses
      });
    });

    return { revenue, expenses };
  } catch (error) {
    console.error('Error fetching revenue/expense data:', error);
    
    // Return mock data if there's an error
    const mockMonths = ['Jan 2023', 'Feb 2023', 'Mar 2023', 'Apr 2023', 'May 2023', 'Jun 2023'];
    
    return {
      revenue: mockMonths.map((month, index) => ({
        date: month,
        amount: Math.floor(Math.random() * 50000) + 20000
      })),
      expenses: mockMonths.map((month, index) => ({
        date: month,
        amount: Math.floor(Math.random() * 30000) + 15000
      }))
    };
  }
}

export async function getProjectFinancials(): Promise<ProjectFinancial[]> {
  try {
    const { data, error } = await supabase
      .from('project_financials')
      .select(`
        id,
        project_id,
        total_deal,
        total_payment,
        project_progress,
        projects(name)
      `)
      .limit(5);

    if (error) throw error;

    return data.map((item) => {
      const budget = item.total_deal || 0;
      const spent = item.total_payment || 0;
      const progress = item.project_progress || 0;
      
      let status: 'On Track' | 'At Risk' | 'Over Budget' = 'On Track';
      
      if (spent > budget) {
        status = 'Over Budget';
      } else if (spent / budget > 0.9 && progress < 0.9) {
        status = 'At Risk';
      }
      
      return {
        id: item.id,
        projectId: item.project_id ? item.project_id.toString() : '0',
        projectName: item.projects?.name || 'Unknown Project',
        budget,
        spent,
        progress,
        status
      };
    });
  } catch (error) {
    console.error('Error fetching project financials:', error);
    return [];
  }
}

export async function getInvoices(): Promise<Invoice[]> {
  try {
    // In a real app, this would fetch from a database table
    // For now, just return mock data
    const mockInvoices = [
      {
        id: '1',
        number: 'INV-2023-001',
        clientName: 'شركة النخبة للمقاولات',
        dueDate: '2023-06-15',
        amount: 15000,
        status: 'Paid' as const
      },
      {
        id: '2',
        number: 'INV-2023-002',
        clientName: 'مؤسسة الإعمار للتطوير',
        dueDate: '2023-06-25',
        amount: 8500,
        status: 'Pending' as const
      },
      {
        id: '3',
        number: 'INV-2023-003',
        clientName: 'شركة البناء الحديث',
        dueDate: '2023-06-10',
        amount: 12000,
        status: 'Overdue' as const
      },
      {
        id: '4',
        number: 'INV-2023-004',
        clientName: 'مجموعة المستقبل',
        dueDate: '2023-07-05',
        amount: 9000,
        status: 'Pending' as const
      }
    ];
    
    return mockInvoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export async function getRecentTransactions(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select(`
        id,
        date,
        operation_type,
        description,
        recipient,
        credit,
        debit,
        project_name
      `)
      .order('date', { ascending: false })
      .limit(5);

    if (error) throw error;

    return data.map((transaction) => {
      const amount = transaction.credit || transaction.debit || 0;
      const isIncome = transaction.credit !== null && transaction.credit > 0;
      
      return {
        id: transaction.id,
        date: format(new Date(transaction.date), 'dd/MM/yyyy'),
        type: transaction.operation_type,
        description: transaction.description || 'No description',
        recipient: transaction.recipient || 'Not specified',
        amount: formatCurrency(amount.toString()),
        isIncome,
        project: transaction.project_name || '-'
      };
    });
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return [];
  }
}

export async function getTopClients(): Promise<any[]> {
  try {
    // Group transactions by client and calculate total
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('client, credit')
      .not('client', 'is', null)
      .not('credit', 'is', null);

    if (error) throw error;

    const clientTotals: Record<string, number> = {};
    
    data.forEach((transaction) => {
      if (transaction.client && transaction.credit) {
        if (!clientTotals[transaction.client]) {
          clientTotals[transaction.client] = 0;
        }
        clientTotals[transaction.client] += transaction.credit;
      }
    });

    // Convert to array, sort by total, and take top 5
    const topClients = Object.entries(clientTotals)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return topClients.map((client, index) => ({
      id: index.toString(),
      name: client.name,
      total: formatCurrency(client.total.toString()),
      percentage: client.total / topClients.reduce((sum, c) => sum + c.total, 0) * 100
    }));
  } catch (error) {
    console.error('Error fetching top clients:', error);
    return [];
  }
}
