
import { supabase } from "@/integrations/supabase/client";
import { Contract } from "@/components/clients/types";
import { mapDbContractToContract } from "./clientsMappers";
import { Database } from "@/integrations/supabase/types";

export type DbContract = Database['public']['Tables']['contracts']['Row'];

// Get client contracts
export const getClientContracts = async (clientId: number): Promise<Contract[]> => {
  const { data: dbContracts, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('client_id', clientId)
    .order('end_date', { ascending: true });

  if (error) {
    console.error(`Error fetching contracts for client ${clientId}:`, error);
    return [];
  }

  return (dbContracts || []).map(mapDbContractToContract);
};

// Create a new contract
export const createContract = async (contract: Omit<Contract, 'id'>): Promise<Contract | null> => {
  const { data: dbContract, error } = await supabase
    .from('contracts')
    .insert({
      client_id: contract.clientId,
      title: contract.title,
      start_date: contract.startDate,
      end_date: contract.endDate,
      value: contract.value,
      status: contract.status,
      renewal_alert: contract.renewalAlert,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating contract:', error);
    return null;
  }

  return mapDbContractToContract(dbContract);
};
