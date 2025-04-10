
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client } from './types';
import { ClientProfile } from './ClientProfile';
import { ClientsSearch } from './ClientsSearch';
import { ClientsGrid } from './ClientsGrid';
import { getClients } from '@/services/clientsService';
import { useToast } from '@/components/ui/use-toast';

export function ClientsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // دالة لجلب بيانات العملاء
  const fetchClients = async () => {
    try {
      setLoading(true);
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات العملاء. يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchClients();
  }, [toast]);

  const handleClientSelect = (clientId: number) => {
    setSelectedClientId(clientId);
    setActiveTab('profile');
  };

  const handleClientAdded = (newClient: Client) => {
    // إضافة العميل الجديد إلى القائمة
    setClients(prevClients => [newClient, ...prevClients]);
  };

  const handleSearch = (query: string, filters: Record<string, string>) => {
    setSearchQuery(query);
    // We could implement additional filter logic here
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab || 'clients'} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold tracking-tight">العملاء</h1>
            <TabsList>
              <TabsTrigger value="clients">جميع العملاء</TabsTrigger>
              {selectedClientId && (
                <TabsTrigger value="profile">
                  {clients.find(c => c.id === selectedClientId)?.name}
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <div className="flex items-center space-x-2">
            {activeTab !== 'profile' && (
              <ClientsSearch 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onClientAdded={handleClientAdded}
                onSearch={handleSearch}
              />
            )}
          </div>
        </div>

        <TabsContent value="clients" className="mt-6">
          <ClientsGrid 
            clients={filteredClients}
            loading={loading}
            searchQuery={searchQuery}
            onClientSelect={handleClientSelect}
            onClientAdded={handleClientAdded}
          />
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          {selectedClientId && (
            <ClientProfile clientId={selectedClientId} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
