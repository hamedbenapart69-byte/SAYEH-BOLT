import { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { TopBar } from '@/components/layout/TopBar';
import { SimBanner } from '@/components/SimBanner';
import { CommandCenter } from '@/pages/CommandCenter';
import { AgentsPage } from '@/pages/AgentsPage';
import { TasksPage } from '@/pages/TasksPage';
import { LogsPage } from '@/pages/LogsPage';
import { CommunicationPage } from '@/pages/CommunicationPage';
import { WorkflowPage } from '@/pages/WorkflowPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { cn } from '@/lib/utils';
import type { PageId } from '@/types';

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('command');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'command':
        return <CommandCenter onNavigate={setCurrentPage} />;
      case 'agents':
        return <AgentsPage />;
      case 'tasks':
        return <TasksPage />;
      case 'logs':
        return <LogsPage />;
      case 'communication':
        return <CommunicationPage />;
      case 'workflow':
        return <WorkflowPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <CommandCenter onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-base-950 text-base-100">
        {/* Desktop sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          collapsed={sidebarCollapsed}
        />

        {/* Mobile sidebar drawer */}
        <MobileSidebar
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />

        {/* Main content */}
        <div className={cn('transition-all duration-300', sidebarCollapsed ? 'lg:mr-20' : 'lg:mr-64')}>
          <TopBar
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            collapsed={sidebarCollapsed}
            onOpenMobileNav={() => setMobileNavOpen(true)}
          />
          <SimBanner />
          <main className="p-4 lg:p-6 pb-24 lg:pb-6 grid-bg min-h-[calc(100vh-4rem)]">
            <div className="max-w-7xl mx-auto animate-fade-in">
              {renderPage()}
            </div>
          </main>
        </div>

        {/* Mobile bottom nav */}
        <MobileNav currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>
    </AppProvider>
  );
}

export default App;
