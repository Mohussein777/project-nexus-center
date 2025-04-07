
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

// Define translations
const translations: Record<string, Record<string, string>> = {
  en: {
    // Dashboard
    dashboard: 'Dashboard',
    projects: 'Projects',
    clients: 'Clients',
    employees: 'Employees',
    financial: 'Financial',
    settings: 'Settings',
    recentProjects: 'Recent Projects',
    activeProjects: 'Active Projects',
    completedProjects: 'Completed Projects',
    pendingProjects: 'Pending Projects',
    projectStats: 'Project Statistics',
    financialOverview: 'Financial Overview',
    recentActivities: 'Recent Activities',
    viewAll: 'View All',
    
    // Projects
    addProject: 'Add Project',
    projectName: 'Project Name',
    status: 'Status',
    client: 'Client',
    startDate: 'Start Date',
    endDate: 'End Date',
    progress: 'Progress',
    actions: 'Actions',
    active: 'Active',
    completed: 'Completed',
    pending: 'Pending',
    onHold: 'On Hold',
    cancelled: 'Cancelled',
    search: 'Search',
    projectDetails: 'Project Details',
    editProject: 'Edit Project',
    deleteProject: 'Delete Project',
    projectDescription: 'Project Description',
    projectTasks: 'Project Tasks',
    
    // Project Tasks
    addTask: 'Add Task',
    taskName: 'Task Name',
    priority: 'Priority',
    assignedTo: 'Assigned To',
    dueDate: 'Due Date',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    taskStatus: 'Task Status',
    notStarted: 'Not Started',
    inProgress: 'In Progress',
    underReview: 'Under Review',
    taskDetails: 'Task Details',
    editTask: 'Edit Task',
    deleteTask: 'Delete Task',
    description: 'Description',
    
    // Clients
    addClient: 'Add Client',
    clientName: 'Client Name',
    location: 'Location',
    phone: 'Phone',
    email: 'Email',
    contactPerson: 'Contact Person',
    clientType: 'Client Type',
    individual: 'Individual',
    company: 'Company',
    government: 'Government',
    searchClients: 'Search clients',
    clientDetails: 'Client Details',
    editClient: 'Edit Client',
    deleteClient: 'Delete Client',
    contracts: 'Contracts',
    interactions: 'Interactions',
    
    // Employees
    addEmployee: 'Add Employee',
    employeeName: 'Employee Name',
    position: 'Position',
    department: 'Department',
    joinDate: 'Join Date',
    employeeStatus: 'Status',
    employeeDetails: 'Employee Details',
    editEmployee: 'Edit Employee',
    deleteEmployee: 'Delete Employee',
    attendance: 'Attendance',
    leaves: 'Leaves',
    performance: 'Performance',
    
    // Financial
    income: 'Income',
    expenses: 'Expenses',
    balance: 'Balance',
    transactions: 'Transactions',
    addTransaction: 'Add Transaction',
    transactionDate: 'Date',
    amount: 'Amount',
    category: 'Category',
    paymentMethod: 'Payment Method',
    reference: 'Reference',
    transactionDetails: 'Transaction Details',
    editTransaction: 'Edit Transaction',
    deleteTransaction: 'Delete Transaction',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    welcome: 'Welcome',
    welcomeBack: 'Welcome Back',
    emailAddress: 'Email Address',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember Me',
    dontHaveAccount: 'Don\'t have an account?',
    alreadyHaveAccount: 'Already have an account?',
    signInInstructions: 'Enter your credentials to access your account',
    signUpInstructions: 'Enter your details to create an account',
    resetPassword: 'Reset Password',
    resetPasswordInstructions: 'Enter your email and we\'ll send you a reset link',
    sendResetLink: 'Send Reset Link',
    createAccount: 'Create Account',
    
    // Form validation
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordsDoNotMatch: 'Passwords do not match',
    
    // Success/Error messages
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    operationSuccessful: 'Operation completed successfully',
    operationFailed: 'Operation failed',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm',
    
    // Settings
    generalSettings: 'General Settings',
    userSettings: 'User Settings',
    notifications: 'Notifications',
    profile: 'Profile',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    
    // Time
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    
    // Common actions
    add: 'Add',
    edit: 'Edit',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    
    // Profile
    myProfile: 'My Profile',
    firstName: 'First Name',
    lastName: 'Last Name',
    jobTitle: 'Job Title',
    bio: 'Bio',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    updatePassword: 'Update Password',
    profileDetails: 'Profile Details',
    securitySettings: 'Security Settings',
    editProfile: 'Edit Profile',
    uploadNewPhoto: 'Upload New Photo',
    removePhoto: 'Remove Photo',
    tellUsAboutYourself: 'Tell us about yourself...',
    memberSince: 'Member Since',
    notProvided: 'Not Provided',
    notAvailable: 'Not Available',
    noJobTitle: 'No Job Title',

    // Additional translations for new features
    all: 'All',
    unread: 'Unread',
    read: 'Read',
    markAsRead: 'Mark as Read',
    markAllAsRead: 'Mark All as Read',
    deleteAllRead: 'Delete All Read',
    noNotifications: 'No Notifications',
    noNotificationsFound: 'No Notifications Found',
    noNotificationsDescription: 'You don\'t have any notifications at the moment.',
    allNotificationsDescription: 'View all your notifications.',
    unreadNotificationsDescription: 'View only unread notifications.',
    readNotificationsDescription: 'View only read notifications.',
    yourNotifications: 'Your Notifications',
    manageNotifications: 'Manage All Notifications',
    loading: 'Loading...',
    newNotification: 'New Notification',
    notificationMarkedAsRead: 'Notification marked as read',
    notificationDeleted: 'Notification deleted',
    allNotificationsMarkedAsRead: 'All notifications marked as read',
    allReadNotificationsDeleted: 'All read notifications deleted',
    noUnreadNotifications: 'No unread notifications',
    noReadNotificationsToDelete: 'No read notifications to delete',
    actionFailed: 'Action failed',
    failedToLoadNotifications: 'Failed to load notifications',
    allNotificationsRead: 'All Notifications Read',
    allNotificationsReadMessage: 'All notifications have been marked as read',
    signOutSuccess: 'Signed Out',
    signOutSuccessMessage: 'You have been signed out successfully',
    signOutErrorMessage: 'There was an error signing out',
    updating: 'Updating...',
    saving: 'Saving...',
    profileUpdated: 'Profile Updated',
    profileUpdatedSuccessfully: 'Your profile has been updated successfully',
    profileUpdateFailed: 'Failed to update profile',
    passwordUpdatedSuccessfully: 'Your password has been updated successfully',
    passwordUpdateFailed: 'Failed to update password',
    currentPasswordIncorrect: 'Current password is incorrect',
    enterNewPasswordInstructions: 'Please enter your new password',
    setNewPassword: 'Set New Password',
    passwordResetSuccessful: 'Password reset successful',
    passwordResetError: 'Error resetting password',
    invalidResetLink: 'Invalid or expired reset link',
  },
  ar: {
    // Dashboard
    dashboard: 'لوحة التحكم',
    projects: 'المشاريع',
    clients: 'العملاء',
    employees: 'الموظفين',
    financial: 'المالية',
    settings: 'الإعدادات',
    recentProjects: 'المشاريع الحديثة',
    activeProjects: 'المشاريع النشطة',
    completedProjects: 'المشاريع المكتملة',
    pendingProjects: 'المشاريع المعلقة',
    projectStats: 'إحصائيات المشاريع',
    financialOverview: 'النظرة المالية العامة',
    recentActivities: 'الأنشطة الحديثة',
    viewAll: 'عرض الكل',
    
    // Projects
    addProject: 'إضافة مشروع',
    projectName: 'اسم المشروع',
    status: 'الحالة',
    client: 'العميل',
    startDate: 'تاريخ البدء',
    endDate: 'تاريخ الانتهاء',
    progress: 'التقدم',
    actions: 'الإجراءات',
    active: 'نشط',
    completed: 'مكتمل',
    pending: 'معلق',
    onHold: 'متوقف مؤقتا',
    cancelled: 'ملغى',
    search: 'بحث',
    projectDetails: 'تفاصيل المشروع',
    editProject: 'تعديل المشروع',
    deleteProject: 'حذف المشروع',
    projectDescription: 'وصف المشروع',
    projectTasks: 'مهام المشروع',
    
    // Project Tasks
    addTask: 'إضافة مهمة',
    taskName: 'اسم المهمة',
    priority: 'الأولوية',
    assignedTo: 'مسند إلى',
    dueDate: 'تاريخ الاستحقاق',
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
    taskStatus: 'حالة المهمة',
    notStarted: 'لم يبدأ',
    inProgress: 'قيد التنفيذ',
    underReview: 'قيد المراجعة',
    taskDetails: 'تفاصيل المهمة',
    editTask: 'تعديل المهمة',
    deleteTask: 'حذف المهمة',
    description: 'الوصف',
    
    // Clients
    addClient: 'إضافة عميل',
    clientName: 'اسم العميل',
    location: 'الموقع',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    contactPerson: 'الشخص المسؤول',
    clientType: 'نوع العميل',
    individual: 'فرد',
    company: 'شركة',
    government: 'حكومي',
    searchClients: 'بحث عن عملاء',
    clientDetails: 'تفاصيل العميل',
    editClient: 'تعديل العميل',
    deleteClient: 'حذف العميل',
    contracts: 'العقود',
    interactions: 'التفاعلات',
    
    // Employees
    addEmployee: 'إضافة موظف',
    employeeName: 'اسم الموظف',
    position: 'المنصب',
    department: 'القسم',
    joinDate: 'تاريخ الانضمام',
    employeeStatus: 'الحالة',
    employeeDetails: 'تفاصيل الموظف',
    editEmployee: 'تعديل الموظف',
    deleteEmployee: 'حذف الموظف',
    attendance: 'الحضور',
    leaves: 'الإجازات',
    performance: 'الأداء',
    
    // Financial
    income: 'الدخل',
    expenses: 'المصروفات',
    balance: 'الرصيد',
    transactions: 'المعاملات',
    addTransaction: 'إضافة معاملة',
    transactionDate: 'التاريخ',
    amount: 'المبلغ',
    category: 'الفئة',
    paymentMethod: 'طريقة الدفع',
    reference: 'المرجع',
    transactionDetails: 'تفاصيل المعاملة',
    editTransaction: 'تعديل المعاملة',
    deleteTransaction: 'حذف المعاملة',
    
    // Auth
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    signOut: 'تسجيل الخروج',
    welcome: 'مرحبا',
    welcomeBack: 'مرحبا بعودتك',
    emailAddress: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    signInInstructions: 'أدخل بيانات الاعتماد الخاصة بك للوصول إلى حسابك',
    signUpInstructions: 'أدخل بياناتك لإنشاء حساب',
    resetPassword: 'إعادة تعيين كلمة المرور',
    resetPasswordInstructions: 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين',
    sendResetLink: 'إرسال رابط إعادة التعيين',
    createAccount: 'إنشاء حساب',
    
    // Form validation
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'الرجاء إدخال عنوان بريد إلكتروني صالح',
    passwordTooShort: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    passwordsDoNotMatch: 'كلمات المرور غير متطابقة',
    
    // Success/Error messages
    success: 'نجاح',
    error: 'خطأ',
    warning: 'تحذير',
    info: 'معلومات',
    operationSuccessful: 'تمت العملية بنجاح',
    operationFailed: 'فشلت العملية',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    delete: 'حذف',
    confirm: 'تأكيد',
    
    // Settings
    generalSettings: 'الإعدادات العامة',
    userSettings: 'إعدادات المستخدم',
    notifications: 'الإشعارات',
    profile: 'الملف الشخصي',
    language: 'اللغة',
    theme: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    system: 'النظام',
    
    // Time
    today: 'اليوم',
    yesterday: 'الأمس',
    tomorrow: 'غداً',
    thisWeek: 'هذا الأسبوع',
    lastWeek: 'الأسبوع الماضي',
    thisMonth: 'هذا الشهر',
    lastMonth: 'الشهر الماضي',
    
    // Common actions
    add: 'إضافة',
    edit: 'تعديل',
    submit: 'إرسال',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    
    // Profile
    myProfile: 'ملفي الشخصي',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    jobTitle: 'المسمى الوظيفي',
    bio: 'نبذة',
    changePassword: 'تغيير كلمة المرور',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
    updatePassword: 'تحديث كلمة المرور',
    profileDetails: 'تفاصيل الملف الشخصي',
    securitySettings: 'إعدادات الأمان',
    editProfile: 'تعديل الملف الشخصي',
    uploadNewPhoto: 'تحميل صورة جديدة',
    removePhoto: 'إزالة الصورة',
    tellUsAboutYourself: 'أخبرنا عن نفسك...',
    memberSince: 'عضو منذ',
    notProvided: 'غير متوفر',
    notAvailable: 'غير متاح',
    noJobTitle: 'لا يوجد مسمى وظيفي',

    // Additional translations for new features
    all: 'الكل',
    unread: 'غير مقروءة',
    read: 'مقروءة',
    markAsRead: 'تعيين كمقروء',
    markAllAsRead: 'تعيين الكل كمقروء',
    deleteAllRead: 'حذف المقروءة',
    noNotifications: 'لا توجد إشعارات',
    noNotificationsFound: 'لم يتم العثور على إشعارات',
    noNotificationsDescription: 'ليس لديك أي إشعارات في الوقت الحالي.',
    allNotificationsDescription: 'عرض جميع الإشعارات الخاصة بك.',
    unreadNotificationsDescription: 'عرض الإشعارات غير المقروءة فقط.',
    readNotificationsDescription: 'عرض الإشعارات المقروءة فقط.',
    yourNotifications: 'إشعاراتك',
    manageNotifications: 'إدارة جميع الإشعارات',
    loading: 'جارٍ التحميل...',
    newNotification: 'إشعار جديد',
    notificationMarkedAsRead: 'تم تعيين الإشعار كمقروء',
    notificationDeleted: 'تم حذف الإشعار',
    allNotificationsMarkedAsRead: 'تم تعيين جميع الإشعارات كمقروءة',
    allReadNotificationsDeleted: 'تم حذف جميع الإشعارات المقروءة',
    noUnreadNotifications: 'لا توجد إشعارات غير مقروءة',
    noReadNotificationsToDelete: 'لا توجد إشعارات مقروءة للحذف',
    actionFailed: 'فشل الإجراء',
    failedToLoadNotifications: 'فشل في تحميل الإشعارات',
    allNotificationsRead: 'جميع الإشعارات مقروءة',
    allNotificationsReadMessage: 'تم تعيين جميع الإشعارات كمقروءة',
    signOutSuccess: 'تم تسجيل الخروج',
    signOutSuccessMessage: 'تم تسجيل خروجك بنجاح',
    signOutErrorMessage: 'حدث خطأ أثناء تسجيل الخروج',
    updating: 'جاري التحديث...',
    saving: 'جاري الحفظ...',
    profileUpdated: 'تم تحديث الملف الشخصي',
    profileUpdatedSuccessfully: 'تم تحديث ملفك الشخصي بنجاح',
    profileUpdateFailed: 'فشل تحديث الملف الشخصي',
    passwordUpdatedSuccessfully: 'تم تحديث كلمة المرور بنجاح',
    passwordUpdateFailed: 'فشل تحديث كلمة المرور',
    currentPasswordIncorrect: 'كلمة المرور الحالية غير صحيحة',
    enterNewPasswordInstructions: 'الرجاء إدخال كلمة المرور الجديدة',
    setNewPassword: 'تعيين كلمة مرور جديدة',
    passwordResetSuccessful: 'تم إعادة تعيين كلمة المرور بنجاح',
    passwordResetError: 'خطأ في إعادة تعيين كلمة المرور',
    invalidResetLink: 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('ar'); // Default to Arabic

  // Get persisted language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Persist language to localStorage on change
  useEffect(() => {
    localStorage.setItem('language', language);
    // Set HTML dir attribute for RTL support
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const isRtl = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
