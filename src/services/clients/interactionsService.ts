
import { supabase } from "@/integrations/supabase/client";
import { Interaction } from "@/components/clients/types";
import { mapDbInteractionToInteraction } from "./clientsMappers";

export type DbInteraction = Database['public']['Tables']['interactions']['Row'];

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

// Import Database type
import { Database } from "@/integrations/supabase/types";
