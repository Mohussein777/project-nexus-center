
import { Client, Interaction, Contract, SatisfactionMetric } from "@/components/clients/types";
import { Database } from "@/integrations/supabase/types";

export type DbClient = Database['public']['Tables']['clients']['Row'];
export type DbInteraction = Database['public']['Tables']['interactions']['Row'];
export type DbContract = Database['public']['Tables']['contracts']['Row'];
export type DbSatisfactionMetric = Database['public']['Tables']['satisfaction_metrics']['Row'];

// Convert DB types to frontend types
export const mapDbClientToClient = (dbClient: DbClient): Omit<Client, 'projects'> => ({
  id: dbClient.id,
  name: dbClient.name,
  contact: dbClient.contact,
  email: dbClient.email,
  phone: dbClient.phone,
  location: dbClient.location,
  status: dbClient.status as 'Active' | 'Inactive',
  type: dbClient.type as 'Corporate' | 'Government' | 'Individual',
  code: dbClient.code || ''
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
