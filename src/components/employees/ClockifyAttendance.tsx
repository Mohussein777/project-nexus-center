import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimeTracker } from './TimeTracker';
import { WeeklyTimesheet } from './WeeklyTimesheet';
import { ClockifyDashboard } from './ClockifyDashboard';
import { Clock, Calendar, BarChart3 } from 'lucide-react';

export function ClockifyAttendance() {
  const [activeTab, setActiveTab] = useState('timer');
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Clockify - تتبع الوقت
        </h1>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timer" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            المؤقت
          </TabsTrigger>
          <TabsTrigger value="timesheet" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            الجدول الزمني
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            لوحة التحكم
          </TabsTrigger>
        </TabsList>

        {/* Timer Tab */}
        <TabsContent value="timer" className="space-y-6">
          <TimeTracker />
        </TabsContent>

        {/* Timesheet Tab */}
        <TabsContent value="timesheet" className="space-y-6">
          <WeeklyTimesheet />
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <ClockifyDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}