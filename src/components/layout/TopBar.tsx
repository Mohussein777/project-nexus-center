
import { useState, useEffect } from 'react';
import { Menu, Bell, User, Search, ChevronRight, ChevronLeft, Languages, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/types/supabase';
import { CurrencySelector } from "@/components/currency/CurrencySelector";

interface TopBarProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  isRtl: boolean;
}

export const TopBar = ({ onToggleSidebar, sidebarCollapsed, isRtl }: TopBarProps) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .eq('read', false)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          setUnreadNotifications((data || []) as Notification[]);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
    
    // Subscribe to notifications
    if (user) {
      const channel = supabase
        .channel(`notifications-${user.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setUnreadNotifications(prev => [payload.new as Notification, ...prev]);
          toast({
            title: t('newNotification'),
            description: payload.new.message,
            duration: 5000,
          });
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, t]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast({
        title: t('signOutSuccess'),
        description: t('signOutSuccessMessage'),
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: t('error'),
        description: t('signOutErrorMessage'),
        variant: 'destructive',
      });
    }
  };

  const handleNotificationClick = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      setUnreadNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadNotifications.length === 0) return;
    
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);
      
      setUnreadNotifications([]);
      toast({
        title: t('allNotificationsRead'),
        description: t('allNotificationsReadMessage'),
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'AD';
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

        <CurrencySelector />

        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleLanguage} 
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle language"
          >
            {language === 'ar' ? "EN" : "عربي"}
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors relative">
                <Bell size={20} />
                {unreadNotifications.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadNotifications.length}
                  </Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>{t('notifications')}</span>
                {unreadNotifications.length > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead} 
                    className="text-xs text-primary hover:underline"
                  >
                    {t('markAllAsRead')}
                  </button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {unreadNotifications.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground">
                  {t('noNotifications')}
                </div>
              ) : (
                <>
                  <div className="max-h-[300px] overflow-y-auto">
                    {unreadNotifications
                      .slice(0, showAllNotifications ? undefined : 5)
                      .map((notification) => (
                        <DropdownMenuItem 
                          key={notification.id}
                          className="cursor-pointer flex flex-col items-start py-3"
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-muted-foreground">{notification.message}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.created_at).toLocaleString()}
                          </div>
                        </DropdownMenuItem>
                      ))}
                  </div>
                  {unreadNotifications.length > 5 && !showAllNotifications && (
                    <button
                      className="w-full text-center py-2 text-sm text-primary hover:underline"
                      onClick={() => setShowAllNotifications(true)}
                    >
                      {t('viewAll')}
                    </button>
                  )}
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/notifications" className="w-full text-center cursor-pointer">
                  {t('manageNotifications')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center p-1 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : user.email}
                      </span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>{t('settings')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('signOut')}</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link to="/auth" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('signIn')}</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
