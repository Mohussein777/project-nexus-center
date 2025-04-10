
import { supabase } from "@/integrations/supabase/client";
import { ClientInteraction, mapDbInteractionToClientInteraction } from "./clientsMappers";
import { Interaction } from "@/components/clients/types";

export const getClientInteractions = async (clientId: number): Promise<ClientInteraction[]> => {
  try {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Error fetching client interactions:", error);
      throw error;
    }
    
    return data.map(interaction => mapDbInteractionToClientInteraction(interaction));
  } catch (error) {
    console.error("Error in getClientInteractions:", error);
    return [];
  }
};

export const createInteraction = async (clientId: number, interaction: Omit<Interaction, 'id'>): Promise<Interaction | null> => {
  try {
    const { data, error } = await supabase
      .from('interactions')
      .insert({
        clientid: clientId,
        date: interaction.date,
        type: interaction.type,
        employee: interaction.employee,
        summary: interaction.summary,
        sentiment: interaction.sentiment,
        followup_date: interaction.followupDate
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating client interaction:", error);
      return null;
    }
    
    return {
      id: data.id,
      clientId: data.clientid,
      date: data.date,
      type: data.type as 'Meeting' | 'Call' | 'Email' | 'Note',
      employee: data.employee,
      summary: data.summary,
      sentiment: data.sentiment as 'Positive' | 'Neutral' | 'Negative' | undefined,
      followupDate: data.followup_date
    };
  } catch (error) {
    console.error("Error in createInteraction:", error);
    return null;
  }
};

export const updateClientInteraction = async (interactionId: number, updates: Partial<Omit<ClientInteraction, 'id'>>): Promise<boolean> => {
  try {
    // Convert from camelCase to snake_case for DB
    const dbUpdates: any = {};
    if (updates.date) dbUpdates.date = updates.date;
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.employee) dbUpdates.employee = updates.employee;
    if (updates.summary) dbUpdates.summary = updates.summary;
    if (updates.sentiment) dbUpdates.sentiment = updates.sentiment;
    if ('followupDate' in updates) dbUpdates.followup_date = updates.followupDate;
    
    const { error } = await supabase
      .from('interactions')
      .update(dbUpdates)
      .eq('id', interactionId);
    
    if (error) {
      console.error("Error updating client interaction:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateClientInteraction:", error);
    return false;
  }
};

export const deleteClientInteraction = async (interactionId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('interactions')
      .delete()
      .eq('id', interactionId);
    
    if (error) {
      console.error("Error deleting client interaction:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteClientInteraction:", error);
    return false;
  }
};
