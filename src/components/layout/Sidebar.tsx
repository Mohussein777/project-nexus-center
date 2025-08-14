
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
                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 mx-2 my-1 group relative overflow-hidden',
                'hover:bg-white/10 hover:shadow-lg hover:scale-105',
                active
                  ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30'
                  : 'text-sidebar-foreground hover:text-white'
              )}
            >
              {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-2xl" />
              )}
              <Icon className={cn(
                "h-5 w-5 flex-shrink-0 relative z-10 transition-all duration-300",
                active ? "text-white" : "group-hover:scale-110"
              )} />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap relative z-10 transition-all duration-300">
                  {label}
                </span>
              )}
              {active && !collapsed && (
                <div className="ml-auto relative z-10">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </NavLink>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side={isRtl ? 'left' : 'right'} className="bg-gray-900 text-white border-gray-700">
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
        'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white h-screen flex flex-col border-r border-gray-700/50 transition-all duration-300 shadow-2xl',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-center px-4 py-6 border-b border-gray-700/30">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <img src="logo-white.png" alt="Logo" className='h-10 object-contain' />
            <div className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent font-bold text-xl">
              Nexus
            </div>
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 shadow-lg">
            <img src="logo-collapsed.png" alt="Logo" className='h-6 w-6 object-contain' />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 py-6 px-2 space-y-2 overflow-y-auto">
        <SidebarLink to="/dashboard" icon={LayoutDashboard} label={t('dashboard')} />
        <SidebarLink to="/projects" icon={FolderKanban} label={t('projects')} />
        <SidebarLink to="/workload" icon={BarChart4} label={t('workload')} />
        <SidebarLink to="/clients" icon={Building2} label={t('clients')} />
        <SidebarLink to="/employees" icon={Users} label={t('employees')} />
        <SidebarLink to="/employees/attendance" icon={CalendarRange} label={t('attendance')} />
        <SidebarLink to="/financial" icon={CreditCard} label={t('financial')} />
        <SidebarLink to="/settings" icon={Settings} label={t('settings')} />
      </div>

      <div className="p-4 border-t border-gray-700/30 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
        <SidebarLink to="/profile" icon={UserCircle} label={t('profile')} />
      </div>
    </aside>
  );
}
