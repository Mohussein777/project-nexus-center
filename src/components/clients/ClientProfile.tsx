
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MessageSquare, Mail, PhoneCall, Edit, FileText } from 'lucide-react';
import { Client, Interaction, Contract, SatisfactionMetric } from './types';
import { InteractionForm } from './InteractionForm';
import { InteractionsList } from './InteractionsList';
import { ContractsList } from './ContractsList';
import { SatisfactionAnalysis } from './SatisfactionAnalysis';
import { getClientById, getClientInteractions, getClientContracts, getClientSatisfactionMetrics } from '@/services/clientsService';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface ClientProfileProps {
  clientId: number;
}

export function ClientProfile({ clientId }: ClientProfileProps) {
  const [isInteractionFormOpen, setIsInteractionFormOpen] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [satisfactionMetrics, setSatisfactionMetrics] = useState<SatisfactionMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        
        // Fetch client details
        const clientData = await getClientById(clientId);
        if (!clientData) {
          toast({
            title: "خطأ",
            description: "تعذر تحميل بيانات العميل",
            variant: "destructive",
          });
          return;
        }
        setClient(clientData);
        
        // Fetch interactions
        const interactionsData = await getClientInteractions(clientId);
        setInteractions(interactionsData);
        
        // Fetch contracts
        const contractsData = await getClientContracts(clientId);
        setContracts(contractsData);
        
        // Fetch satisfaction metrics
        const metricsData = await getClientSatisfactionMetrics(clientId);
        // If no metrics exist yet, create a default
        if (!metricsData) {
          setSatisfactionMetrics({
            clientId,
            overallScore: 0,
            trends: [],
            sentimentBreakdown: {
              positive: 0,
              neutral: 0,
              negative: 0
            }
          });
        } else {
          setSatisfactionMetrics(metricsData);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل بيانات العميل. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId, toast]);

  const handleInteractionSaved = async () => {
    setIsInteractionFormOpen(false);
    
    // Refresh interactions
    try {
      const refreshedInteractions = await getClientInteractions(clientId);
      setInteractions(refreshedInteractions);
      
      toast({
        description: "تم تسجيل التفاعل الجديد بنجاح",
      });
    } catch (error) {
      console.error('Error refreshing interactions:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="interactions">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-64 w-full" />
        </Tabs>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">تعذر تحميل بيانات العميل</h3>
        <p className="text-muted-foreground">لا يمكن العثور على العميل المطلوب. قد يكون تم حذفه أو أنك لا تملك الصلاحيات اللازمة.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-muted-foreground">
            {client.type === 'Corporate' ? 'عميل شركة' : 
             client.type === 'Government' ? 'عميل حكومي' : 'عميل فرد'} 
            {' • '}
            {client.status === 'Active' ? 'نشط' : 'غير نشط'}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Edit size={16} />
          تعديل العميل
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>معلومات الاتصال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-2 text-muted-foreground" />
              <span>{client.contact}</span>
            </div>
            <div className="flex items-center">
              <Mail size={16} className="mr-2 text-muted-foreground" />
              <a href={`mailto:${client.email}`} className="text-primary hover:underline">{client.email}</a>
            </div>
            <div className="flex items-center">
              <PhoneCall size={16} className="mr-2 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center mt-4">
              <Button variant="outline" size="sm" className="w-full">عرض الملف الكامل</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>الأحداث القادمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contracts.filter(c => c.renewalAlert).length > 0 ? (
              contracts.filter(c => c.renewalAlert).map(contract => (
                <div key={contract.id} className="flex items-center p-2 bg-amber-50 dark:bg-amber-950/30 rounded-md">
                  <Calendar size={16} className="mr-2 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">تجديد العقد</p>
                    <p className="text-xs text-muted-foreground">يستحق في {new Date(contract.endDate).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">لا توجد أحداث قادمة</p>
            )}
            {interactions.filter(i => i.followupDate).length > 0 && (
              interactions.filter(i => i.followupDate).slice(0, 2).map(interaction => (
                <div key={interaction.id} className="flex items-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                  <Calendar size={16} className="mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">متابعة: {
                      interaction.type === 'Meeting' ? 'اجتماع' :
                      interaction.type === 'Call' ? 'مكالمة' :
                      interaction.type === 'Email' ? 'بريد إلكتروني' : 'ملاحظة'
                    }</p>
                    <p className="text-xs text-muted-foreground">يستحق في {new Date(interaction.followupDate!).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>نظرة عامة على الرضا</CardTitle>
          </CardHeader>
          <CardContent>
            {satisfactionMetrics && (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{satisfactionMetrics.overallScore}/10</div>
                    <p className="text-xs text-muted-foreground">الرضا العام</p>
                  </div>
                  <div className="h-14 w-14 rounded-full flex items-center justify-center" 
                    style={{ 
                      backgroundColor: `rgba(${satisfactionMetrics.overallScore > 7 ? '34, 197, 94' : satisfactionMetrics.overallScore > 4 ? '245, 158, 11' : '239, 68, 68'}, 0.2)`,
                      color: satisfactionMetrics.overallScore > 7 ? 'rgb(34, 197, 94)' : satisfactionMetrics.overallScore > 4 ? 'rgb(245, 158, 11)' : 'rgb(239, 68, 68)'
                    }}>
                    {satisfactionMetrics.overallScore > 7 ? '😀' : satisfactionMetrics.overallScore > 4 ? '😐' : '😞'}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <div className="h-2 rounded flex-1" style={{ backgroundColor: `rgba(34, 197, 94, ${satisfactionMetrics.sentimentBreakdown.positive/10})` }}></div>
                  <div className="h-2 rounded flex-1" style={{ backgroundColor: `rgba(245, 158, 11, ${satisfactionMetrics.sentimentBreakdown.neutral/10})` }}></div>
                  <div className="h-2 rounded flex-1" style={{ backgroundColor: `rgba(239, 68, 68, ${satisfactionMetrics.sentimentBreakdown.negative/10})` }}></div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">عرض التحليل الكامل</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="interactions">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="interactions">التفاعلات</TabsTrigger>
            <TabsTrigger value="contracts">العقود</TabsTrigger>
            <TabsTrigger value="projects">المشاريع</TabsTrigger>
            <TabsTrigger value="analysis">تحليل مفصل</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            {!isInteractionFormOpen && (
              <Button onClick={() => setIsInteractionFormOpen(true)} size="sm">
                <Plus size={16} className="mr-2" />
                تفاعل جديد
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="interactions" className="mt-0">
          {isInteractionFormOpen && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>تسجيل تفاعل جديد</CardTitle>
                <CardDescription>
                  توثيق التواصل مع هذا العميل
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InteractionForm 
                  clientId={client.id} 
                  onCancel={() => setIsInteractionFormOpen(false)}
                  onSave={handleInteractionSaved}
                />
              </CardContent>
            </Card>
          )}
          <InteractionsList interactions={interactions} />
        </TabsContent>

        <TabsContent value="contracts" className="mt-0">
          <ContractsList contracts={contracts} />
        </TabsContent>

        <TabsContent value="projects" className="mt-0">
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">معلومات المشاريع</h3>
            <p className="text-muted-foreground">يمتلك هذا العميل {client.projects} مشاريع نشطة</p>
            <Button variant="outline" className="mt-4">
              عرض جميع المشاريع
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-0">
          {satisfactionMetrics && <SatisfactionAnalysis metrics={satisfactionMetrics} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
