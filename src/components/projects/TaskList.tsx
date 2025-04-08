
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { TaskForm } from './TaskForm';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  AlertOctagon,
  ClipboardCheck,
  Clock,
  HelpCircle,
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaskListProps {
  tasks: any[];
  onUpdateTask: (task: any) => Promise<boolean>;
  onDeleteTask: (taskId: string) => Promise<boolean>;
}

export function TaskList({ tasks, onUpdateTask, onDeleteTask }: TaskListProps) {
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 dark:text-red-400';
      case 'High': return 'text-orange-600 dark:text-orange-400';
      case 'Medium': return 'text-blue-600 dark:text-blue-400';
      case 'Low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <ClipboardCheck className="h-4 w-4 text-green-500" />;
      case 'In Progress': return <Play className="h-4 w-4 text-blue-500" />;
      case 'Review': return <Clock className="h-4 w-4 text-purple-500" />;
      case 'At Risk': return <AlertOctagon className="h-4 w-4 text-red-500" />;
      case 'Not Started': return <HelpCircle className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Completed': return 'مكتملة';
      case 'In Progress': return 'قيد التنفيذ';
      case 'Review': return 'في المراجعة';
      case 'At Risk': return 'متأخرة';
      case 'Not Started': return 'لم تبدأ';
      default: return status;
    }
  };
  
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'عاجلة';
      case 'High': return 'عالية';
      case 'Medium': return 'متوسطة';
      case 'Low': return 'منخفضة';
      default: return priority;
    }
  };
  
  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateTask = async (updatedTask: any) => {
    const success = await onUpdateTask(updatedTask);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedTask(null);
    }
  };
  
  const handleDeleteTask = (taskId: string) => {
    // In a real app, you might want to show a confirmation dialog
    onDeleteTask(taskId);
  };
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">اسم المهمة</TableHead>
            <TableHead>المسؤول</TableHead>
            <TableHead>تاريخ البدء</TableHead>
            <TableHead>الموعد النهائي</TableHead>
            <TableHead>الأولوية</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>التقدم</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.name}</TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell>{task.startDate}</TableCell>
              <TableCell>{task.endDate}</TableCell>
              <TableCell>
                <span className={`font-medium ${getPriorityClass(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getStatusIcon(task.status)}
                  <span>{getStatusText(task.status)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="w-full max-w-[100px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      task.status === 'Completed' 
                        ? 'bg-green-500' 
                        : task.status === 'At Risk' 
                          ? 'bg-red-500' 
                          : task.status === 'Review'
                            ? 'bg-purple-500'
                            : 'bg-blue-500'
                    }`} 
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">{task.progress}%</span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">القائمة</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEditTask(task)}>
                      <Edit className="h-4 w-4 mr-2" />
                      <span>تعديل</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600" 
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>حذف</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>تعديل المهمة</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <TaskForm 
              task={selectedTask} 
              onSubmit={handleUpdateTask} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
