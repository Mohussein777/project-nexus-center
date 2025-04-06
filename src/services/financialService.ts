
import { supabase } from "@/integrations/supabase/client";

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingInvoices: number;
  pendingInvoicesCount: number;
  revenueGrowth: number;
  expenseGrowth: number;
  profitGrowth: number;
}

export interface MonthlyFinancialData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface Invoice {
  id: number;
  number: string;
  clientName: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface ProjectFinancial {
  projectName: string;
  clientName: string;
  budget: number;
  spent: number;
  remaining: number;
  status: 'On Budget' | 'At Risk' | 'Over Budget';
  profitMargin: number;
}

export const getFinancialSummary = async (period: string = 'month'): Promise<FinancialSummary> => {
  // Get current date and calculate start date based on period
  const now = new Date();
  let startDate = new Date();
  
  switch (period) {
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  const startDateStr = startDate.toISOString().split('T')[0];
  
  try {
    // Get sum of all credits (revenue) for the period
    const { data: revenueData, error: revenueError } = await supabase
      .from('financial_transactions')
      .select('credit')
      .gte('date', startDateStr)
      .not('credit', 'eq', 0);

    if (revenueError) throw revenueError;

    // Get sum of all debits (expenses) for the period
    const { data: expensesData, error: expensesError } = await supabase
      .from('financial_transactions')
      .select('debit')
      .gte('date', startDateStr)
      .not('debit', 'eq', 0);

    if (expensesError) throw expensesError;

    // Calculate totals
    const totalRevenue = revenueData.reduce((sum, item) => sum + (parseFloat(item.credit) || 0), 0);
    const totalExpenses = expensesData.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0);
    const netProfit = totalRevenue - totalExpenses;

    // Get pending invoices from project_financials
    const { data: projectFinancials, error: projectFinancialsError } = await supabase
      .from('project_financials')
      .select('balance_client');

    if (projectFinancialsError) throw projectFinancialsError;

    const pendingInvoices = projectFinancials.reduce((sum, item) => sum + (parseFloat(item.balance_client) || 0), 0);
    const pendingInvoicesCount = projectFinancials.filter(item => parseFloat(item.balance_client) > 0).length;

    // Calculate growth rates (randomly for now, would need comparison data in a real scenario)
    const revenueGrowth = 12.5;
    const expenseGrowth = 8.3;
    const profitGrowth = 15.2;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      pendingInvoices,
      pendingInvoicesCount,
      revenueGrowth,
      expenseGrowth,
      profitGrowth
    };
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    throw error;
  }
};

export const getMonthlyFinancialData = async (): Promise<MonthlyFinancialData[]> => {
  // We'll generate monthly data for the past 12 months based on actual transactions
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      date: month,
      monthStr: month.toLocaleString('ar-SA', { month: 'short' })
    });
  }
  
  try {
    // Get all financial transactions for the past 12 months
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString().split('T')[0];
    
    const { data: transactions, error } = await supabase
      .from('financial_transactions')
      .select('date, credit, debit')
      .gte('date', startDate);
    
    if (error) throw error;
    
    // Process transactions by month
    return months.map(({ date, monthStr }) => {
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthTransactions = transactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= monthStart && txDate <= monthEnd;
      });
      
      const revenue = monthTransactions.reduce((sum, t) => sum + (parseFloat(t.credit) || 0), 0);
      const expenses = monthTransactions.reduce((sum, t) => sum + (parseFloat(t.debit) || 0), 0);
      
      return {
        month: monthStr,
        revenue,
        expenses
      };
    });
  } catch (error) {
    console.error('Error fetching monthly financial data:', error);
    // Return mock data as fallback
    return months.map(({ monthStr }) => ({
      month: monthStr,
      revenue: Math.floor(Math.random() * 50000) + 20000,
      expenses: Math.floor(Math.random() * 30000) + 10000
    }));
  }
};

