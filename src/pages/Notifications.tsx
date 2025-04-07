
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Bell, Check, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Notification } from '@/types/supabase';

const Notifications = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, activeTab]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('created_at', { ascending: false });

      if (activeTab === 'unread') {
        query = query.eq('read', false);
      } else if (activeTab === 'read') {
        query = query.eq('read', true);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setNotifications((data || []) as Notification[]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: t('error'),
        description: t('failedToLoadNotifications'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );

      toast({
        title: t('success'),
        description: t('notificationMarkedAsRead'),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: t('error'),
        description: t('actionFailed'),
        variant: 'destructive',
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      setNotifications(prev => prev.filter(notification => notification.id !== id));

      toast({
        title: t('success'),
        description: t('notificationDeleted'),
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: t('error'),
        description: t('actionFailed'),
        variant: 'destructive',
      });
    }
  };

  const markAllAsRead = async () => {
    if (notifications.filter(n => !n.read).length === 0) {
      toast({
        title: t('info'),
        description: t('noUnreadNotifications'),
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);
      
      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );

      toast({
        title: t('success'),
        description: t('allNotificationsMarkedAsRead'),
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: t('error'),
        description: t('actionFailed'),
        variant: 'destructive',
      });
    }
  };

  const deleteAllRead = async () => {
    const readNotifications = notifications.filter(n => n.read);
    if (readNotifications.length === 0) {
      toast({
        title: t('info'),
        description: t('noReadNotificationsToDelete'),
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user?.id)
        .eq('read', true);
      
      if (error) throw error;

      setNotifications(prev => prev.filter(notification => !notification.read));

      toast({
        title: t('success'),
        description: t('allReadNotificationsDeleted'),
      });
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      toast({
        title: t('error'),
        description: t('actionFailed'),
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return null; // Should be handled by route guard
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('notifications')}</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              {t('markAllAsRead')}
            </Button>
            <Button variant="outline" onClick={deleteAllRead}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('deleteAllRead')}
            </Button>
          </div>
        </div>

        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('yourNotifications')}</CardTitle>
                <TabsList>
                  <TabsTrigger value="all">{t('all')}</TabsTrigger>
                  <TabsTrigger value="unread">{t('unread')}</TabsTrigger>
                  <TabsTrigger value="read">{t('read')}</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                {activeTab === 'all' && t('allNotificationsDescription')}
                {activeTab === 'unread' && t('unreadNotificationsDescription')}
                {activeTab === 'read' && t('readNotificationsDescription')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <TabsContent value="all" className="mt-0">
                {renderNotifications(notifications)}
              </TabsContent>
              <TabsContent value="unread" className="mt-0">
                {renderNotifications(notifications.filter(n => !n.read))}
              </TabsContent>
              <TabsContent value="read" className="mt-0">
                {renderNotifications(notifications.filter(n => n.read))}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );

  function renderNotifications(notificationsToRender: Notification[]) {
    if (isLoading) {
      return <div className="py-8 text-center text-muted-foreground">{t('loading')}</div>;
    }

    if (notificationsToRender.length === 0) {
      return (
        <div className="py-16 flex flex-col items-center justify-center text-center text-muted-foreground">
          <Bell className="h-12 w-12 mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">{t('noNotificationsFound')}</h3>
          <p>{t('noNotificationsDescription')}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {notificationsToRender.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 rounded-lg border ${notification.read ? 'bg-background' : 'bg-muted/20'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`text-base font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                  {notification.title}
                </h3>
                <p className="text-muted-foreground mt-1">{notification.message}</p>
                <span className="text-xs text-muted-foreground block mt-2">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!notification.read && (
                    <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      {t('markAsRead')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default Notifications;
