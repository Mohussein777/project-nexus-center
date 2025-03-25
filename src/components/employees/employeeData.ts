
import { Employee, Project, TimeEntry, Leave } from './types';

export const employees: Employee[] = [
  {
    id: 1,
    name: 'أحمد حسن',
    position: 'مهندس معماري أول',
    email: 'ahmad.hassan@company.com',
    phone: '+971 50 123 4567',
    department: 'الهندسة المعمارية',
    joinDate: 'May 12, 2020',
    status: 'Active',
    avatar: 'AH',
    color: 'from-blue-500 to-cyan-500',
    projects: 4,
    employeeId: 'EMP-001',
    skills: ['التصميم المعماري', 'الرسم ثلاثي الأبعاد', 'إدارة المشاريع'],
    manager: 'محمد عبد الرحمن',
    workHours: {
      start: '08:00',
      end: '16:00',
    }
  },
  {
    id: 2,
    name: 'سارة محمد',
    position: 'مدير مالي',
    email: 'sarah.m@company.com',
    phone: '+971 50 234 5678',
    department: 'المالية',
    joinDate: 'Jan 8, 2019',
    status: 'Active',
    avatar: 'SM',
    color: 'from-purple-500 to-pink-500',
    projects: 0,
    employeeId: 'EMP-002',
    skills: ['إدارة مالية', 'المحاسبة', 'إعداد التقارير المالية'],
    manager: 'خالد العتيبي',
    workHours: {
      start: '09:00',
      end: '17:00',
    }
  },
  {
    id: 3,
    name: 'خالد العتيبي',
    position: 'مدير مشروع',
    email: 'khalid.o@company.com',
    phone: '+966 55 345 6789',
    department: 'إدارة المشاريع',
    joinDate: 'Oct 15, 2021',
    status: 'Active',
    avatar: 'KO',
    color: 'from-amber-500 to-orange-500',
    projects: 3,
    employeeId: 'EMP-003',
    skills: ['إدارة المشاريع', 'التخطيط الاستراتيجي', 'إدارة الفريق'],
    workHours: {
      start: '08:30',
      end: '16:30',
    }
  },
  {
    id: 4,
    name: 'فاطمة رشيد',
    position: 'مهندس مدني',
    email: 'fatima.r@company.com',
    phone: '+971 50 456 7890',
    department: 'الهندسة',
    joinDate: 'Mar 22, 2020',
    status: 'Active',
    avatar: 'FR',
    color: 'from-green-500 to-emerald-500',
    projects: 2,
    employeeId: 'EMP-004',
    skills: ['التصميم الإنشائي', 'تحليل الهياكل', 'المواد الهندسية'],
    manager: 'خالد العتيبي',
    workHours: {
      start: '08:00',
      end: '16:00',
    }
  },
  {
    id: 5,
    name: 'عمر الفارسي',
    position: 'مهندس MEP',
    email: 'omar.f@company.com',
    phone: '+971 50 567 8901',
    department: 'الهندسة',
    joinDate: 'Jul 3, 2022',
    status: 'Active',
    avatar: 'OF',
    color: 'from-red-500 to-pink-500',
    projects: 2,
    employeeId: 'EMP-005',
    skills: ['تصميم نظم التكييف', 'الأنظمة الكهربائية', 'أنظمة السباكة'],
    manager: 'خالد العتيبي',
    workHours: {
      start: '09:00',
      end: '17:00',
    }
  },
  {
    id: 6,
    name: 'ليلى عبدالله',
    position: 'أخصائي موارد بشرية',
    email: 'layla.a@company.com',
    phone: '+966 55 678 9012',
    department: 'الموارد البشرية',
    joinDate: 'Feb 18, 2021',
    status: 'On Leave',
    avatar: 'LA',
    color: 'from-indigo-500 to-purple-500',
    projects: 0,
    employeeId: 'EMP-006',
    skills: ['التوظيف', 'إدارة الأداء', 'تدريب الموظفين'],
    manager: 'محمد عبد الرحمن',
    workHours: {
      start: '08:30',
      end: '16:30',
    }
  }
];

export const projects: Project[] = [
  { id: 1, name: 'برج الخليج', client: 'شركة الإمارات للتطوير العقاري', status: 'Active', color: 'bg-blue-500' },
  { id: 2, name: 'مجمع الواحة السكني', client: 'مجموعة المدينة', status: 'Active', color: 'bg-green-500' },
  { id: 3, name: 'مركز التسوق الكبير', client: 'الشركة العربية للاستثمار', status: 'On Hold', color: 'bg-amber-500' },
  { id: 4, name: 'مستشفى النور', client: 'وزارة الصحة', status: 'Active', color: 'bg-purple-500' },
  { id: 5, name: 'مدرسة المستقبل', client: 'وزارة التعليم', status: 'Completed', color: 'bg-teal-500' },
];

