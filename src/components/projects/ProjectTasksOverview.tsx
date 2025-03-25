
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  ListChecks, 
  Layers, 
  FileText,
  ChevronLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { KanbanBoard } from './KanbanBoard';
import { GanttChart } from './GanttChart';

// Demo project data - in a real app, this would come from an API
const projectData = {
  id: 1,
  name: 'Al Hamra Tower',
  client: 'Al Hamra Real Estate',
  status: 'In Progress',
  progress: 65,
  deadline: 'Aug 15, 2023',
  team: 8,
  priority: 'High',
  description: 'A luxury commercial tower in the heart of the business district.',
  tag: 'Commercial'
};

// Demo tasks data
const initialTasks = [
  {
    id: 1,
    projectId: 1,
    name: 'Foundation Design',
    description: 'Complete the structural design for the building foundation',
    assignee: 'Ahmed Ali',
    startDate: '2023-01-15',
    endDate: '2023-02-28',
    priority: 'High',
    status: 'Completed',
    progress: 100,
    dependencies: []
  },
  {
    id: 2,
    projectId: 1,
    name: 'Electrical Systems Planning',
    description: 'Design and plan all electrical systems for the building',
    assignee: 'Sarah Mahmoud',
    startDate: '2023-02-10',
    endDate: '2023-04-20',
    priority: 'Medium',
    status: 'In Progress',
    progress: 70,
    dependencies: [1]
  },
  {
    id: 3,
    projectId: 1,
    name: 'HVAC System Design',
    description: 'Complete HVAC system design including air conditioning and ventilation',
    assignee: 'Mohammed Hassan',
    startDate: '2023-03-01',
    endDate: '2023-05-15',
    priority: 'Medium',
    status: 'In Progress',
    progress: 50,
    dependencies: [1]
  },
  {
    id: 4,
    projectId: 1,
    name: 'Facade Design',
    description: 'Design the exterior facade of the building',
    assignee: 'Layla Kareem',
    startDate: '2023-02-15',
    endDate: '2023-04-30',
    priority: 'High',
    status: 'Review',
    progress: 90,
    dependencies: []
  },
  {
    id: 5,
    projectId: 1,
    name: 'Interior Layout Planning',
    description: 'Plan the interior layout of all floors',
    assignee: 'Omar Nabil',
    startDate: '2023-04-01',
    endDate: '2023-06-15',
    priority: 'Medium',
    status: 'Not Started',
    progress: 0,
    dependencies: [4]
  },
  {
    id: 6,
    projectId: 1,
    name: 'Fire Safety System',
    description: 'Design and implement fire safety systems',
    assignee: 'Hala Salem',
    startDate: '2023-03-15',
    endDate: '2023-05-30',
    priority: 'High',
    status: 'At Risk',
    progress: 30,
    dependencies: [2]
  }
];

type ViewMode = 'list' | 'kanban' | 'gantt';

export function ProjectTasksOverview() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  const [tasks, setTasks] = useState(initialTasks);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  // In a real app, we would fetch the project and tasks data based on the projectId
  
  const handleCreateTask = (newTask: any) => {
    const taskWithId = {
      ...newTask,
      id: tasks.length + 1,
      projectId: Number(projectId) || 1,
    };
    
    setTasks([...tasks, taskWithId]);
    setIsAddingTask(false);
    
    toast({
      title: "مهمة جديدة",
      description: "تم إنشاء المهمة بنجاح",
    });
  };
  
  const handleUpdateTask = (updatedTask: any) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    
    toast({
      title: "تم التحديث",
      description: "تم تحديث المهمة بنجاح",
    });
  };
  
  const handleUpdateTaskStatus = (taskId: number, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };
  
  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    
    toast({
      title: "تم الحذف",
      description: "تم حذف المهمة بنجاح",
      variant: "destructive",
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Header with project info */}
      <div className="glass-card dark:glass-card-dark rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/projects')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{projectData.name}</h1>
          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
            projectData.status === 'On Track' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            projectData.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
            projectData.status === 'Delayed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
            projectData.status === 'On Hold' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' :
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {projectData.status}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">الموعد النهائي</p>
              <p className="font-medium">{projectData.deadline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">فريق العمل</p>
              <p className="font-medium">{projectData.team} أعضاء</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">النوع</p>
              <p className="font-medium">{projectData.tag}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center"
              onClick={() => setViewMode('list')}
            >
              <ListChecks className="h-4 w-4 mr-2" />
              <span>قائمة</span>
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center"
              onClick={() => setViewMode('kanban')}
            >
              <Layers className="h-4 w-4 mr-2" />
              <span>كانبان</span>
            </Button>
            <Button
              variant={viewMode === 'gantt' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center"
              onClick={() => setViewMode('gantt')}
            >
              <Clock className="h-4 w-4 mr-2" />
              <span>مخطط جانت</span>
            </Button>
          </div>
          
          <Button onClick={() => setIsAddingTask(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            <span>إضافة مهمة</span>
          </Button>
        </div>
      </div>
      
      {/* Task Content Area */}
      <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
        {isAddingTask ? (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">إضافة مهمة جديدة</h2>
            <TaskForm 
              onSubmit={handleCreateTask} 
              onCancel={() => setIsAddingTask(false)} 
            />
          </div>
        ) : (
          <>
            {viewMode === 'list' && (
              <TaskList 
                tasks={tasks} 
                onUpdateTask={handleUpdateTask} 
                onDeleteTask={handleDeleteTask} 
              />
            )}
            
            {viewMode === 'kanban' && (
              <KanbanBoard 
                tasks={tasks} 
                onUpdateTaskStatus={handleUpdateTaskStatus} 
                onUpdateTask={handleUpdateTask}
              />
            )}
            
            {viewMode === 'gantt' && (
              <GanttChart 
                tasks={tasks} 
                onUpdateTask={handleUpdateTask} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
