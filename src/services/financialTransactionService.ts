
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';

export interface FinancialTransaction {
  id: string;
  date: string;
  account_type: string;
  operation_type: string;
  description?: string;
  recipient?: string;
  credit?: number;
  debit?: number;
  project_name?: string;
  project_id?: number;
  safe?: string;
  client?: string;
}

export interface FinancialTransactionStats {
  totalTransactions: number;
  totalIncome: string;
  totalExpenses: string;
  accountBalances: { account_type: string; balance: string; }[];
}

export interface MonthlyFinancialData {
  month: string;
  totalIncome: string;
  totalExpenses: string;
  incomeChange: number;
  expenseChange: number;
}

export interface ProjectFinancialSummary {
  id: string;
  project_id: number;
  project_name: string;
  total_deal: number;
  total_payment: number;
  deserved_amount: number;
  balance_client: number;
  project_progress: number;
}

export const getFinancialTransactionStats = async () => {
  try {
    const { data: transactionsCount, error: transactionsCountError } = await supabase
      .from('financial_transactions')
      .select('*', { count: 'exact' });

    if (transactionsCountError) {
      throw transactionsCountError;
    }

    const { data: totalIncomeData, error: totalIncomeError } = await supabase
      .from('financial_transactions')
      .select('credit')
      .not('credit', 'is', null);

    if (totalIncomeError) {
      throw totalIncomeError;
    }

    const totalIncome = totalIncomeData?.reduce((sum, transaction) => sum + (transaction.credit || 0), 0) || 0;

    const { data: totalExpensesData, error: totalExpensesError } = await supabase
      .from('financial_transactions')
      .select('debit')
      .not('debit', 'is', null);

    if (totalExpensesError) {
      throw totalExpensesError;
    }

    const totalExpenses = totalExpensesData?.reduce((sum, transaction) => sum + (transaction.debit || 0), 0) || 0;

    const { data: accountBalances, error: accountBalancesError } = await supabase
      .from('financial_transactions')
      .select('account_type, credit, debit');

    if (accountBalancesError) {
      throw accountBalancesError;
    }

    const accountBalancesMap: { [key: string]: number } = {};

    accountBalances?.forEach(transaction => {
      if (transaction.account_type) {
        if (!accountBalancesMap[transaction.account_type]) {
          accountBalancesMap[transaction.account_type] = 0;
        }
        accountBalancesMap[transaction.account_type] += (transaction.credit || 0) - (transaction.debit || 0);
      }
    });

    const accountBalancesArray = Object.entries(accountBalancesMap).map(([account_type, balance]) => ({
      account_type,
      balance
    }));

    return {
      totalTransactions: transactionsCount?.length || 0,
      totalIncome: formatCurrency((totalIncome || 0).toString()),
      totalExpenses: formatCurrency((totalExpenses || 0).toString()),
      accountBalances: accountBalancesArray.map(account => ({
        ...account,
        balance: formatCurrency(account.balance.toString())
      }))
    };
  } catch (error) {
    console.error("Error fetching financial transaction stats:", error);
    throw error;
  }
};

export const getFinancialTransactions = async (page: number = 1, pageSize: number = 10, sortBy: string = 'date', sortOrder: string = 'asc', filters: any = {}): Promise<{ data: FinancialTransaction[], count: number }> => {
  try {
    let query = supabase
      .from('financial_transactions')
      .select('*', { count: 'exact' });

    // Apply filters
    Object.entries(filters).forEach(([key, value]: [string, any]) => {
      if (value) {
        query = query.eq(key, value);
      }
    });

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    query = query.range(startIndex, startIndex + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return { data: data || [], count: count || 0 };
  } catch (error) {
    console.error("Error fetching financial transactions:", error);
    throw error;
  }
};

// Function that was missing in the service
export const addFinancialTransaction = async (transaction: Omit<FinancialTransaction, 'id'>): Promise<FinancialTransaction> => {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as FinancialTransaction;
  } catch (error) {
    console.error("Error creating financial transaction:", error);
    throw error;
  }
};

export const updateFinancialTransaction = async (id: string, updates: Partial<FinancialTransaction>): Promise<FinancialTransaction | null> => {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as FinancialTransaction;
  } catch (error) {
    console.error("Error updating financial transaction:", error);
    return null;
  }
};

export const deleteFinancialTransaction = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error deleting financial transaction:", error);
    return false;
  }
};

