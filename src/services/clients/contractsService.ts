import { supabase } from "@/integrations/supabase/client";
import { ClientContract, mapDbContractToClientContract } from "./clientsMappers";

export const getClientContracts = async (clientId: number): Promise<ClientContract[]> => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('client_id', clientId)
      .order('start_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching client contracts:", error);
      throw error;
    }
    
    return data.map(contract => mapDbContractToClientContract(contract));
  } catch (error) {
    console.error("Error in getClientContracts:", error);
    return [];
  }
};

export const createClientContract = async (contract: {
  client_id: number;
  title: string;
  value: number;
  status: string;
  start_date: string;
  end_date: string;
  renewal_alert?: boolean;
}): Promise<ClientContract | null> => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .insert(contract)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating client contract:", error);
      return null;
    }
    
    return mapDbContractToClientContract(data);
  } catch (error) {
    console.error("Error in createClientContract:", error);
    return null;
  }
};

export const updateClientContract = async (
  contractId: number,
  updates: {
    title?: string;
    value?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
    renewal_alert?: boolean;
  }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contracts')
      .update(updates)
      .eq('id', contractId);
    
    if (error) {
      console.error("Error updating client contract:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateClientContract:", error);
    return false;
  }
};

export const deleteClientContract = async (contractId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', contractId);
    
    if (error) {
      console.error("Error deleting client contract:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteClientContract:", error);
    return false;
  }
};

export const getContractById = async (contractId: number): Promise<ClientContract | null> => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single();
    
    if (error) {
      console.error("Error fetching contract by ID:", error);
      return null;
    }
    
    return mapDbContractToClientContract(data);
  } catch (error) {
    console.error("Error in getContractById:", error);
    return null;
  }
};
