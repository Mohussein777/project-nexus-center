
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const translations: Record<Language, Record<string, string>> = {
    en: {
      // Dashboard
      dashboard: 'Dashboard',
      welcomeBack: 'Welcome back',
      teamActivity: 'Team Activity',
      activeProjects: 'Active Projects',
      totalClients: 'Total Clients',
      totalEmployees: 'Total Employees',
      pendingTasks: 'Pending Tasks',
      revenueThisMonth: 'Revenue This Month',
      viewActivity: 'View Activity',
      projectStatus: 'Project Status',
      financialOverview: 'Financial Overview',
      viewFinancial: 'View Financial Report',
      recentActivity: 'Recent Activity',
      viewAll: 'View All',
      noActivityFound: 'No activity found',
      
      // Sidebar
      home: 'Home',
      projects: 'Projects',
      clients: 'Clients',
      employees: 'Employees',
      attendance: 'Attendance',
      tasks: 'Tasks',
      financial: 'Financial',
      settings: 'Settings',
      
      // Projects
      allProjects: 'All Projects',
      searchProjects: 'Search projects...',
      newProject: 'New Project',
      noProjectsFound: 'No projects found',
      fillProjectDetails: 'Fill in the project details below to create a new project',
      projectDetails: 'Project Details',
      projectName: 'Project Name',
      projectNumber: 'Project Number',
      projectDescription: 'Description',
      client: 'Client',
      selectClient: 'Select a client',
      status: 'Status',
      selectStatus: 'Select status',
      planning: 'Planning',
      onTrack: 'On Track',
      atRisk: 'At Risk',
      delayed: 'Delayed',
      onHold: 'On Hold',
      completed: 'Completed',
      startDate: 'Start Date',
      endDate: 'End Date',
      selectDate: 'Select a date',
      budget: 'Budget',
      priority: 'Priority',
      selectPriority: 'Select priority',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
      projectType: 'Project Type',
      selectProjectType: 'Select project type',
      development: 'Development',
      design: 'Design',
      marketing: 'Marketing',
      research: 'Research',
      consulting: 'Consulting',
      cancel: 'Cancel',
      createProject: 'Create Project',
      updateProject: 'Update Project',
      saving: 'Saving...',
      projectCreatedSuccess: 'Project created successfully',
      projectCreateError: 'Error creating project',
      error: 'Error',
      errorLoadingProjects: 'Error loading projects',
      errorLoadingClients: 'Error loading clients',
      
      // Tasks
      newTask: 'New Task',
      taskName: 'Task Name',
      assignee: 'Assignee',
      selectAssignee: 'Select assignee',
      dueDate: 'Due Date',
      createTask: 'Create Task',
      noTasksFound: 'No tasks found',
      taskCreatedSuccess: 'Task created successfully',
      errorLoadingTasks: 'Error loading tasks',
      taskCreateError: 'Error creating task',
      filterTasks: 'Filter tasks...',
      taskDetails: 'Task Details',
      
      // Clients
      allClients: 'All Clients',
      searchClients: 'Search clients...',
      newClient: 'New Client',
      noClientsFound: 'No clients found',
      clientName: 'Client Name',
      contactPerson: 'Contact Person',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      clientType: 'Client Type',
      selectClientType: 'Select client type',
      clientStatus: 'Status',
      createClient: 'Create Client',
      
      // Financial
      revenue: 'Revenue',
      expenses: 'Expenses',
      profit: 'Profit',
      pendingInvoices: 'Pending Invoices',
      
      // Employees
      allEmployees: 'All Employees',
      searchEmployees: 'Search employees...',
      newEmployee: 'New Employee',
      noEmployeesFound: 'No employees found',
      employeeName: 'Employee Name',
      position: 'Position',
      department: 'Department',
      joinDate: 'Join Date',
      
      // Attendance
      date: 'Date',
      checkIn: 'Check In',
      checkOut: 'Check Out',
      hoursWorked: 'Hours Worked',
      
      // Settings
      generalSettings: 'General Settings',
      accountSettings: 'Account Settings',
      notificationSettings: 'Notification Settings',
      securitySettings: 'Security Settings',
      
      // General
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      add: 'Add',
      remove: 'Remove',
      update: 'Update',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      loading: 'Loading...',
      
      // Auth
      login: 'Login',
      register: 'Register',
      forgotPassword: 'Forgot Password',
      resetPassword: 'Reset Password',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      loginSuccess: 'Login successful',
      loginError: 'Login failed',
      registerSuccess: 'Registration successful',
      registerError: 'Registration failed',
    },
    ar: {
      // Dashboard
      dashboard: 'لوحة التحكم',
      welcomeBack: 'مرحبًا بعودتك',
      teamActivity: 'نشاط الفريق',
      activeProjects: 'المشاريع النشطة',
      totalClients: 'إجمالي العملاء',
      totalEmployees: 'إجمالي الموظفين',
      pendingTasks: 'المهام المعلقة',
      revenueThisMonth: 'الإيرادات هذا الشهر',
      viewActivity: 'عرض النشاط',
      projectStatus: 'حالة المشروع',
      financialOverview: 'نظرة عامة مالية',
      viewFinancial: 'عرض التقرير المالي',
      recentActivity: 'النشاط الأخير',
      viewAll: 'عرض الكل',
      noActivityFound: 'لم يتم العثور على نشاط',
      
      // Sidebar
      home: 'الرئيسية',
      projects: 'المشاريع',
      clients: 'العملاء',
      employees: 'الموظفين',
      attendance: 'الحضور',
      tasks: 'المهام',
      financial: 'المالية',
      settings: 'الإعدادات',
      
      // Projects
      allProjects: 'جميع المشاريع',
      searchProjects: 'البحث في المشاريع...',
      newProject: 'مشروع جديد',
      noProjectsFound: 'لم يتم العثور على مشاريع',
      fillProjectDetails: 'املأ تفاصيل المشروع أدناه لإنشاء مشروع جديد',
      projectDetails: 'تفاصيل المشروع',
      projectName: 'اسم المشروع',
      projectNumber: 'رقم المشروع',
      projectDescription: 'وصف المشروع',
      client: 'العميل',
      selectClient: 'اختر عميلاً',
      status: 'الحالة',
      selectStatus: 'اختر الحالة',
      planning: 'التخطيط',
      onTrack: 'في المسار',
      atRisk: 'في خطر',
      delayed: 'متأخر',
      onHold: 'معلق',
      completed: 'مكتمل',
      startDate: 'تاريخ البدء',
      endDate: 'تاريخ الانتهاء',
      selectDate: 'اختر تاريخًا',
      budget: 'الميزانية',
      priority: 'الأولوية',
      selectPriority: 'اختر الأولوية',
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية',
      urgent: 'عاجلة',
      projectType: 'نوع المشروع',
      selectProjectType: 'اختر نوع المشروع',
      development: 'تطوير',
      design: 'تصميم',
      marketing: 'تسويق',
      research: 'بحث',
      consulting: 'استشارات',
      cancel: 'إلغاء',
      createProject: 'إنشاء مشروع',
      updateProject: 'تحديث المشروع',
      saving: 'جاري الحفظ...',
      projectCreatedSuccess: 'تم إنشاء المشروع بنجاح',
      projectCreateError: 'خطأ في إنشاء المشروع',
      error: 'خطأ',
      errorLoadingProjects: 'خطأ في تحميل المشاريع',
      errorLoadingClients: 'خطأ في تحميل العملاء',
      
      // Tasks
      newTask: 'مهمة جديدة',
      taskName: 'اسم المهمة',
      assignee: 'المكلف',
      selectAssignee: 'اختر المكلف',
      dueDate: 'تاريخ الاستحقاق',
      createTask: 'إنشاء مهمة',
      noTasksFound: 'لم يتم العثور على مهام',
      taskCreatedSuccess: 'تم إنشاء المهمة بنجاح',
      errorLoadingTasks: 'خطأ في تحميل المهام',
      taskCreateError: 'خطأ في إنشاء المهمة',
      filterTasks: 'تصفية المهام...',
      taskDetails: 'تفاصيل المهمة',
      
      // Clients
      allClients: 'جميع العملاء',
      searchClients: 'البحث عن عملاء...',
      newClient: 'عميل جديد',
      noClientsFound: 'لم يتم العثور على عملاء',
      clientName: 'اسم العميل',
      contactPerson: 'الشخص المسؤول',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      location: 'الموقع',
      clientType: 'نوع العميل',
      selectClientType: 'اختر نوع العميل',
      clientStatus: 'الحالة',
      createClient: 'إنشاء عميل',
      
      // Financial
      revenue: 'الإيرادات',
      expenses: 'المصروفات',
      profit: 'الأرباح',
      pendingInvoices: 'الفواتير المعلقة',
      
      // Employees
      allEmployees: 'جميع الموظفين',
      searchEmployees: 'البحث عن موظفين...',
      newEmployee: 'موظف جديد',
      noEmployeesFound: 'لم يتم العثور على موظفين',
      employeeName: 'اسم الموظف',
      position: 'المنصب',
      department: 'القسم',
      joinDate: 'تاريخ الانضمام',
      
      // Attendance
      date: 'التاريخ',
      checkIn: 'تسجيل الدخول',
      checkOut: 'تسجيل الخروج',
      hoursWorked: 'ساعات العمل',
      
      // Settings
      generalSettings: 'الإعدادات العامة',
      accountSettings: 'إعدادات الحساب',
      notificationSettings: 'إعدادات الإشعارات',
      securitySettings: 'إعدادات الأمان',
      
      // General
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
      add: 'إضافة',
      remove: 'إزالة',
      update: 'تحديث',
      success: 'نجاح',
      warning: 'تحذير',
      info: 'معلومات',
      loading: 'جاري التحميل...',
      
      // Auth
      login: 'تسجيل الدخول',
      register: 'تسجيل',
      forgotPassword: 'نسيت كلمة المرور',
      resetPassword: 'إعادة تعيين كلمة المرور',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      loginSuccess: 'تم تسجيل الدخول بنجاح',
      loginError: 'فشل تسجيل الدخول',
      registerSuccess: 'تم التسجيل بنجاح',
      registerError: 'فشل التسجيل',
    },
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
