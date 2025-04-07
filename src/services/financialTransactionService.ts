// Import the simplified Database type without the complex type structure
import { supabase } from '@/integrations/supabase/client';

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
