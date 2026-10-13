import type { PageId } from '@/types';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Bot,
  ListTodo,
  ScrollText,
  MessagesSquare,
  Workflow,
  Settings,
  Cpu,
  Activity,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
}

export function Sidebar({ currentPage, onNavigate, collapsed }: SidebarProps) {
  const { tasks, agents } = useApp();

  const pendingTasks = tasks.filter(
    (t) => t.status === 'pending' || t.status === 'assigned'
  ).length;
  const activeAgents = agents.filter(
    (a) => a.status === 'active' || a.status === 'busy'
  ).length;

  const navItems: NavItem[] = [
    { id: 'command', label: 'مرکز فرماندهی', icon: LayoutDashboard },
    { id: 'agents', label: 'عاملان هوش مصنوعی', icon: Bot, badge: activeAgents },
    { id: 'tasks', label: 'وظایف', icon: ListTodo, badge: pendingTasks },
    { id: 'logs', label: 'گزارش فعالیت', icon: ScrollText },
    { id: 'communication', label: ' ارتباط تیمی', icon: MessagesSquare },
    { id: 'workflow', label: 'نمودار فرآیند', icon: Workflow },
    { id: 'settings', label: 'تنظیمات', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'fixed inset-y-0 right-0 z-40 flex flex-col bg-base-950 border-l border-base-700/50 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-base-700/50 h-16">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
            <Cpu size={22} className="text-white" />
          </div>
          <div className="absolute -inset-1 rounded-lg bg-primary-500/20 blur-md -z-10" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-base-50 font-bold text-lg leading-none tracking-wide">سایه</span>
            <span className="text-base-300 text-[10px] mt-1">مرکز فرماندهی هوش مصنوعی</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'nav-item w-full',
                active && 'nav-item-active',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span className="flex-1 text-right">{item.label}</span>}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="badge bg-primary-500/15 text-primary-200 text-[10px] px-2 py-0.5 nums">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-primary-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* System status */}
      <div className="px-3 py-4 border-t border-base-700/50">
        <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg bg-base-900/60', collapsed && 'justify-center px-2')}>
          <Activity size={16} className="text-success-400 shrink-0" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-success-300 text-xs font-medium">سیستم فعال</span>
              <span className="text-base-300 text-[10px]">شبیه‌سازی در حال اجرا</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
