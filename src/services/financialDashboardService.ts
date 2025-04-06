
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';

// Financial summary interface
export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  pendingInvoices: number;
  pendingInvoicesCount: number;
  revenueGrowth: number;
  profitGrowth: number;
}

// Monthly financial data interface
export interface MonthlyData {
  month: string;
  totalIncome: number;
  totalExpenses: number;
}

// Function to get financial summary with period filter
export const getFinancialSummary = async (period: string = 'month'): Promise<FinancialSummary> => {
  try {
    // In a real app, we would use the period parameter to filter data
    // Here we'll return simulated data
    return {
      totalRevenue: 245000,
      totalExpenses: 128000,
      pendingInvoices: 78500,
      pendingInvoicesCount: 8,
      revenueGrowth: 12.5,
      profitGrowth: 18.7
    };
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    throw error;
  }
};

// Function to get monthly financial data
export const getMonthlyFinancialData = async () => {
  try {
    // In a real app, this would fetch data from the database
    const monthlyAverages = [
      { month: '2023-01', totalIncome: 180000, totalExpenses: 120000 },
      { month: '2023-02', totalIncome: 195000, totalExpenses: 115000 },
      { month: '2023-03', totalIncome: 220000, totalExpenses: 125000 },
      { month: '2023-04', totalIncome: 200000, totalExpenses: 130000 },
      { month: '2023-05', totalIncome: 240000, totalExpenses: 128000 },
    ];
    
    // Calculate changes
    const totalIncome = monthlyAverages[monthlyAverages.length - 1].totalIncome;
    const totalExpenses = monthlyAverages[monthlyAverages.length - 1].totalExpenses;
    const previousMonthIncome = monthlyAverages[monthlyAverages.length - 2].totalIncome;
    const previousMonthExpense = monthlyAverages[monthlyAverages.length - 2].totalExpenses;
    
    const incomeChange = ((totalIncome - previousMonthIncome) / previousMonthIncome) * 100;
    const expenseChange = ((totalExpenses - previousMonthExpense) / previousMonthExpense) * 100;
    
    return {
      monthlyAverages,
      totalIncome: formatCurrency(totalIncome),
      totalExpenses: formatCurrency(totalExpenses),
      incomeChange,
      expenseChange
    };
  } catch (error) {
    console.error('Error fetching monthly financial data:', error);
    throw error;
  }
};

// Function to get recent invoices
export const getRecentInvoices = async () => {
  try {
    // In a real app, this would fetch data from the database
    return [
      { id: 1, client: 'شركة الإنماء', amount: 15000, status: 'pending', date: '2023-05-15' },
      { id: 2, client: 'مؤسسة الإعمار', amount: 22000, status: 'paid', date: '2023-05-10' },
      { id: 3, client: 'شركة البناء الحديث', amount: 9500, status: 'overdue', date: '2023-04-28' },
    ];
  } catch (error) {
    console.error('Error fetching recent invoices:', error);
    throw error;
  }
};

// Function to get projects profitability
export const getProjectsProfitability = async () => {
  try {
    // In a real app, this would fetch data from the database
    return [
      { id: 1, name: 'مشروع الواحة', budget: 350000, spent: 180000, profit: 40000, progress: 65 },
      { id: 2, name: 'برج النخيل', budget: 520000, spent: 220000, profit: 85000, progress: 45 },
      { id: 3, name: 'مجمع الأمل', budget: 280000, spent: 95000, profit: 35000, progress: 35 },
    ];
  } catch (error) {
    console.error('Error fetching projects profitability:', error);
    throw error;
  }
};
