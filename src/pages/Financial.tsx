
import { useState } from 'react';
import { FinancialOverview } from '../components/financial/FinancialOverview';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectFinancials } from '../components/financial/ProjectFinancials';

const Financial = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <MainLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="overview">النظرة العامة</TabsTrigger>
            <TabsTrigger value="projects">مالية المشاريع</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="mt-0">
          <FinancialOverview />
        </TabsContent>
        
        <TabsContent value="projects" className="mt-0">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold tracking-tight">مالية المشاريع</h1>
            </div>
            <ProjectFinancials />
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Financial;
