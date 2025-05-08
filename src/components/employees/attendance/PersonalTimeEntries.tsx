
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { TimeEntry } from '../types';
import { formatDateInArabic, formatTimeSpent } from './attendanceUtils';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface PersonalTimeEntriesProps {
  timeEntries: TimeEntry[];
  loading?: boolean;
}

interface ProjectInfo {
  [key: number]: string;
}

export function PersonalTimeEntries({ timeEntries, loading }: PersonalTimeEntriesProps) {
  const [projectsInfo, setProjectsInfo] = useState<ProjectInfo>({});

  // Fetch projects info
  useEffect(() => {
    async function loadProjects() {
      try {
        const projectIds = [...new Set(timeEntries.map(entry => entry.projectId).filter(Boolean))];
        
        if (projectIds.length === 0) return;

        const { data, error } = await supabase
          .from('projects')
          .select('id, name')
          .in('id', projectIds);

        if (error) throw error;

        const projectsMap: ProjectInfo = {};
        (data || []).forEach(project => {
          projectsMap[project.id] = project.name;
        });

        setProjectsInfo(projectsMap);
      } catch (error) {
        console.error('Error loading projects info:', error);
      }
    }

    if (timeEntries.length > 0) {
      loadProjects();
    }
  }, [timeEntries]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }
  
  if (timeEntries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        لا توجد سجلات حضور سابقة
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>التاريخ</TableHead>
          <TableHead>المشروع</TableHead>
          <TableHead>وقت الحضور</TableHead>
          <TableHead>وقت الانصراف</TableHead>
          <TableHead>المدة</TableHead>
          <TableHead>الحالة</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timeEntries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{formatDateInArabic(entry.date)}</TableCell>
            <TableCell>
              {entry.projectId && projectsInfo[entry.projectId] 
                ? projectsInfo[entry.projectId] 
                : 'غير محدد'}
            </TableCell>
            <TableCell>
              {new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </TableCell>
            <TableCell>
              {entry.endTime 
                ? new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '-'
              }
            </TableCell>
            <TableCell>
              {entry.duration ? formatTimeSpent(entry.duration) : '-'}
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                entry.status === 'active' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse-subtle'
                  : entry.status === 'completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {entry.status === 'active' ? 'قيد التسجيل' : 'مكتمل'}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
