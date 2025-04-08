
// Re-export everything from the individual service files
export * from './clientsBaseService';
export * from './interactionsService';
export * from './contractsService';
export * from './satisfactionService';
// Export only the mapper functions, not the types from mappers to avoid conflicts
export { 
  mapDbClientToClient, 
  mapDbInteractionToInteraction, 
  mapDbContractToContract 
} from './clientsMappers';
