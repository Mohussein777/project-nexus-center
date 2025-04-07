import { supabase } from '@/integrations/supabase/client';

// Define types
export interface FinancialTransaction {
  id: string;
  date: string;
  project_id?: number;
  project_name?: string;
  project_number?: string;
  client?: string;
  account_type: string;
  safe?: string;
  recipient?: string;
  operation_type: string; // Changed from "PAYMENT" | "DEPOSIT" to string to match actual data
  debit?: number;
  credit?: number;
  description?: string;
  created_at: string;
  currency?: string; // Add currency field
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
  [key: string]: any; // For sorting flexibility
}

// Limit the depth of type inference to address the Type instantiation is excessively deep issue
export async function getTransactions(options: {
  filter?: any;
  limit?: number;
  offset?: number;
  search?: string;
}) {
  try {
    let query = supabase
      .from('financial_transactions')
      .select('*');

    // Add filters if provided
    if (options.filter) {
      const { startDate, endDate, operationType, accountType } = options.filter;
      
      if (startDate) {
        query = query.gte('date', startDate);
      }
      
      if (endDate) {
        query = query.lte('date', endDate);
      }
      
      if (operationType) {
        query = query.eq('operation_type', operationType);
      }
      
      if (accountType) {
        query = query.eq('account_type', accountType);
      }
    }
    
    // Add search if provided
    if (options.search) {
      query = query.or(`description.ilike.%${options.search}%, recipient.ilike.%${options.search}%, client.ilike.%${options.search}%`);
    }
    
    // Add pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    // Order by date, most recent first
    query = query.order('date', { ascending: false });
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return { data, count };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

// Alias for getTransactions to match component import
export async function getFinancialTransactions(options: {
  filter?: any;
  limit?: number;
  offset?: number;
  search?: string;
} = {}) {
  return getTransactions(options);
}

export async function addTransaction(transactionData: any) {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert([transactionData]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
}

// Alias for addTransaction to match component import
export async function addFinancialTransaction(transactionData: any) {
  return addTransaction(transactionData);
}

export async function updateTransaction(id: string, transactionData: any) {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .update(transactionData)
      .eq('id', id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}

// Alias for updateTransaction to match component import
export async function updateFinancialTransaction(id: string, transactionData: any) {
  return updateTransaction(id, transactionData);
}

export async function deleteTransaction(id: string) {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}

// Alias for deleteTransaction to match component import
export async function deleteFinancialTransaction(id: string) {
  return deleteTransaction(id);
}

// New functions to match component imports
export async function getAccountTypes() {
  try {
    const { data, error } = await supabase
      .from('account_types')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching account types:', error);
    return [];
  }
}

export async function getSafes() {
  try {
    const { data, error } = await supabase
      .from('safes')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching safes:', error);
    return [];
  }
}

export async function getFinancialsSummary() {
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

    // Get pending invoices (mock data for now)
    const pendingInvoices = 15000; // Mock value

    const totalRevenue = revenueData.reduce((sum, item) => sum + (item.credit || 0), 0);
    const totalExpenses = expenseData.reduce((sum, item) => sum + (item.debit || 0), 0);
    const netProfit = totalRevenue - totalExpenses;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      pendingInvoices
    };
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      pendingInvoices: 0
    };
  }
}

export async function getProjectFinancialSummaries() {
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
        projects (
          name
        )
      `);
      
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      project_id: item.project_id || 0,
      project_name: item.projects?.name || 'Unknown Project',
      total_deal: item.total_deal || 0,
      total_payment: item.total_payment || 0,
      deserved_amount: item.deserved_amount || 0,
      balance_client: item.balance_client || 0,
      project_progress: item.project_progress || 0
    })) as ProjectFinancialSummary[];
  } catch (error) {
    console.error('Error fetching project financial summaries:', error);
    return [];
  }
}

export async function saveProjectFinancials(projectId: number, financialData: any) {
  try {
    // Check if project already has financial data
    const { data: existingData, error: fetchError } = await supabase
      .from('project_financials')
      .select('id')
      .eq('project_id', projectId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError; // PGRST116 is "No rows returned"
    
    let result;
    
    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('project_financials')
        .update(financialData)
        .eq('id', existingData.id)
        .select();
        
      if (error) throw error;
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('project_financials')
        .insert([{ project_id: projectId, ...financialData }])
        .select();
        
      if (error) throw error;
      result = data;
    }
    
    return result;
  } catch (error) {
    console.error('Error saving project financials:', error);
    throw error;
  }
}
