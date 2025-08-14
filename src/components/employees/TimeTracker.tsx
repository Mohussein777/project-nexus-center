import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  Square, 
  Calendar,
  Clock,
  Timer,
  Plus,
  Trash2,
  Edit,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatTimeSpent } from './attendance/attendanceUtils';
import { getProjects } from '@/services/projectService';
import { supabase } from '@/integrations/supabase/client';

interface TimerProps {
  compact?: boolean;
}

export function TimeTracker({ compact = false }: TimerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [loading, setLoading] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  // Load projects
  useEffect(() => {
    loadProjects();
    checkActiveEntry();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsData = await getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const checkActiveEntry = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('status', 'active')
        .eq('date', new Date().toISOString().split('T')[0])
        .single();

      if (data && !error) {
        setCurrentEntry(data);
        setIsRunning(true);
        setStartTime(new Date(data.start_time));
        setDescription(data.description || '');
        setSelectedProject(data.project_id?.toString() || '');
      }
    } catch (error) {
      // No active entry found
    }
  };

  const getCurrentDuration = () => {
    if (!isRunning || !startTime) return 0;
    return Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
  };

  const formatCurrentTime = () => {
    const duration = getCurrentDuration();
    return formatTimeSpent(duration);
  };

  const startTimer = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const now = new Date();
      
      const { data, error } = await supabase
        .from('time_entries')
        .insert({
          employee_id: user.id,
          project_id: selectedProject ? parseInt(selectedProject) : null,
          description: description,
          start_time: now.toISOString(),
          date: now.toISOString().split('T')[0],
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentEntry(data);
      setIsRunning(true);
      setStartTime(now);
      
      toast({
        title: "بدأ التتبع",
        description: "تم بدء تتبع الوقت بنجاح",
      });
    } catch (error) {
      console.error('Error starting timer:', error);
      toast({
        title: "خطأ",
        description: "فشل في بدء التتبع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stopTimer = async () => {
    if (!currentEntry || !startTime) return;

    try {
      setLoading(true);
      const now = new Date();
      const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);

      const { error } = await supabase
        .from('time_entries')
        .update({
          end_time: now.toISOString(),
          duration: duration,
          status: 'completed',
          description: description,
          project_id: selectedProject ? parseInt(selectedProject) : null
        })
        .eq('id', currentEntry.id);

      if (error) throw error;

      setCurrentEntry(null);
      setIsRunning(false);
      setStartTime(null);
      setDescription('');
      setSelectedProject('');
      
      toast({
        title: "تم الإيقاف",
        description: `المدة: ${formatTimeSpent(duration)}`,
      });
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast({
        title: "خطأ",
        description: "فشل في إيقاف التتبع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-white/10 dark:bg-gray-800/50 rounded-lg p-2 backdrop-blur-sm border border-white/20">
        <div className="font-mono text-lg font-bold text-primary">
          {formatCurrentTime()}
        </div>
        {isRunning ? (
          <Button
            onClick={stopTimer}
            size="sm"
            variant="destructive"
            disabled={loading}
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={startTimer}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="sticky top-4 z-10 shadow-lg border-primary/20">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Description Input */}
          <Input
            placeholder="ما الذي تعمل عليه؟"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="border-0 text-lg font-medium placeholder:text-muted-foreground/70 focus-visible:ring-1"
          />

          {/* Project Selection */}
          <Select value={selectedProject} onValueChange={setSelectedProject} disabled={loading}>
            <SelectTrigger className="border-0 focus:ring-1">
              <SelectValue placeholder="اختر مشروع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">بدون مشروع</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name} - {project.client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Timer Controls */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-3">
              <div className="font-mono text-2xl font-bold text-primary">
                {formatCurrentTime()}
              </div>
              {isRunning && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">نشط</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {!isRunning ? (
                <Button
                  onClick={startTimer}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="h-4 w-4 mr-1" />
                  ابدأ
                </Button>
              ) : (
                <Button
                  onClick={stopTimer}
                  disabled={loading}
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-1" />
                  إيقاف
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}