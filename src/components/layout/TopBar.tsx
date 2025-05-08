
import {
  Bell,
  Menu,
  Search,
  Moon,
  Sun,
  X,
  UserCircle,
  Globe,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { TimerButton } from '../employees/attendance/TimerButton';

interface TopBarProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  isRtl: boolean;
}

export function TopBar({ onToggleSidebar, sidebarCollapsed, isRtl }: TopBarProps) {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchVisible, setSearchVisible] = useState(false);
  
  // Theme toggle
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return (
    <header className="h-16 border-b bg-background flex items-center px-4">
      <div className="flex items-center flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {!searchVisible ? (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSearchVisible(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        ) : (
          <div className="flex items-center gap-2 w-full lg:hidden">
            <Input
              placeholder={t('search')}
              className="h-9"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchVisible(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        <div className="hidden lg:flex max-w-xl flex-1 mx-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchProjects')}
            className="pl-9 h-9"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Timer Button */}
        <TimerButton />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-accent' : ''}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('ar')} className={language === 'ar' ? 'bg-accent' : ''}>
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground relative" onClick={() => navigate('/notifications')}>
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle className="h-8 w-8 text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.email || 'User'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              {t('profile')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              {t('settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut || (() => console.log('Sign out not implemented'))}>
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
