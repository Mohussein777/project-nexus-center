import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractionsList } from './InteractionsList';
import { ContractsList } from './ContractsList';
import { SatisfactionAnalysis } from './SatisfactionAnalysis';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Interaction, Contract, Client, SatisfactionMetric } from './types';
import { 
  getClientById, 
  getClientInteractions, 
  getClientContracts, 
  getClientSatisfactionMetrics,
  mapDbInteractionToClientInteraction,
  mapDbContractToClientContract 
} from '@/services/clients';

export interface ClientProfileProps {
  clientId?: number;
}

export function ClientProfile({ clientId: propClientId }: ClientProfileProps) {
  const { clientId: paramClientId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const clientId = propClientId || (paramClientId ? parseInt(paramClientId) : undefined);
  
  const [client, setClient] = useState<Client | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [satisfaction, setSatisfaction] = useState<SatisfactionMetric | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId) {
        navigate('/clients');
        return;
      }
      
      try {
        // Load real data from Supabase
        const [clientData, clientInteractions, clientContracts, satisfactionData] = await Promise.all([
          getClientById(clientId),
          getClientInteractions(clientId),
          getClientContracts(clientId),
          getClientSatisfactionMetrics(clientId)
        ]);
        
        if (clientData) {
          setClient(clientData);
          // Use the data as-is since services return properly formatted data
          setInteractions(clientInteractions as Interaction[]);
          setContracts(clientContracts as Contract[]);
          setSatisfaction(satisfactionData);
        } else {
          toast({
            title: "خطأ",
            description: "لم يتم العثور على العميل",
            variant: "destructive",
          });
          navigate('/clients');
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast({
          title: t('error'),
          description: "حدث خطأ أثناء تحميل بيانات العميل",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientData();
  }, [clientId, navigate, toast, t]);
  
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
            <div className={`px-3 py-1 rounded-full text-sm ${
              client.status === 'Active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
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
          {clientId && <SatisfactionAnalysis clientId={clientId} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}