
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/components/clients/types";
import { mapDbClientToClient } from "./clientsMappers";
import { Database } from "@/integrations/supabase/types";

export type DbClient = Database['public']['Tables']['clients']['Row'];

// Get all clients
export const getClients = async (): Promise<Client[]> => {
  const { data: dbClients, error } = await supabase
    .from('clients')
    .select('*');

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }

  if (!dbClients) return [];

  // Get project counts for each client
  const projectCountPromises = dbClients.map(async (client) => {
    const { count, error } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', client.id);
    
    return { clientId: client.id, count: count || 0, error };
  });

  const projectCounts = await Promise.all(projectCountPromises);
  
  return dbClients.map(dbClient => {
    const projectCount = projectCounts.find(p => p.clientId === dbClient.id)?.count || 0;
    return {
      ...mapDbClientToClient(dbClient),
      projects: projectCount
    };
  });
};

// Get client by ID
export const getClientById = async (clientId: number): Promise<Client | null> => {
  const { data: dbClient, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();

  if (error) {
    console.error(`Error fetching client with ID ${clientId}:`, error);
    return null;
  }

  if (!dbClient) return null;

  // Get project count
  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId);

  return {
    ...mapDbClientToClient(dbClient),
    projects: projectCount || 0
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