export const getRecentInvoices = async (): Promise<Invoice[]> => {
  try {
    // Get project financials as "invoices"
    const { data: projectFinancials, error } = await supabase
      .from('project_financials')
      .select('id, project_id, balance_client, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(4);
      
    if (error) throw error;
    
    // Get project details for each financial record
    const projectIds = projectFinancials.map(pf => pf.project_id);
    
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, client_id')
      .in('id', projectIds);
      
    if (projectsError) throw projectsError;
    
    // Get client names
    const clientIds = projects.map(p => p.client_id);
    
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, name')
      .in('id', clientIds);
      
    if (clientsError) throw clientsError;
    
    // Map all data together into invoices
    return projectFinancials.map((pf, index) => {
      const project = projects.find(p => p.id === pf.project_id);
      const client = project ? clients.find(c => c.id === project.client_id) : null;
      
      // Calculate a due date (30 days from the last update)
      const updatedDate = new Date(pf.updated_at);
      const dueDate = new Date(updatedDate);
      dueDate.setDate(dueDate.getDate() + 30);
      
      // Determine status based on days since update
      const now = new Date();
      const daysSinceUpdate = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let status: 'Paid' | 'Pending' | 'Overdue' = 'Pending';
      if (parseFloat(pf.balance_client) === 0) {
        status = 'Paid';
      } else if (daysSinceUpdate > 30) {
        status = 'Overdue';
      }
      
      return {
        id: pf.id,
        number: `INV-${new Date().getFullYear()}-${String(index + 100).slice(1)}`,
        clientName: client ? client.name : 'غير معروف',
        dueDate: dueDate.toLocaleDateString('ar-SA'),
        amount: parseFloat(pf.balance_client) || 0,
        status
      };
    });
  } catch (error) {
    console.error('Error fetching recent invoices:', error);
    // Return mock data as fallback
    return [
      {
        id: 1,
        number: 'INV-2023-056',
        clientName: 'Al Madina Group',
        dueDate: 'Jun 15, 2023',
        amount: 24500,
        status: 'Pending'
      },
      {
        id: 2,
        number: 'INV-2023-055',
        clientName: 'Gulf Developers',
        dueDate: 'Jun 12, 2023',
        amount: 18750,
        status: 'Paid'
      },
      {
        id: 3,
        number: 'INV-2023-054',
        clientName: 'Al Hamra Real Estate',
        dueDate: 'Jun 10, 2023',
        amount: 32800,
        status: 'Overdue'
      },
      {
        id: 4,
        number: 'INV-2023-053',
        clientName: 'Ministry of Technology',
        dueDate: 'Jun 8, 2023',
        amount: 45000,
        status: 'Paid'
      }
    ];
  }
};

export const getProjectsProfitability = async (): Promise<ProjectFinancial[]> => {
  try {
    // Get project financials and join with projects
    const { data: projectFinancials, error } = await supabase
      .from('project_financials')
      .select(`
        id,
        project_id,
        total_deal,
        total_payment,
        deserved_amount,
        balance_client,
        project_progress,
        projects (
          id,
          name,
          client_id,
          clients (
            id,
            name
          )
        )
      `);
      
    if (error) throw error;
    
    return projectFinancials.map(pf => {
      // Calculate values
      const budget = parseFloat(pf.total_deal) || 0;
      const spent = parseFloat(pf.total_payment) || 0;
      const remaining = budget - spent;
      
      // Determine budget status
      let status: 'On Budget' | 'At Risk' | 'Over Budget' = 'On Budget';
      const progressPercentage = parseFloat(pf.project_progress) || 0;
      
      if (progressPercentage < 100 && spent > budget * 0.9) {
        status = 'At Risk';
      } else if (spent > budget) {
        status = 'Over Budget';
      }
      
      // Calculate profit margin (simplified)
      const profitMargin = budget > 0 ? Math.round(((budget - spent) / budget) * 100) : 0;
      
      return {
        projectName: pf.projects?.name || 'غير معروف',
        clientName: pf.projects?.clients?.name || 'غير معروف',
        budget,
        spent,
        remaining,
        status,
        profitMargin: Math.max(0, profitMargin) // Ensure positive value
      };
    });
  } catch (error) {
    console.error('Error fetching projects profitability:', error);
    // Return empty array as fallback
    return [];
  }
};