export const timeEntries: TimeEntry[] = [
  {
    id: 1,
    employeeId: 1,
    projectId: 1,
    taskId: 2,
    startTime: '2023-09-15T08:30:00',
    endTime: '2023-09-15T12:15:00',
    duration: 13500, // 3.75 ساعات بالثواني
    description: 'عمل على تصميم الواجهة الخارجية',
    date: '2023-09-15',
    status: 'completed'
  },
  {
    id: 2,
    employeeId: 1,
    projectId: 1,
    taskId: 3,
    startTime: '2023-09-15T13:00:00',
    endTime: '2023-09-15T17:00:00',
    duration: 14400, // 4 ساعات بالثواني
    description: 'مراجعة المخططات مع فريق الهندسة',
    date: '2023-09-15',
    status: 'completed'
  },
  {
    id: 3,
    employeeId: 1,
    projectId: 2,
    taskId: 5,
    startTime: '2023-09-16T09:00:00',
    endTime: '2023-09-16T13:30:00',
    duration: 16200, // 4.5 ساعات بالثواني
    description: 'وضع التصاميم الأولية للمشروع',
    date: '2023-09-16',
    status: 'completed'
  },
  {
    id: 4,
    employeeId: 1,
    projectId: 4,
    taskId: null,
    startTime: '2023-09-16T14:15:00',
    endTime: '2023-09-16T16:45:00',
    duration: 9000, // 2.5 ساعات بالثواني
    description: 'اجتماع مع العميل لمناقشة المتطلبات',
    date: '2023-09-16',
    status: 'completed'
  },
  {
    id: 5,
    employeeId: 1,
    projectId: 1,
    taskId: 4,
    startTime: new Date().toISOString(),
    endTime: null,
    duration: null,
    description: 'العمل على تعديلات التصميم',
    date: new Date().toISOString().split('T')[0],
    status: 'active'
  }
];

export const leaves: Leave[] = [
  {
    id: 1,
    employeeId: 6,
    startDate: '2023-09-10',
    endDate: '2023-09-20',
    type: 'Annual',
    status: 'Approved',
    reason: 'إجازة عائلية'
  },
  {
    id: 2,
    employeeId: 3,
    startDate: '2023-09-25',
    endDate: '2023-09-26',
    type: 'Personal',
    status: 'Approved',
    reason: 'مناسبة عائلية'
  },
  {
    id: 3,
    employeeId: 2,
    startDate: '2023-10-05',
    endDate: '2023-10-07',
    type: 'Sick',
    status: 'Pending',
    reason: 'زيارة طبيب'
  }
];

// حساب احصائيات الوقت لموظف معين
export const calculateTimeStats = (employeeId: number): TimeStats => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const employeeEntries = timeEntries.filter(entry => entry.employeeId === employeeId);
  
  // تجميع وقت اليوم
  const todaySeconds = employeeEntries
    .filter(entry => entry.date === today && entry.status === 'completed')
    .reduce((total, entry) => total + (entry.duration || 0), 0);
  
  // تجميع وقت الأسبوع
  const weekSeconds = employeeEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entry.status === 'completed';
    })
    .reduce((total, entry) => total + (entry.duration || 0), 0);
  
  // تجميع وقت الشهر
  const monthSeconds = employeeEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= monthStart && entry.status === 'completed';
    })
    .reduce((total, entry) => total + (entry.duration || 0), 0);
  
  // تجميع وقت كل مشروع
  const projectSeconds = employeeEntries
    .filter(entry => entry.status === 'completed' && entry.projectId !== null)
    .reduce((projects, entry) => {
      if (entry.projectId !== null) {
        if (!projects[entry.projectId]) {
          projects[entry.projectId] = 0;
        }
        projects[entry.projectId] += entry.duration || 0;
      }
      return projects;
    }, {} as {[projectId: number]: number});
  
  return {
    today: todaySeconds,
    week: weekSeconds,
    month: monthSeconds,
    projects: projectSeconds
  };
};

// تنسيق الوقت بالثواني إلى تنسيق ساعات:دقائق
export const formatTimeSpent = (seconds: number): string => {
  if (!seconds) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// الحصول على معلومات الموظف الحالي
export const getCurrentEmployeeStatus = (employeeId: number): {
  isActive: boolean;
  currentEntry: TimeEntry | null;
} => {
  const activeEntry = timeEntries.find(
    entry => entry.employeeId === employeeId && entry.status === 'active'
  );
  
  return {
    isActive: !!activeEntry,
    currentEntry: activeEntry || null
  };
};

// الحصول على معلومات المشروع من خلال معرفه
export const getProjectById = (projectId: number | null): Project | null => {
  if (projectId === null) return null;
  return projects.find(project => project.id === projectId) || null;
};

// دالة إضافة تسجيل وقت جديد
export const startNewTimeEntry = (
  employeeId: number,
  projectId: number | null,
  description: string
): TimeEntry => {
  const newEntry: TimeEntry = {
    id: timeEntries.length + 1,
    employeeId,
    projectId,
    taskId: null,
    startTime: new Date().toISOString(),
    endTime: null,
    duration: null,
    description,
    date: new Date().toISOString().split('T')[0],
    status: 'active'
  };
  
  // في التطبيق الحقيقي: إضافة تسجيل الوقت إلى قاعدة البيانات
  // timeEntries.push(newEntry);
  
  return newEntry;
};

// دالة إنهاء تسجيل وقت نشط
export const stopTimeEntry = (entryId: number): TimeEntry | null => {
  const entryIndex = timeEntries.findIndex(entry => entry.id === entryId);
  if (entryIndex === -1) return null;
  
  const entry = timeEntries[entryIndex];
  const endTime = new Date().toISOString();
  const startTimeMs = new Date(entry.startTime).getTime();
  const endTimeMs = new Date(endTime).getTime();
  const durationSeconds = Math.floor((endTimeMs - startTimeMs) / 1000);
  
  const updatedEntry: TimeEntry = {
    ...entry,
    endTime,
    duration: durationSeconds,
    status: 'completed'
  };
  
  // في التطبيق الحقيقي: تحديث تسجيل الوقت في قاعدة البيانات
  // timeEntries[entryIndex] = updatedEntry;
  
  return updatedEntry;
};
