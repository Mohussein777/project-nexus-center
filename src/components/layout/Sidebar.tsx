
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Users, User, BarChart4, Settings, ChevronRight, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  isRtl: boolean;
}

export function Sidebar({ collapsed, isRtl }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Employees', path: '/employees', icon: User },
    { name: 'Financial', path: '/financial', icon: BarChart4 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`bg-sidebar text-sidebar-foreground transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } flex flex-col relative`}
    >
      <div className="py-6 px-3 flex items-center justify-center">
        {!collapsed && (
          <h1 className="text-lg font-semibold text-white">
            {isRtl ? 'إدارة المكاتب الهندسية' : 'Engineering Office'}
          </h1>
        )}
        {collapsed && <div className="w-8 h-8 bg-sidebar-primary rounded-full animate-pulse-gentle" />}
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`
                }
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && (
                  <span className={`ms-3 transition-opacity duration-200 ${
                    hoveredItem === item.path ? 'opacity-100' : 'opacity-90'
                  }`}>
                    {isRtl ? getArabicName(item.name) : item.name}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto mb-4 px-4">
        {!collapsed && (
          <div className="bg-sidebar-accent p-3 rounded-lg text-xs text-sidebar-accent-foreground">
            <div className="font-medium mb-1">
              {isRtl ? 'المساحة المستخدمة' : 'Storage Used'}
            </div>
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-sidebar-primary w-[65%] rounded-full" />
            </div>
            <div className="mt-1 text-xs opacity-80">65% / 100GB</div>
          </div>
        )}
      </div>
    </aside>
  );
}

function getArabicName(name: string): string {
  const names: Record<string, string> = {
    'Dashboard': 'لوحة التحكم',
    'Projects': 'المشاريع',
    'Clients': 'العملاء',
    'Employees': 'الموظفون',
    'Financial': 'المالية',
    'Settings': 'الإعدادات'
  };
  
  return names[name] || name;
}
