
import { Building2, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';
import { Client } from './types';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/contexts/LanguageContext';

export interface ClientCardProps {
  client: Client;
  onClick: (clientId: number) => void;
  onEdit?: (client: Client) => void;
  onDelete?: () => void;
}

export function ClientCard({ client, onClick, onEdit, onDelete }: ClientCardProps) {
  const { t } = useLanguage();
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };
  
  // Get client type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Corporate': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Government': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'Individual': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden border border-border">
      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">{client.name}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getTypeColor(client.type)}>
              {t(client.type.toLowerCase())}
            </Badge>
            
            <Badge variant="outline" className={getStatusColor(client.status)}>
              {t(client.status.toLowerCase())}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center mt-1 text-muted-foreground text-sm">
          <span className="font-medium mr-1">{t('code')}</span>
          <span>{client.code}</span>
        </div>
        
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 mr-2" />
            <span>{client.contact}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-4 w-4 mr-2" />
            <span>{client.email}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="h-4 w-4 mr-2" />
            <span>{client.phone}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{client.location}</span>
          </div>
        </div>
        
        <div className="mt-3 text-sm">
          <span className="font-medium">{t('projects')}: </span>
          <span>{client.projects}</span>
        </div>
      </div>
      
      <div className="border-t p-2 bg-muted/30">
        <Button 
          variant="ghost" 
          className="w-full flex justify-between items-center text-primary"
          onClick={() => onClick(client.id)}
        >
          <span>{t('viewDetails')}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
