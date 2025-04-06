
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FinancialTransaction {
  id: string;
  date: string;
  project_id?: number;
  project_number?: string;
  project_name?: string;
  client?: string;
  account_type: string;
  safe?: string;
  recipient?: string;
  operation_type: 'PAYMENT' | 'DEPOSIT';
  debit?: number;
  credit?: number;
  description?: string;
}

export interface AccountType {
  id: string;
  name: string;
}

export interface Safe {
  id: string;
  name: string;
}

export interface ProjectFinancialSummary {
  project_id: number;
  project_name: string;
  project_number?: string;
  client_name: string;
  total_deal: number;
  total_payment: number;
  deserved_amount: number;
  balance_client: number;
  project_progress: number;
}

export const getFinancialTransactions = async (filters?: {
  startDate?: string;
  endDate?: string;
  projectId?: number;
  accountType?: string;
  safe?: string;
}): Promise<FinancialTransaction[]> => {
  let query = supabase
    .from('financial_transactions')
    .select('*')
    .order('date', { ascending: false });

  if (filters) {
    if (filters.startDate) {
      query = query.gte('date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('date', filters.endDate);
    }
    if (filters.projectId) {
      query = query.eq('project_id', filters.projectId);
    }
    if (filters.accountType) {
      query = query.eq('account_type', filters.accountType);
    }
    if (filters.safe) {
      query = query.eq('safe', filters.safe);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching financial transactions:', error);
    throw error;
  }

  // Ensure correct typing by mapping the data
  return (data || []).map(transaction => ({
    ...transaction,
    operation_type: transaction.operation_type as 'PAYMENT' | 'DEPOSIT'
  }));
};

export const addFinancialTransaction = async (transaction: Omit<FinancialTransaction, 'id'>): Promise<FinancialTransaction> => {
  const { data, error } = await supabase
    .from('financial_transactions')
    .insert(transaction)
    .select()
    .single();

  if (error) {
    console.error('Error adding financial transaction:', error);
    throw error;
  }

  return {
    ...data,
    operation_type: data.operation_type as 'PAYMENT' | 'DEPOSIT'
  };
};

export const updateFinancialTransaction = async (id: string, transaction: Partial<FinancialTransaction>): Promise<FinancialTransaction> => {
  const { data, error } = await supabase
    .from('financial_transactions')
    .update(transaction)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating financial transaction:', error);
    throw error;
  }

  return {
    ...data,
    operation_type: data.operation_type as 'PAYMENT' | 'DEPOSIT'
  };
};

export const deleteFinancialTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('financial_transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting financial transaction:', error);
    throw error;
  }
};

export const getAccountTypes = async (): Promise<AccountType[]> => {
  const { data, error } = await supabase
    .from('account_types')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching account types:', error);
    throw error;
  }

  return data || [];
};

export const getSafes = async (): Promise<Safe[]> => {
  const { data, error } = await supabase
    .from('safes')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching safes:', error);
    throw error;
  }

  return data || [];
};

export const getProjectFinancialSummaries = async (): Promise<ProjectFinancialSummary[]> => {
  // Join projects with project_financials and clients to get summarized data
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      project_number,
      clients:client_id (name),
      project_financials!project_id (
        total_deal,
        total_payment,
        deserved_amount,
        balance_client,
        project_progress
      )
    `);

  if (error) {
    console.error('Error fetching project financial summaries:', error);
    throw error;
  }

  // Map and transform the data
  return (data || []).map(project => {
    const financials = project.project_financials?.[0] || {
      total_deal: 0,
      total_payment: 0,
      deserved_amount: 0,
      balance_client: 0,
      project_progress: 0
    };

    return {
      project_id: project.id,
      project_name: project.name,
      project_number: project.project_number,
      client_name: project.clients?.name || 'N/A',
      total_deal: financials.total_deal,
      total_payment: financials.total_payment,
      deserved_amount: financials.deserved_amount,
      balance_client: financials.balance_client,
      project_progress: financials.project_progress
    };
  });
};

export const getFinancialsSummary = async (): Promise<{
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingInvoices: number;
}> => {
  // Get sum of all credits (revenue)
  const { data: revenueData, error: revenueError } = await supabase
    .from('financial_transactions')
    .select('credit')
    .neq('credit', 0);

  if (revenueError) {
    console.error('Error fetching revenue:', revenueError);
    throw revenueError;
  }

  // Get sum of all debits (expenses)
  const { data: expensesData, error: expensesError } = await supabase
    .from('financial_transactions')
    .select('debit')
    .neq('debit', 0);

  if (expensesError) {
    console.error('Error fetching expenses:', expensesError);
    throw expensesError;
  }

  // Calculate totals
  const totalRevenue = revenueData.reduce((sum, item) => sum + (parseFloat(item.credit) || 0), 0);
  const totalExpenses = expensesData.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  // Get pending invoices from project_financials
  const { data: projectFinancials, error: projectFinancialsError } = await supabase
    .from('project_financials')
    .select('balance_client');

  if (projectFinancialsError) {
    console.error('Error fetching project financials:', projectFinancialsError);
    throw projectFinancialsError;
  }

  const pendingInvoices = projectFinancials.reduce((sum, item) => sum + (parseFloat(item.balance_client) || 0), 0);

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    pendingInvoices
  };
};

export const saveProjectFinancials = async (
  projectId: number, 
  data: {
    total_deal?: number;
    total_payment?: number;
    deserved_amount?: number;
    balance_client?: number;
    project_progress?: number;
    notes?: string;
  }
): Promise<void> => {
  // Check if project financials record exists
  const { data: existingData, error: checkError } = await supabase
    .from('project_financials')
    .select('id')
    .eq('project_id', projectId)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking project financials:', checkError);
    throw checkError;
  }

  if (existingData) {
    // Update existing record
    const { error: updateError } = await supabase
      .from('project_financials')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingData.id);

    if (updateError) {
      console.error('Error updating project financials:', updateError);
      throw updateError;
    }
  } else {
    // Create new record
    const { error: insertError } = await supabase
      .from('project_financials')
      .insert({
        project_id: projectId,
        ...data,
      });

    if (insertError) {
      console.error('Error creating project financials:', insertError);
      throw insertError;
    }
  }
};
