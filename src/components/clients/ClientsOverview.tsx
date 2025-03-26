
import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client, Interaction, Contract, SatisfactionMetric } from './types';
import { ClientProfile } from './ClientProfile';
import { getClients } from '@/services/clientsService';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export function ClientsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const clientsData = await getClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        toast({
          title: "Error",
          description: "Failed to load clients. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  const handleClientSelect = (clientId: number) => {
    setSelectedClientId(clientId);
    setActiveTab('profile');
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
              <>
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
                
                <Button size="sm" className="gap-1">
                  <Plus size={16} />
                  <span>عميل جديد</span>
                </Button>
              </>
            )}
          </div>
        </div>

        <TabsContent value="clients" className="mt-6">
          {loading ? (
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
          ) : filteredClients.length === 0 ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <div 
                  key={client.id} 
                  className="glass-card dark:glass-card-dark rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleClientSelect(client.id)}
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
                        handleClientSelect(client.id);
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
              ))}
            </div>
          )}
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
