
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ClientCard } from './ClientCard';
import { ClientFormDialog } from './ClientFormDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Client, ClientsGridProps } from './types';

export function ClientsGrid({ 
  clients,
  onClientUpdated,
  onClientDeleted,
  onClientSelect,
  loading,
  searchQuery,
  onClientAdded
}: ClientsGridProps) {
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleClientAdded = (client: Client) => {
    console.log('Client added:', client);
    if (onClientAdded) {
      onClientAdded(client);
    }
  };
  
  const handleClientClicked = (clientId: number) => {
    if (onClientSelect) {
      onClientSelect(clientId);
    } else {
      window.location.href = `/clients/${clientId}`;
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('clients')}</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addClient')}
        </Button>
      </div>
      
      {clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery ? t('noClientsMatchingSearch') : t('noClientsFound')}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('addClient')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              onClick={() => handleClientClicked(client.id)}
              onEdit={onClientUpdated}
              onDelete={onClientDeleted ? () => onClientDeleted(client.id) : undefined}
            />
          ))}
        </div>
      )}
      
      <ClientFormDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}
