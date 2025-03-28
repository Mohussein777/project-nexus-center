
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
  // In a real implementation, this would fetch from Supabase
  // For now, we'll return mock data that matches what's displayed in the UI
  
  return {
    totalRevenue: 427890,
    totalExpenses: 156240,
    netProfit: 271650,
    pendingInvoices: 84320,
    pendingInvoicesCount: 8,
    revenueGrowth: 12.5,
    expenseGrowth: 8.3,
    profitGrowth: 15.2
  };
};

export const getMonthlyFinancialData = async (): Promise<MonthlyFinancialData[]> => {
  // In a real implementation, this would fetch from Supabase
  // For now, we'll return mock data for the chart
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 20000,
    expenses: Math.floor(Math.random() * 30000) + 10000
  }));
};

export const getRecentInvoices = async (): Promise<Invoice[]> => {
  // In a real implementation, this would fetch from Supabase
  // For now, we'll return mock data that matches what's displayed in the UI
  
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
};

export const getProjectsProfitability = async (): Promise<ProjectFinancial[]> => {
  // In a real implementation, this would fetch from Supabase
  // For now, we'll return mock data that matches what's displayed in the UI
  
  return [
    {
      projectName: 'Al Hamra Tower',
      clientName: 'Al Hamra Real Estate',
      budget: 240000,
      spent: 156000,
      remaining: 84000,
      status: 'On Budget',
      profitMargin: 35
    },
    {
      projectName: 'Marina Residence',
      clientName: 'Gulf Developers',
      budget: 180000,
      spent: 135000,
      remaining: 45000,
      status: 'At Risk',
      profitMargin: 25
    },
    {
      projectName: 'Tech Park',
      clientName: 'Ministry of Technology',
      budget: 350000,
      spent: 252000,
      remaining: 98000,
      status: 'On Budget',
      profitMargin: 28
    },
    {
      projectName: 'Gulf Heights',
      clientName: 'Al Madina Group',
      budget: 210000,
      spent: 189000,
      remaining: 21000,
      status: 'Over Budget',
      profitMargin: 10
    },
    {
      projectName: 'Central Hospital',
      clientName: 'Ministry of Health',
      budget: 420000,
      spent: 294000,
      remaining: 126000,
      status: 'On Budget',
      profitMargin: 30
    }
  ];
};
