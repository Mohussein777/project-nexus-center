import React, { createContext, useContext, useState, useEffect } from 'react';

// Available languages
export type Language = 'ar' | 'en';

// Context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Dashboard
    'dashboard': 'Dashboard',
    'overview': 'Overview',
    'stats': 'Statistics',
    
    // Navigation
    'projects': 'Projects',
    'clients': 'Clients',
    'employees': 'Employees',
    'financial': 'Financial',
    'settings': 'Settings',
    
    // Clients section
    'allClients': 'All Clients',
    'searchClients': 'Search clients...',
    'filter': 'Filter',
    'newClient': 'New Client',
    'active': 'Active',
    'inactive': 'Inactive',
    'corporate': 'Corporate',
    'government': 'Government',
    'individual': 'Individual',
    'viewProfile': 'View Profile',
    'clientProjects': 'Projects',
    'invoices': 'Invoices',
    'noClientsFound': 'No clients found',
    'searchDescriptionEmpty': 'No clients have been added yet. Add a new client to get started.',
    'searchDescriptionNoMatch': 'We couldn\'t find any clients matching your search. Try adjusting your search criteria.',
    'addNewClient': 'Add New Client',
    
    // Client form
    'clientDetails': 'Client Details',
    'name': 'Name',
    'contactPerson': 'Contact Person',
    'email': 'Email',
    'phone': 'Phone',
    'location': 'Location',
    'clientType': 'Client Type',
    'status': 'Status',
    'save': 'Save',
    'cancel': 'Cancel',
    'selectClientType': 'Select Client Type',
    'selectStatus': 'Select Status',
    'savingClient': 'Saving...',
    'saveClient': 'Save Client',
    'enterClientName': 'Enter client name',
    'enterContactName': 'Enter contact person name',
    'enterEmail': 'Enter email address',
    'enterPhone': 'Enter phone number',
    'enterLocation': 'Enter client location',
    'clientAddedSuccess': 'Client Added Successfully',
    'clientAddedSuccessDesc': 'Client {name} has been added successfully.',
    'failedToAddClient': 'Failed to add client',
    'error': 'Error',
    'errorAddingClient': 'An error occurred while adding the client. Please try again.',
    'fillClientDetails': 'Fill in all required information to add a new client.',
    
    // Interactions
    'interactionType': 'Interaction Type',
    'dateTime': 'Date & Time',
    'employee': 'Employee',
    'summary': 'Summary',
    'sentiment': 'Sentiment',
    'followup': 'This interaction requires follow-up',
    'followupDate': 'Follow-up Date',
    'meeting': 'Meeting',
    'call': 'Call',
    'emailInteraction': 'Email',
    'note': 'Note',
    'positive': 'Positive',
    'neutral': 'Neutral',
    'negative': 'Negative',
    'selectType': 'Select Type',
    'employeeName': 'Employee who interacted',
    'describeInteraction': 'Describe the interaction...',
    'selectSentiment': 'Select sentiment (optional)',

    // Projects section
    'projects': 'Projects',
    'allProjects': 'All Projects',
    'searchProjects': 'Search projects...',
    'newProject': 'New Project',
    'projectName': 'Project Name',
    'projectNumber': 'Project Number',
    'projectDescription': 'Project Description',
    'client': 'Client',
    'status': 'Status',
    'startDate': 'Start Date',
    'endDate': 'End Date',
    'budget': 'Budget',
    'priority': 'Priority',
    'projectType': 'Project Type',
    'selectClient': 'Select Client',
    'selectStatus': 'Select Status',
    'selectDate': 'Select Date',
    'selectPriority': 'Select Priority',
    'selectProjectType': 'Select Project Type',
    'planning': 'Planning',
    'onTrack': 'On Track',
    'atRisk': 'At Risk',
    'delayed': 'Delayed',
    'onHold': 'On Hold',
    'completed': 'Completed',
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'urgent': 'Urgent',
    'development': 'Development',
    'design': 'Design',
    'marketing': 'Marketing',
    'research': 'Research',
    'consulting': 'Consulting',
    'cancel': 'Cancel',
    'saving': 'Saving...',
    'updateProject': 'Update Project',
    'createProject': 'Create Project',
    'noProjectsFound': 'No projects found. Try adjusting your search criteria.',
    'error': 'Error',
    'errorLoadingProjects': 'Failed to load projects',
    'projectCreatedSuccess': 'Project created successfully',
    'projectUpdateSuccess': 'Project updated successfully',
    'projectCreateError': 'Failed to create project',
  },
  ar: {
    // Dashboard
    'dashboard': 'لوحة التحكم',
    'overview': 'نظرة عامة',
    'stats': 'الإحصائيات',
    
    // Navigation
    'projects': 'المشاريع',
    'clients': 'العملاء',
    'employees': 'الموظفون',
    'financial': 'المالية',
    'settings': 'الإعدادات',
    
    // Clients section
    'allClients': 'جميع العملاء',
    'searchClients': 'البحث عن العملاء...',
    'filter': 'تصفية',
    'newClient': 'عميل جديد',
    'active': 'نشط',
    'inactive': 'غير نشط',
    'corporate': 'شركة',
    'government': 'حكومي',
    'individual': 'فرد',
    'viewProfile': 'عرض الملف',
    'clientProjects': 'المشاريع',
    'invoices': 'الفواتير',
    'noClientsFound': 'لم يتم العثور على عملاء',
    'searchDescriptionEmpty': 'لم يتم إضافة أي عملاء حتى الآن. أضف عميلًا جديدًا للبدء.',
    'searchDescriptionNoMatch': 'لم نجد أي عميل يطابق بحثك. جرب تعديل معايير البحث.',
    'addNewClient': 'إضافة عميل جديد',
    
    // Client form
    'clientDetails': 'تفاصيل العميل',
    'name': 'الاسم',
    'contactPerson': 'الشخص المسؤول',
    'email': 'البريد الإلكتروني',
    'phone': 'الهاتف',
    'location': 'الموقع',
    'clientType': 'نوع العميل',
    'status': 'الحالة',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'selectClientType': 'اختر نوع العميل',
    'selectStatus': 'اختر حالة العميل',
    'savingClient': 'جاري الحفظ...',
    'saveClient': 'حفظ العميل',
    'enterClientName': 'أدخل اسم العميل',
    'enterContactName': 'أدخل اسم الشخص المسؤول',
    'enterEmail': 'أدخل البريد الإلكتروني',
    'enterPhone': 'أدخل رقم الهاتف',
    'enterLocation': 'أدخل موقع العميل',
    'clientAddedSuccess': 'تم إضافة العميل بنجاح',
    'clientAddedSuccessDesc': 'تمت إضافة العميل {name} بنجاح.',
    'failedToAddClient': 'فشل في إضافة العميل',
    'error': 'خطأ',
    'errorAddingClient': 'حدث خطأ أثناء إضافة العميل. يرجى المحاولة مرة أخرى.',
    'fillClientDetails': 'قم بملء جميع المعلومات المطلوبة لإضافة عميل جديد.',
    
    // Interactions
    'interactionType': 'نوع التفاعل',
    'dateTime': 'التاريخ والوقت',
    'employee': 'الموظف',
    'summary': 'ملخص',
    'sentiment': 'الانطباع',
    'followup': 'هذا التفاعل يتطلب متابعة',
    'followupDate': 'تاريخ المتابعة',
    'meeting': 'اجتماع',
    'call': 'مكالمة هاتفية',
    'emailInteraction': 'بريد إلكتروني',
    'note': 'ملاحظة',
    'positive': 'إيجابي',
    'neutral': 'محايد',
    'negative': 'سلبي',
    'selectType': 'اختر النوع',
    'employeeName': 'اسم الموظف الذي قام بالتفاعل',
    'describeInteraction': 'صف التفاعل...',
    'selectSentiment': 'اختر الانطباع (اختياري)',

    // Projects section
    'projects': 'المشاريع',
    'allProjects': 'جميع المشاريع',
    'searchProjects': 'البحث عن المشاريع...',
    'newProject': 'مشروع جديد',
    'projectName': 'اسم المشروع',
    'projectNumber': 'رقم المشروع',
    'projectDescription': 'وصف المشروع',
    'client': 'العميل',
    'status': 'حالة المشروع',
    'startDate': 'تاريخ البدء',
    'endDate': 'تاريخ الانتهاء',
    'budget': 'الميزانية',
    'priority': 'الأولوية',
    'projectType': 'نوع المشروع',
    'selectClient': 'اختر عميل',
    'selectStatus': 'اختر حالة المشروع',
    'selectDate': 'اختر تاريخ',
    'selectPriority': 'اختر الأولوية',
    'selectProjectType': 'اختر نوع المشروع',
    'planning': 'تخطيط',
    'onTrack': 'في المسار الصحيح',
    'atRisk': 'في خطر',
    'delayed': 'متأخر',
    'onHold': 'معلق',
    'completed': 'مكتمل',
    'low': 'منخفضة',
    'medium': 'متوسطة',
    'high': 'عالية',
    'urgent': 'عاجلة',
    'development': 'تطوير برمجي',
    'design': 'تصميم',
    'marketing': 'تسويق',
    'research': 'بحث',
    'consulting': 'استشارة',
    'cancel': 'إلغاء',
    'saving': 'جاري الحفظ...',
    'updateProject': 'تحديث المشروع',
    'createProject': 'إنشاء المشروع',
    'noProjectsFound': 'لم يتم العثور على مشاريع. حاول تعديل معايير البحث.',
    'error': 'خطأ',
    'errorLoadingProjects': 'فشل في تحميل المشاريع',
    'projectCreatedSuccess': 'تم إنشاء المشروع بنجاح',
    'projectUpdateSuccess': 'تم تحديث المشروع بنجاح',
    'projectCreateError': 'فشل في إنشاء المشروع',
  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial language from localStorage or use browser language or default to English
  const getInitialLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) return savedLanguage;
    
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'ar' ? 'ar' : 'en';
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  // Update document direction and localStorage when language changes
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.className = language === 'ar' ? 'rtl' : '';
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);
