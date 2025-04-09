
import { DbClient } from "./clientsBaseService";
import { Client } from "@/components/clients/types";

export const mapDbClientToClient = (dbClient: DbClient): Omit<Client, 'projects'> => {
  return {
    id: dbClient.id,
    name: dbClient.name,
    contact: dbClient.contact,
    email: dbClient.email,
    phone: dbClient.phone,
    location: dbClient.location,
    type: dbClient.type,
    status: dbClient.status,
    code: dbClient.code || '',
  };
};
