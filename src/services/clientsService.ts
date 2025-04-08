import { supabase } from "@/integrations/supabase/client";
import { Client, Interaction, Contract, SatisfactionMetric } from "@/components/clients/types";
import { Database } from "@/integrations/supabase/types";

export type DbClient = Database['public']['Tables']['clients']['Row'];
export type DbInteraction = Database['public']['Tables']['interactions']['Row'];
export type DbContract = Database['public']['Tables']['contracts']['Row'];
export type DbSatisfactionMetric = Database['public']['Tables']['satisfaction_metrics']['Row'];

// Convert DB types to frontend types
export const mapDbClientToClient = (dbClient: DbClient): Client => ({
  id: dbClient.id,
  name: dbClient.name,
  contact: dbClient.contact,
  email: dbClient.email,
  phone: dbClient.phone,
  location: dbClient.location,
  projects: 0, // This will be calculated separately
  status: dbClient.status as 'Active' | 'Inactive',
  type: dbClient.type as 'Corporate' | 'Government' | 'Individual',
  code: dbClient.code
});

export const mapDbInteractionToInteraction = (dbInteraction: DbInteraction): Interaction => ({
  id: dbInteraction.id,
  clientId: dbInteraction.client_id,
  type: dbInteraction.type as 'Meeting' | 'Call' | 'Email' | 'Note',
  date: dbInteraction.date,
  summary: dbInteraction.summary,
  employee: dbInteraction.employee,
  sentiment: dbInteraction.sentiment as 'Positive' | 'Neutral' | 'Negative' | undefined,
  followupDate: dbInteraction.followup_date || undefined,
});

export const mapDbContractToContract = (dbContract: DbContract): Contract => ({
  id: dbContract.id,
  clientId: dbContract.client_id,
  title: dbContract.title,
  startDate: dbContract.start_date,
  endDate: dbContract.end_date,
  value: dbContract.value,
  status: dbContract.status as 'Active' | 'Pending' | 'Expired',
  renewalAlert: dbContract.renewal_alert,
});

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

// Get client interactions
export const getClientInteractions = async (clientId: number): Promise<Interaction[]> => {
  const { data: dbInteractions, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false });

  if (error) {
    console.error(`Error fetching interactions for client ${clientId}:`, error);
    return [];
  }

  return (dbInteractions || []).map(mapDbInteractionToInteraction);
};

// Create a new interaction
export const createInteraction = async (interaction: Omit<Interaction, 'id'>): Promise<Interaction | null> => {
  const { data: dbInteraction, error } = await supabase
    .from('interactions')
    .insert({
      client_id: interaction.clientId,
      type: interaction.type,
      date: interaction.date,
      summary: interaction.summary,
      employee: interaction.employee,
      sentiment: interaction.sentiment,
      followup_date: interaction.followupDate,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating interaction:', error);
    return null;
  }

  return mapDbInteractionToInteraction(dbInteraction);
};

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

// Get client satisfaction metrics
export const getClientSatisfactionMetrics = async (clientId: number): Promise<SatisfactionMetric | null> => {
  // Get overall score (latest metric)
  const { data: latestMetric, error: latestError } = await supabase
    .from('satisfaction_metrics')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (latestError && latestError.code !== 'PGRST116') { // PGRST116 is "not found" error
    console.error(`Error fetching latest satisfaction metric for client ${clientId}:`, latestError);
    return null;
  }

  // Get all metrics for trend data
  const { data: allMetrics, error: trendsError } = await supabase
    .from('satisfaction_metrics')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: true });

  if (trendsError) {
    console.error(`Error fetching satisfaction trends for client ${clientId}:`, trendsError);
    return null;
  }

  // Get sentiment breakdown from interactions
  const { data: interactions, error: sentimentError } = await supabase
    .from('interactions')
    .select('sentiment')
    .eq('client_id', clientId)
    .not('sentiment', 'is', null);

  if (sentimentError) {
    console.error(`Error fetching sentiment data for client ${clientId}:`, sentimentError);
    return null;
  }

  // Count sentiments
  const sentimentCounts = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  interactions?.forEach(interaction => {
    if (interaction.sentiment === 'Positive') sentimentCounts.positive++;
    else if (interaction.sentiment === 'Neutral') sentimentCounts.neutral++;
    else if (interaction.sentiment === 'Negative') sentimentCounts.negative++;
  });

  // If no metrics exist yet, return null or a default
  if (!latestMetric) return null;

  return {
    clientId,
    overallScore: latestMetric.overall_score,
    trends: (allMetrics || []).map(metric => ({
      date: metric.date,
      score: metric.overall_score,
    })),
    sentimentBreakdown: sentimentCounts,
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

// Generate a new client code
const generateClientCode = async (): Promise<string> => {
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
  
  const lastCode = data[0].code;
  const codeNumber = parseInt(lastCode.split('-')[1], 10);
  const newNumber = codeNumber + 1;
  
  return `C-${newNumber.toString().padStart(3, '0')}`;
};
