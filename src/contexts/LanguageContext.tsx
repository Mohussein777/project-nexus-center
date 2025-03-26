
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
    'selectType': 'Select Type',
    'savingClient': 'Saving...',
    'saveClient': 'Save Client',
    
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
    'email': 'Email',
    'note': 'Note',
    'positive': 'Positive',
    'neutral': 'Neutral',
    'negative': 'Negative',
    'selectType': 'Select Type',
    'employeeName': 'Employee who interacted',
    'describeInteraction': 'Describe the interaction...',
    'selectSentiment': 'Select sentiment (optional)',
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
    'selectType': 'اختر النوع',
    'savingClient': 'جاري الحفظ...',
    'saveClient': 'حفظ العميل',
    
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
    'email': 'بريد إلكتروني',
    'note': 'ملاحظة',
    'positive': 'إيجابي',
    'neutral': 'محايد',
    'negative': 'سلبي',
    'selectType': 'اختر النوع',
    'employeeName': 'اسم الموظف الذي قام بالتفاعل',
    'describeInteraction': 'صف التفاعل...',
    'selectSentiment': 'اختر الانطباع (اختياري)',
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
