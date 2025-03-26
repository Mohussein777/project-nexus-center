
import { Search, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Client } from './types';
import { ClientCard } from './ClientCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ClientsGridProps {
  clients: Client[];
  loading: boolean;
  searchQuery: string;
  onClientSelect: (clientId: number) => void;
}

export function ClientsGrid({ clients, loading, searchQuery, onClientSelect }: ClientsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              
              <Skeleton className="mt-4 h-5 w-1/3" />
            </div>
            
            <div className="border-t p-2">
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Search size={36} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium">لم يتم العثور على عملاء</h3>
        <p className="text-muted-foreground">
          {searchQuery ? 'لم نجد أي عميل يطابق بحثك. جرب تعديل معايير البحث.' : 'لم يتم إضافة أي عملاء حتى الآن. أضف عميلًا جديدًا للبدء.'}
        </p>
        <Button className="mt-4">
          <Plus size={16} className="mr-2" />
          إضافة عميل جديد
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <ClientCard 
          key={client.id} 
          client={client} 
          onSelect={onClientSelect} 
        />
      ))}
    </div>
  );
}
