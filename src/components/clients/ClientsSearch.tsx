
import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ClientFormDialog } from './ClientFormDialog';
import { Client } from './types';

interface ClientsSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClientAdded?: (client: Client) => void;
}

export function ClientsSearch({ searchQuery, setSearchQuery, onClientAdded }: ClientsSearchProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="البحث عن العملاء..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm w-60 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-gray-800"
          />
        </div>
        
        <Button variant="outline" size="sm" className="gap-1">
          <Filter size={16} />
          <span>تصفية</span>
        </Button>
        
        <Button size="sm" className="gap-1" onClick={() => setIsDialogOpen(true)}>
          <Plus size={16} />
          <span>عميل جديد</span>
        </Button>
      </div>
      
      <ClientFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onClientAdded={onClientAdded}
      />
    </>
  );
}
