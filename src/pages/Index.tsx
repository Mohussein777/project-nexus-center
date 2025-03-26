
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { t, language } = useLanguage();
  
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="glass-card dark:glass-card-dark rounded-xl p-8 max-w-3xl w-full text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {language === 'ar' ? 'مركز نكسس للمشاريع' : 'Project Nexus Center'}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'منصة متكاملة لإدارة المشاريع، العملاء، والموظفين في مكان واحد'
              : 'An integrated platform for managing projects, clients, and employees in one place'}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
            
            <Link to="/projects">
              <Button size="lg" variant="outline" className="gap-2">
                {language === 'ar' ? 'استعراض المشاريع' : 'Browse Projects'}
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2">
                {language === 'ar' ? 'إدارة المشاريع' : 'Project Management'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'ar' 
                  ? 'تتبع تقدم المشاريع، المهام، والمواعيد النهائية'
                  : 'Track project progress, tasks, and deadlines'}
              </p>
            </div>
            
            <div className="bg-white/10 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2">
                {language === 'ar' ? 'إدارة العملاء' : 'Client Management'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'ar' 
                  ? 'إدارة بيانات العملاء، التواصل، والعقود'
                  : 'Manage client data, communications, and contracts'}
              </p>
            </div>
            
            <div className="bg-white/10 dark:bg-gray-800/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2">
                {language === 'ar' ? 'إدارة الموظفين' : 'Employee Management'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'ar' 
                  ? 'تتبع الحضور، الأداء، وتعيين المهام'
                  : 'Track attendance, performance, and task assignments'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
