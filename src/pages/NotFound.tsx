
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="glass-card dark:glass-card-dark rounded-xl p-10 text-center max-w-md mx-auto">
        <h1 className="text-8xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {language === 'ar' 
            ? 'الصفحة التي تبحث عنها غير موجودة.'
            : 'The page you\'re looking for doesn\'t exist.'}
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          {language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Return to Home Page'}
        </button>
      </div>
    </div>
  );
};

export default NotFound;
