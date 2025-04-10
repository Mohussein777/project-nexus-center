
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter } from 'lucide-react';
import { ClientFormDialog } from './ClientFormDialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface Client {
  id: number;
  name: string;
  status: string;
  type: string;
  email: string;
  phone: string;
  contact: string;
}

interface ClientsSearchProps {
  onSearch: (query: string, filters: Record<string, string>) => void;
  onClientAdded?: (client: Client) => void;
}

export function ClientsSearch({ onSearch, onClientAdded }: ClientsSearchProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({
    status: '',
    type: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };
  
  const handleClientAdded = (client: Client) => {
    if (onClientAdded) {
      onClientAdded(client);
    }
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('searchClients')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="default">
          {t('search')}
        </Button>
        <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4 mr-2" />
          {t('filter')}
        </Button>
        <Button type="button" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addClient')}
        </Button>
      </form>
      
      <ClientFormDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}
