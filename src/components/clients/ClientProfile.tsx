
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientsOverview } from './ClientsOverview';
import { InteractionsList } from './InteractionsList';
import { ContractsList } from './ContractsList';
import { SatisfactionAnalysis } from './SatisfactionAnalysis';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Interaction, Contract } from './types';
import { SatisfactionAnalysisProps } from './SatisfactionAnalysisProps';

export function ClientProfile() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [client, setClient] = useState<any>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // Placeholder for API call
        setTimeout(() => {
          const clientData = {
            id: parseInt(clientId as string),
            name: "Sample Client",
            code: "CLNT123",
            status: "Active",
            type: "Enterprise",
            email: "contact@sample.com",
            phone: "+1 (555) 123-4567",
            contact: "John Doe",
            location: "New York, NY",
            projects: 5
          };
          
          const interactionsData: Interaction[] = [
            {
              id: 1,
              clientId: parseInt(clientId as string),
              date: "2023-01-15T10:30:00Z",
              summary: "Initial consultation meeting",
              type: "Meeting",
              employee: "Jane Smith",
              sentiment: "Positive"
            }
          ];
          
          const contractsData: Contract[] = [
            {
              id: 1,
              clientId: parseInt(clientId as string),
              title: "Annual Support Contract",
              status: "Active",
              startDate: "2023-01-01",
              endDate: "2024-01-01",
              value: 50000,
              renewalAlert: true
            }
          ];
          
          setClient(clientData);
          setInteractions(interactionsData);
          setContracts(contractsData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast({
          title: t('error'),
          description: t('errorLoadingClientData'),
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    if (clientId) {
      fetchClientData();
    }
  }, [clientId, toast, t]);
  
  const handleAddInteraction = (newInteraction: Interaction) => {
    setInteractions([...interactions, newInteraction]);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">{t('clientNotFound')}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => navigate('/clients')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToClients')}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          className="mb-4" 
          onClick={() => navigate('/clients')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToClients')}
        </Button>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          {t('editClient')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{client.name}</CardTitle>
            <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm">
              {client.status}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('clientCode')}</p>
              <p className="font-medium">{client.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('clientType')}</p>
              <p className="font-medium">{client.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('contactPerson')}</p>
              <p className="font-medium">{client.contact}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('location')}</p>
              <p className="font-medium">{client.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('email')}</p>
              <p className="font-medium">{client.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('phone')}</p>
              <p className="font-medium">{client.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="interactions">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="interactions">{t('interactions')}</TabsTrigger>
          <TabsTrigger value="contracts">{t('contracts')}</TabsTrigger>
          <TabsTrigger value="satisfaction">{t('satisfaction')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="interactions">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{t('interactions')}</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('addInteraction')}
            </Button>
          </div>
          <InteractionsList interactions={interactions} />
        </TabsContent>
        
        <TabsContent value="contracts">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{t('contracts')}</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('addContract')}
            </Button>
          </div>
          <ContractsList contracts={contracts} />
        </TabsContent>
        
        <TabsContent value="satisfaction">
          <SatisfactionAnalysis clientId={parseInt(clientId as string)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
