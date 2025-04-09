import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/components/clients/types";
import { mapDbClientToClient } from "./clientsMappers";
import { Database } from "@/integrations/supabase/types";

export type DbClient = Database['public']['Tables']['clients']['Row'];

// Get all clients
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
    ...mapDbClientToClient(dbClient),
    projects: [] // Projects are loaded separately
  }));
};

// Get client by ID
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
  
  if (!dbClient) return null;
  
  return {
    ...mapDbClientToClient(dbClient),
    projects: [] // Projects are loaded separately
  };
};

// Create a new client
export const createClient = async (client: Omit<Client, 'id' | 'projects' | 'code'>): Promise<Client | null> => {
  const clientCode = await generateClientCode();
  
  const { data: dbClient, error } = await supabase
    .from('clients')
    .insert({
      name: client.name,
      contact: client.contact,
      email: client.email,
      phone: client.phone,
      location: client.location,
      type: client.type,
      status: client.status,
      code: clientCode
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating client:', error);
    return null;
  }

  return {
    ...mapDbClientToClient(dbClient),
    projects: 0 // New client has no projects
  };
};

// Update a client
export const updateClient = async (id: number, client: Partial<Omit<Client, 'id' | 'projects'>>): Promise<boolean> => {
  const { error } = await supabase
    .from('clients')
    .update({
      name: client.name,
      contact: client.contact,
      email: client.email,
      phone: client.phone,
      location: client.location,
      type: client.type,
      status: client.status,
      code: client.code
    })
    .eq('id', id);

  if (error) {
    console.error(`Error updating client ${id}:`, error);
    return false;
  }

  return true;
};

// Generate a new client code
export const generateClientCode = async (): Promise<string> => {
  const { data, error } = await supabase
    .from('clients')
    .select('code')
    .order('code', { ascending: false })
    .limit(1);
  
  if (error) {
    console.error('Error fetching latest client code:', error);
    return 'C-001'; // Default code if fetching fails
  }
  
  if (!data || data.length === 0) {
    return 'C-001'; // Default code if no clients exist
  }
  
  // Handle case where code might be null in the database
  const lastCode = data[0]?.code || 'C-000';
  const codeNumber = parseInt(lastCode.split('-')[1], 10);
  const newNumber = codeNumber + 1;
  
  return `C-${newNumber.toString().padStart(3, '0')}`;
};

// Search clients by query
export const searchClients = async (query: string): Promise<Client[]> => {
  const { data: dbClients, error } = await supabase
    .from('clients')
    .select('*')
    .or(`name.ilike.%${query}%, email.ilike.%${query}%, location.ilike.%${query}%, code.ilike.%${query}%`)
    .order('name');
  
  if (error) {
    console.error('Error searching clients:', error);
    return [];
  }
  
  return (dbClients || []).map(dbClient => ({
    ...mapDbClientToClient(dbClient),
    projects: [] // Projects are loaded separately
  }));
};
