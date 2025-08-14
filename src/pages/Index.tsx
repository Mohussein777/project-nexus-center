
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Briefcase, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { t, language } = useLanguage();
  
  return (
    <MainLayout>
      <div className="hero-section min-h-[90vh] flex flex-col items-center justify-center relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-gentle"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="hero-card p-12 max-w-4xl w-full text-center space-y-8 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            {language === 'ar' ? 'مركز نكسس للمشاريع' : 'Project Nexus Center'}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {language === 'ar' 
              ? 'منصة متكاملة وحديثة لإدارة المشاريع، العملاء، والموظفين بكفاءة عالية وتجربة استخدام متميزة'
              : 'A modern, integrated platform for managing projects, clients, and employees with high efficiency and exceptional user experience'}
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center mt-12">
            <Link to="/dashboard">
              <Button size="lg" className="gap-3 px-8 py-4 text-lg rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                <ArrowRight className={`h-5 w-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
            
            <Link to="/projects">
              <Button size="lg" variant="outline" className="gap-3 px-8 py-4 text-lg rounded-2xl border-2 border-primary/30 hover:border-primary hover:bg-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {language === 'ar' ? 'استعراض المشاريع' : 'Browse Projects'}
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="feature-card group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors duration-300">
                {language === 'ar' ? 'إدارة المشاريع' : 'Project Management'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {language === 'ar' 
                  ? 'تتبع تقدم المشاريع، إدارة المهام، والمواعيد النهائية بكفاءة عالية مع لوحات تحكم تفاعلية'
                  : 'Track project progress, manage tasks, and deadlines efficiently with interactive dashboards'}
              </p>
            </div>
            
            <div className="feature-card group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 group-hover:text-green-600 transition-colors duration-300">
                {language === 'ar' ? 'إدارة العملاء' : 'Client Management'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {language === 'ar' 
                  ? 'إدارة شاملة لبيانات العملاء، التواصل، العقود، وتتبع رضا العملاء'
                  : 'Comprehensive management of client data, communications, contracts, and satisfaction tracking'}
              </p>
            </div>
            
            <div className="feature-card group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 group-hover:text-purple-600 transition-colors duration-300">
                {language === 'ar' ? 'إدارة الموظفين' : 'Employee Management'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {language === 'ar' 
                  ? 'تتبع الحضور، الأداء، ساعات العمل، وتعيين المهام مع تقارير مفصلة'
                  : 'Track attendance, performance, work hours, and task assignments with detailed reports'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
