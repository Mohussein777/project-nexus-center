
import { getClientById, getClients, createClient, updateClient, deleteClient } from './clientsBaseService';
import { getClientContracts } from './contractsService';
import { getClientInteractions } from './interactionsService';
import { getClientSatisfactionMetrics } from './satisfactionService';
import { 
  mapDbClientToClient, 
  mapDbInteractionToClientInteraction,
  mapDbContractToClientContract
} from './clientsMappers';

export {
  getClientById,
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getClientContracts,
  getClientInteractions,
  getClientSatisfactionMetrics,
  mapDbClientToClient,
  mapDbInteractionToClientInteraction,
  mapDbContractToClientContract
};
