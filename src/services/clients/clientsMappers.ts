
import { DbClient } from "./clientsBaseService";
import { Client, Interaction, Contract } from "@/components/clients/types";
import { DbInteraction } from "./interactionsService";
import { DbContract } from "./contractsService";

export const mapDbClientToClient = (dbClient: DbClient): Omit<Client, 'projects'> => {
  return {
    id: dbClient.id,
    name: dbClient.name,
    contact: dbClient.contact,
    email: dbClient.email,
    phone: dbClient.phone,
    location: dbClient.location,
    type: dbClient.type as "Corporate" | "Government" | "Individual",
    status: dbClient.status as "Active" | "Inactive",
    code: dbClient.code || '',
  };
};

export const mapDbInteractionToInteraction = (dbInteraction: DbInteraction): Interaction => {
  return {
    id: dbInteraction.id,
    clientId: dbInteraction.client_id,
    type: dbInteraction.type as "Meeting" | "Call" | "Email" | "Note",
    date: dbInteraction.date,
    summary: dbInteraction.summary,
    employee: dbInteraction.employee,
    sentiment: dbInteraction.sentiment as "Positive" | "Neutral" | "Negative" | undefined,
    followupDate: dbInteraction.followup_date,
  };
};

export const mapDbContractToContract = (dbContract: DbContract): Contract => {
  return {
    id: dbContract.id,
    clientId: dbContract.client_id,
    title: dbContract.title,
    startDate: dbContract.start_date,
    endDate: dbContract.end_date,
    value: dbContract.value,
    status: dbContract.status as "Active" | "Completed" | "Pending" | "Cancelled",
    renewalAlert: dbContract.renewal_alert,
  };
};
