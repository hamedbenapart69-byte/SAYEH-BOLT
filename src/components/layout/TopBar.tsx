import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { agentStatusConfig } from '@/lib/utils';
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  Search,
  Wifi,
  Clock,
} from 'lucide-react';
import { getNowTime } from '@/lib/utils';

interface TopBarProps {
  onToggleSidebar: () => void;
  collapsed: boolean;
  onOpenMobileNav: () => void;
}

export function TopBar({ onToggleSidebar, collapsed, onOpenMobileNav }: TopBarProps) {
  const { agents, settings } = useApp();
  const [time, setTime] = useState(getNowTime());
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(getNowTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = agents.filter((a) => a.status === 'active' || a.status === 'busy').length;
  const totalAgents = agents.length;
  const offlineCount = agents.filter((a) => a.status === 'offline').length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-base-950/90 backdrop-blur-md border-b border-base-700/50 flex items-center justify-between px-4 gap-4">
      {/* Right side - mobile menu + collapse */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg hover:bg-base-800/60 text-base-200 transition-colors"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 rounded-lg hover:bg-base-800/60 text-base-200 transition-colors"
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Center - search */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-300" />
          <input
            type="text"
            placeholder="جستجو در سایه..."
            className="input pr-10 py-2 text-sm"
          />
        </div>
      </div>

      {/* Left side - status indicators */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Agent status summary */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-900/60 border border-base-700/40">
          <Wifi size={14} className="text-success-400" />
          <span className="text-xs text-base-200 nums">
            <span className="text-success-300 font-medium">{activeCount}</span>
            <span className="text-base-400"> / {totalAgents}</span>
          </span>
          {offlineCount > 0 && (
            <span className="text-[10px] text-danger-300 nums">({offlineCount} آفلاین)</span>
          )}
        </div>

        {/* Clock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-900/60 border border-base-700/40">
          <Clock size={14} className="text-base-300" />
          <span className="text-xs text-base-100 nums font-medium">{time}</span>
        </div>

        {/* Execution mode indicator */}
        <div
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium',
            settings.executionMode === 'live'
              ? 'bg-warning-500/10 border-warning-500/20 text-warning-200'
              : 'bg-primary-500/10 border-primary-500/20 text-primary-200'
          )}
        >
          <span className={cn(
            'status-dot',
            settings.executionMode === 'live' ? 'bg-warning-400 animate-blink' : 'bg-primary-400 animate-blink'
          )} />
          {settings.executionMode === 'live' ? 'حالت زنده' : 'شبیه‌سازی'}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg hover:bg-base-800/60 text-base-200 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-danger-400" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute left-0 mt-2 w-72 panel z-50 animate-slide-up overflow-hidden">
                <div className="px-4 py-3 border-b border-base-700/50">
                  <span className="text-sm font-semibold text-base-50">اعلان‌ها</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {agents
                    .filter((a) => a.status === 'busy' || a.status === 'error')
                    .slice(0, 5)
                    .map((a) => {
                      const cfg = agentStatusConfig[a.status];
                      return (
                        <div key={a.id} className="flex items-center gap-3 px-4 py-3 hover:bg-base-800/40 border-b border-base-800/40">
                          <span className={cn('status-dot shrink-0', cfg.dot)} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-base-100 truncate">{a.name}</p>
                            <p className="text-xs text-base-300 truncate">{a.role}</p>
                          </div>
                          <span className={cn('text-xs', cfg.color)}>{cfg.label}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
