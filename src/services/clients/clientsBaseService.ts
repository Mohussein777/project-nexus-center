
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/components/clients/types";
import { mapDbClientToClient } from "./clientsMappers";

export interface DbClient {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  location: string;
  type: string;
  status: string;
  created_at: string;
  code?: string;
}

export const getClients = async (): Promise<Client[]> => {
  const { data: dbClients, error } = await supabase
    .from('clients')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  
  return (dbClients || []).map(dbClient => ({
    ...mapDbClientToClient(dbClient as DbClient),
    projects: 0 // Projects are loaded separately
  }));
};

export const getClientById = async (id: number): Promise<Client | null> => {
  const { data: dbClient, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching client with ID ${id}:`, error);
    return null;
  }
  
  return {
    ...mapDbClientToClient(dbClient as DbClient),
    projects: 0 // Projects are loaded separately
  };
};

export const createClient = async (client: {
  name: string;
  contact: string;
  email: string;
  phone: string;
  location: string;
  type: string;
  status: string;
  code: string;
}): Promise<Client | null> => {
  const { data: newClient, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating client:', error);
    return null;
  }
  
  return {
    ...mapDbClientToClient(newClient as DbClient),
    projects: 0 // Can't have projects yet
  };
};

export const updateClient = async (
  id: number,
  updates: {
    name?: string;
    contact?: string;
    email?: string;
    phone?: string;
    location?: string;
    type?: string;
    status?: string;
    code?: string;
  }
): Promise<boolean> => {
  // Handle nullable fields correctly
  const updatesWithNulls = { ...updates };
  if (updates.phone === '') updatesWithNulls.phone = null;
  
  const { error } = await supabase
    .from('clients')
    .update(updatesWithNulls)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating client with ID ${id}:`, error);
    return false;
  }
  
  return true;
};

export const deleteClient = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting client with ID ${id}:`, error);
    return false;
  }
  
  return true;
};

export const searchClients = async (searchTerm: string): Promise<Client[]> => {
  const { data: dbClients, error } = await supabase
    .from('clients')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%${searchTerm.length > 0 ? `,code.ilike.%${searchTerm}%` : ''}`)
    .order('name');
  
  if (error) {
    console.error('Error searching clients:', error);
    return [];
  }
  
  return (dbClients || []).map(dbClient => ({
    ...mapDbClientToClient(dbClient as DbClient),
    projects: 0 // Projects are loaded separately
  }));
};

export const filterClients = async (filters: {
  status?: string;
  type?: string;
}): Promise<Client[]> => {
  // Start with base query
  let query = supabase.from('clients').select('*');
  
  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.type) {
    query = query.eq('type', filters.type);
  }
  
  // Execute query
  const { data: dbClients, error } = await query.order('name');
  
  if (error) {
    console.error('Error filtering clients:', error);
    return [];
  }
  
  return (dbClients || []).map(dbClient => ({
    ...mapDbClientToClient(dbClient as DbClient),
    projects: 0 // Projects are loaded separately
  }));
};
