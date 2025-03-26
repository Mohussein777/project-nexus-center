
import { Mail, Phone, MapPin } from 'lucide-react';
import { Client } from './types';

interface ClientCardProps {
  client: Client;
  onSelect: (clientId: number) => void;
}

export function ClientCard({ client, onSelect }: ClientCardProps) {
  return (
    <div 
      className="glass-card dark:glass-card-dark rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(client.id)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{client.name}</h3>
            <p className="text-sm text-muted-foreground">{client.contact}</p>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            client.status === 'Active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
          }`}>
            {client.status === 'Active' ? 'نشط' : 'غير نشط'}
          </span>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Mail size={14} className="mr-2 text-muted-foreground" />
            <a href={`mailto:${client.email}`} className="text-primary hover:underline">{client.email}</a>
          </div>
          <div className="flex items-center text-sm">
            <Phone size={14} className="mr-2 text-muted-foreground" />
            <span>{client.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin size={14} className="mr-2 text-muted-foreground" />
            <span>{client.location}</span>
          </div>
        </div>
        
        <div className="mt-4 text-sm">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full px-2.5 py-0.5">
            {client.type === 'Corporate' ? 'شركة' : 
             client.type === 'Government' ? 'حكومي' : 'فرد'}
          </span>
          <span className="mr-2 text-muted-foreground">
            {client.projects} {client.projects === 1 ? 'مشروع' : 'مشاريع'}
          </span>
        </div>
      </div>
      
      <div className="border-t border-border flex divide-x divide-border">
        <button 
          className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(client.id);
          }}
        >
          عرض الملف
        </button>
        <button 
          className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          المشاريع
        </button>
        <button 
          className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          الفواتير
        </button>
      </div>
    </div>
  );
}
