
import { useState } from 'react';
import { Search, Plus, Filter, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client, Interaction, Contract, SatisfactionMetric } from './types';
import { ClientProfile } from './ClientProfile';

export function ClientsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const clients: Client[] = [
    {
      id: 1,
      name: 'Al Hamra Real Estate',
      contact: 'Mohammed Al-Farsi',
      email: 'contact@alhamrarealestate.com',
      phone: '+971 4 123 4567',
      location: 'Dubai, UAE',
      projects: 3,
      status: 'Active',
      type: 'Corporate'
    },
    {
      id: 2,
      name: 'Gulf Developers',
      contact: 'Abdullah Al-Otaibi',
      email: 'info@gulfdevelopers.com',
      phone: '+966 12 345 6789',
      location: 'Riyadh, KSA',
      projects: 2,
      status: 'Active',
      type: 'Corporate'
    },
    {
      id: 3,
      name: 'Ministry of Technology',
      contact: 'Dr. Fahad Al-Saud',
      email: 'contact@mot.gov.sa',
      phone: '+966 11 234 5678',
      location: 'Riyadh, KSA',
      projects: 1,
      status: 'Active',
      type: 'Government'
    },
    {
      id: 4,
      name: 'Al Madina Group',
      contact: 'Saeed Al-Mansour',
      email: 'info@almadinagroup.com',
      phone: '+971 2 345 6789',
      location: 'Abu Dhabi, UAE',
      projects: 2,
      status: 'Active',
      type: 'Corporate'
    },
    {
      id: 5,
      name: 'Ministry of Health',
      contact: 'Dr. Layla Al-Faisal',
      email: 'projects@moh.gov.sa',
      phone: '+966 11 345 6789',
      location: 'Jeddah, KSA',
      projects: 1,
      status: 'Active',
      type: 'Government'
    },
    {
      id: 6,
      name: 'Retail Ventures',
      contact: 'Tariq Al-Qasimi',
      email: 'info@retailventures.ae',
      phone: '+971 4 987 6543',
      location: 'Dubai, UAE',
      projects: 1,
      status: 'Inactive',
      type: 'Corporate'
    }
  ];

  // Sample data for interactions
  const interactionsData: Record<number, Interaction[]> = {
    1: [
      {
        id: 1,
        clientId: 1,
        type: 'Meeting',
        date: '2023-07-15T14:30:00',
        summary: 'Initial consultation about the new residential project. Client showed interest in our premium design packages.',
        employee: 'Ahmed Hassan',
        sentiment: 'Positive',
      },
      {
        id: 2,
        clientId: 1,
        type: 'Call',
        date: '2023-07-20T11:15:00',
        summary: 'Follow-up call to discuss budget constraints and timeline expectations.',
        employee: 'Fatima Al-Zahra',
        sentiment: 'Neutral',
      },
      {
        id: 3,
        clientId: 1,
        type: 'Email',
        date: '2023-07-25T09:00:00',
        summary: 'Sent initial proposal documents and design concepts for review.',
        employee: 'Ahmed Hassan',
        followupDate: '2023-08-01',
      }
    ],
    2: [
      {
        id: 4,
        clientId: 2,
        type: 'Meeting',
        date: '2023-08-05T10:00:00',
        summary: 'Presentation of the commercial complex design. Client requested minor modifications to the facade.',
        employee: 'Ahmed Hassan',
        sentiment: 'Positive',
      }
    ]
  };

  // Sample data for contracts
  const contractsData: Record<number, Contract[]> = {
    1: [
      {
        id: 1,
        clientId: 1,
        title: 'Al Hamra Towers Design',
        startDate: '2023-01-15',
        endDate: '2023-12-15',
        value: 750000,
        status: 'Active',
        renewalAlert: true,
      },
      {
        id: 2,
        clientId: 1,
        title: 'Residential Complex Consultation',
        startDate: '2023-03-01',
        endDate: '2024-02-28',
        value: 350000,
        status: 'Active',
        renewalAlert: false,
      }
    ],
    2: [
      {
        id: 3,
        clientId: 2,
        title: 'Retail Center Design',
        startDate: '2023-02-10',
        endDate: '2023-11-10',
        value: 500000,
        status: 'Active',
        renewalAlert: true,
      }
    ]
  };

  // Sample data for satisfaction metrics
  const satisfactionData: Record<number, SatisfactionMetric> = {
    1: {
      clientId: 1,
      overallScore: 8.2,
      trends: [
        { date: '2023-01-15', score: 7.5 },
        { date: '2023-03-15', score: 7.8 },
        { date: '2023-05-15', score: 8.0 },
        { date: '2023-07-15', score: 8.2 },
      ],
      sentimentBreakdown: {
        positive: 7,
        neutral: 2,
        negative: 1,
      }
    },
    2: {
      clientId: 2,
      overallScore: 6.8,
      trends: [
        { date: '2023-02-15', score: 7.0 },
        { date: '2023-04-15', score: 6.5 },
        { date: '2023-06-15', score: 6.8 },
      ],
      sentimentBreakdown: {
        positive: 5,
        neutral: 3,
        negative: 2,
      }
    }
  };

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
            <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
            <TabsList>
              <TabsTrigger value="clients">All Clients</TabsTrigger>
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
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm w-60 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-gray-800"
                  />
                </div>
                
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter size={16} />
                  <span>Filter</span>
                </Button>
                
                <Button size="sm" className="gap-1">
                  <Plus size={16} />
                  <span>New Client</span>
                </Button>
              </>
            )}
          </div>
        </div>

        <TabsContent value="clients" className="mt-6">
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
                      {client.status}
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
                      {client.type}
                    </span>
                    <span className="ml-2 text-muted-foreground">
                      {client.projects} {client.projects === 1 ? 'Project' : 'Projects'}
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
                    View Profile
                  </button>
                  <button 
                    className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Projects
                  </button>
                  <button 
                    className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Invoices
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          {selectedClientId && (
            <ClientProfile 
              client={clients.find(c => c.id === selectedClientId)!}
              interactions={interactionsData[selectedClientId] || []}
              contracts={contractsData[selectedClientId] || []}
              satisfactionMetrics={satisfactionData[selectedClientId] || {
                clientId: selectedClientId,
                overallScore: 0,
                trends: [],
                sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 }
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
