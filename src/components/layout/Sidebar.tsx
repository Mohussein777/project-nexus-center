
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  FolderKanban,
  Users,
  Building2,
  Clock,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  CalendarRange,
  UserCircle,
  Star,
  BarChart4,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  isRtl: boolean;
}

export function Sidebar({ collapsed, isRtl }: SidebarProps) {
  const { t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const SidebarLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const active = isActive(to);
    
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to={to}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                active 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
            </NavLink>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side={isRtl ? 'left' : 'right'}>
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  return (
    <aside
      className={cn(
        'bg-sidebar-background text-sidebar-foreground h-screen flex flex-col border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border px-4">
        {!collapsed ? (
          <div className="flex items-center">
            <Star className="h-6 w-6 text-sidebar-primary mr-2" />
            <h1 className="text-xl font-semibold">Nexus</h1>
          </div>
        ) : (
          <Star className="h-6 w-6 text-sidebar-primary" />
        )}
      </div>
      
      <div className="flex flex-col flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <SidebarLink to="/dashboard" icon={LayoutDashboard} label={t('dashboard')} />
        <SidebarLink to="/projects" icon={FolderKanban} label={t('projects')} />
        <SidebarLink to="/workload" icon={BarChart4} label={t('workload')} />
        <SidebarLink to="/clients" icon={Building2} label={t('clients')} />
        <SidebarLink to="/employees" icon={Users} label={t('employees')} />
        <SidebarLink to="/employees/attendance" icon={CalendarRange} label={t('attendance')} />
        <SidebarLink to="/financial" icon={CreditCard} label={t('financial')} />
        <SidebarLink to="/settings" icon={Settings} label={t('settings')} />
      </div>
      
      <div className="p-2 border-t border-sidebar-border">
        <SidebarLink to="/profile" icon={UserCircle} label={t('profile')} />
      </div>
    </aside>
  );
}