export const getMonthlyFinancialData = async () => {
  try {
    const { data: monthlyData, error: monthlyDataError } = await supabase
      .from('financial_transactions')
      .select(`
        date,
        credit,
        debit
      `);

    if (monthlyDataError) {
      throw monthlyDataError;
    }

    const monthlySummary: { [key: string]: { totalIncome: number; totalExpenses: number; } } = {};

    monthlyData.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthYear = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlySummary[monthYear]) {
        monthlySummary[monthYear] = {
          totalIncome: 0,
          totalExpenses: 0,
        };
      }

      monthlySummary[monthYear].totalIncome += transaction.credit || 0;
      monthlySummary[monthYear].totalExpenses += transaction.debit || 0;
    });

    const monthlyAverages = Object.entries(monthlySummary).map(([month, totals]) => {
      return {
        month,
        totalIncome: totals.totalIncome,
        totalExpenses: totals.totalExpenses,
      };
    });

    let previousMonthIncome = 0;
    let previousMonthExpense = 0;

    if (monthlyAverages.length > 1) {
      previousMonthIncome = monthlyAverages[monthlyAverages.length - 2].totalIncome;
      previousMonthExpense = monthlyAverages[monthlyAverages.length - 2].totalExpenses;
    }

    const totalIncome = monthlyAverages.length > 0 ? monthlyAverages[monthlyAverages.length - 1].totalIncome : 0;
    const totalExpenses = monthlyAverages.length > 0 ? monthlyAverages[monthlyAverages.length - 1].totalExpenses : 0;

    const incomeChange = previousMonthIncome !== 0 ? ((totalIncome - previousMonthIncome) / previousMonthIncome) * 100 : 0;
    const expenseChange = previousMonthExpense !== 0 ? ((totalExpenses - previousMonthExpense) / previousMonthExpense) * 100 : 0;

    const response = {
      monthlyAverages,
      totalIncome: formatCurrency(totalIncome.toString()),
      totalExpenses: formatCurrency(totalExpenses.toString()),
      incomeChange,
      expenseChange
    };

    return response;
  } catch (error) {
    console.error("Error fetching monthly financial data:", error);
    throw error;
  }
};

export const getFinancialsSummary = async () => {
  try {
    const { data: incomeData, error: incomeError } = await supabase
      .from('financial_transactions')
      .select('credit')
      .not('credit', 'is', null);

    if (incomeError) throw incomeError;

    const { data: expensesData, error: expensesError } = await supabase
      .from('financial_transactions')
      .select('debit')
      .not('debit', 'is', null);

    if (expensesError) throw expensesError;

    const totalRevenue = incomeData.reduce((sum, item) => sum + (item.credit || 0), 0);
    const totalExpenses = expensesData.reduce((sum, item) => sum + (item.debit || 0), 0);
    const netProfit = totalRevenue - totalExpenses;

    // Mock data for pending invoices until we have a proper invoices table
    const pendingInvoices = 25000;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      pendingInvoices
    };
  } catch (error) {
    console.error("Error fetching financials summary:", error);
    throw error;
  }
};

export const getProjectFinancialSummaries = async (): Promise<ProjectFinancialSummary[]> => {
  try {
    const { data, error } = await supabase
      .from('project_financials')
      .select(`
        id,
        project_id,
        total_deal,
        total_payment,
        deserved_amount,
        balance_client,
        project_progress,
        projects(name)
      `);

    if (error) throw error;

    // Format the data to include project_name
    return (data || []).map(item => ({
      id: item.id,
      project_id: item.project_id || 0,
      project_name: item.projects?.name || 'Unknown Project',
      total_deal: item.total_deal || 0,
      total_payment: item.total_payment || 0,
      deserved_amount: item.deserved_amount || 0,
      balance_client: item.balance_client || 0,
      project_progress: item.project_progress || 0
    }));
  } catch (error) {
    console.error("Error fetching project financial summaries:", error);
    return [];
  }
};

export const saveProjectFinancials = async (projectFinancials: Partial<ProjectFinancialSummary>): Promise<ProjectFinancialSummary | null> => {
  try {
    const { id, project_name, ...rest } = projectFinancials;
    
    if (id) {
      // Update existing record
      const { data, error } = await supabase
        .from('project_financials')
        .update(rest)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the project_name back since it's not stored in the database
      return {
        ...data,
        project_name: project_name || 'Unknown Project'
      } as ProjectFinancialSummary;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('project_financials')
        .insert([rest])
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the project_name back since it's not stored in the database
      return {
        ...data,
        project_name: project_name || 'Unknown Project'
      } as ProjectFinancialSummary;
    }
  } catch (error) {
    console.error("Error saving project financials:", error);
    return null;
  }
};

export const getAccountTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('account_types')
      .select('id, name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching account types:", error);
    return [];
  }
};

export const getSafes = async () => {
  try {
    const { data, error } = await supabase
      .from('safes')
      .select('id, name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching safes:", error);
    return [];
  }
};
