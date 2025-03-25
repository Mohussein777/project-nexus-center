
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MessageSquare, Mail, PhoneCall, Edit, FileText } from 'lucide-react';
import { Client, Interaction, Contract, SatisfactionMetric } from './types';
import { InteractionForm } from './InteractionForm';
import { InteractionsList } from './InteractionsList';
import { ContractsList } from './ContractsList';
import { SatisfactionAnalysis } from './SatisfactionAnalysis';

interface ClientProfileProps {
  client: Client;
  interactions: Interaction[];
  contracts: Contract[];
  satisfactionMetrics: SatisfactionMetric;
}

export function ClientProfile({ client, interactions, contracts, satisfactionMetrics }: ClientProfileProps) {
  const [isInteractionFormOpen, setIsInteractionFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-muted-foreground">{client.type} Client • {client.status}</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Edit size={16} />
          Edit Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Contact Information</CardTitle>
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
              <Button variant="outline" size="sm" className="w-full">View Complete Profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contracts.filter(c => c.renewalAlert).length > 0 ? (
              contracts.filter(c => c.renewalAlert).map(contract => (
                <div key={contract.id} className="flex items-center p-2 bg-amber-50 dark:bg-amber-950/30 rounded-md">
                  <Calendar size={16} className="mr-2 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Contract Renewal</p>
                    <p className="text-xs text-muted-foreground">Due on {new Date(contract.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            )}
            {interactions.filter(i => i.followupDate).length > 0 && (
              interactions.filter(i => i.followupDate).slice(0, 2).map(interaction => (
                <div key={interaction.id} className="flex items-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                  <Calendar size={16} className="mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Follow-up: {interaction.type}</p>
                    <p className="text-xs text-muted-foreground">Due on {new Date(interaction.followupDate!).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Satisfaction Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{satisfactionMetrics.overallScore}/10</div>
                <p className="text-xs text-muted-foreground">Overall satisfaction</p>
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
              <Button variant="outline" size="sm" className="w-full">View Full Analysis</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="interactions">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            {!isInteractionFormOpen && (
              <Button onClick={() => setIsInteractionFormOpen(true)} size="sm">
                <Plus size={16} className="mr-2" />
                New Interaction
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="interactions" className="mt-0">
          {isInteractionFormOpen && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Record New Interaction</CardTitle>
                <CardDescription>
                  Document your communication with this client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InteractionForm 
                  clientId={client.id} 
                  onCancel={() => setIsInteractionFormOpen(false)}
                  onSave={() => setIsInteractionFormOpen(false)}
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
            <h3 className="text-lg font-medium">Projects Information</h3>
            <p className="text-muted-foreground">This client has {client.projects} active projects</p>
            <Button variant="outline" className="mt-4">
              View All Projects
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-0">
          <SatisfactionAnalysis metrics={satisfactionMetrics} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
