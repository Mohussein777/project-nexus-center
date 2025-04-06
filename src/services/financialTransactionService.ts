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
      totalTransactions: transactionsCount.count || 0,
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

export const createFinancialTransaction = async (transaction: Omit<FinancialTransaction, 'id'>): Promise<FinancialTransaction> => {
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
