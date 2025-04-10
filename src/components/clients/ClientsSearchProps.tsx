
import { Client } from './types';

export interface ClientsSearchProps {
  onSearch?: (query: string, filters: Record<string, string>) => void;
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
  onClientAdded?: (client: Client) => void;
}
