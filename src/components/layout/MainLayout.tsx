
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleDirection = () => {
    setIsRtl(!isRtl);
    document.documentElement.dir = isRtl ? 'ltr' : 'rtl';
    document.body.className = isRtl ? '' : 'rtl';
  };

  return (
    <div className={`flex min-h-screen bg-background ${isRtl ? 'rtl' : 'ltr'}`}>
      <Sidebar collapsed={sidebarCollapsed} isRtl={isRtl} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          onToggleSidebar={toggleSidebar} 
          sidebarCollapsed={sidebarCollapsed} 
          onToggleDirection={toggleDirection}
          isRtl={isRtl}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="page-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
