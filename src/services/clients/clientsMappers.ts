
import { Client } from "@/components/clients/types";
import { DbClient } from "./clientsBaseService";

export const mapDbClientToClient = (dbClient: DbClient): Omit<Client, 'projects'> => {
  return {
    id: dbClient.id,
    name: dbClient.name,
    contact: dbClient.contact,
    email: dbClient.email,
    location: dbClient.location,
    phone: dbClient.phone || '',
    status: dbClient.status === 'Active' ? 'Active' : 'Inactive',
    type: getClientType(dbClient.type),
    code: dbClient.code || `CL-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
  };
};

const getClientType = (type: string): 'Corporate' | 'Government' | 'Individual' => {
  switch (type) {
    case 'Corporate':
      return 'Corporate';
    case 'Government':
      return 'Government';
    case 'Individual':
      return 'Individual';
    default:
      return 'Corporate';
  }
};

export interface ClientContract {
  id: number;
  title: string;
  value: number;
  status: 'Active' | 'Pending' | 'Expired';
  startDate: string;
  endDate: string;
  renewalAlert: boolean;
}

export const mapDbContractToClientContract = (contract: any): ClientContract => {
  return {
    id: contract.id,
    title: contract.title,
    value: contract.value,
    status: getContractStatus(contract.status),
    startDate: contract.start_date,
    endDate: contract.end_date,
    renewalAlert: contract.renewal_alert || false
  };
};

const getContractStatus = (status: string): 'Active' | 'Pending' | 'Expired' => {
  switch (status) {
    case 'Active':
      return 'Active';
    case 'Pending':
      return 'Pending';
    case 'Expired':
      return 'Expired';
    case 'Completed':
      return 'Expired'; // Map 'Completed' to 'Expired'
    case 'Cancelled':
      return 'Expired'; // Map 'Cancelled' to 'Expired'
    default:
      return 'Pending';
  }
};

export interface ClientInteraction {
  id: number;
  date: string;
  type: string;
  employee: string;
  summary: string;
  sentiment: string;
  followupDate?: string;
}

export const mapDbInteractionToClientInteraction = (interaction: any): ClientInteraction => {
  return {
    id: interaction.id,
    date: interaction.date,
    type: interaction.type,
    employee: interaction.employee,
    summary: interaction.summary,
    sentiment: interaction.sentiment || 'Neutral',
    followupDate: interaction.followup_date
  };
};
