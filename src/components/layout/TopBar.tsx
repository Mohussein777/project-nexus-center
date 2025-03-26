
import { useState } from 'react';
import { Menu, Bell, User, Search, ChevronRight, ChevronLeft, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TopBarProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  isRtl: boolean;
}

export function TopBar({ onToggleSidebar, sidebarCollapsed, isRtl }: TopBarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-border shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? 
              (isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />) : 
              (isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />)
            }
          </button>

          <div className={`relative ${isRtl ? 'mr-4 ml-0' : 'ml-4'}`}>
            <div className={`flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1.5 transition-all ${
              searchFocused ? 'ring-2 ring-primary/20 w-64' : 'w-48'
            }`}>
              <Search size={18} className="text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder={t('searchClients')}
                className="ml-2 bg-transparent border-none outline-none text-sm w-full placeholder-gray-500 dark:placeholder-gray-400"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleLanguage} 
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle language"
          >
            {language === 'ar' ? "EN" : "عربي"}
          </button>
          
          <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button className="flex items-center p-1 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                AD
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
