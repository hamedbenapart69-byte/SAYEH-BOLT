import type { PageId } from '@/types';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Bot,
  ListTodo,
  ScrollText,
  MessagesSquare,
  Workflow,
  Settings,
  Cpu,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

const items: { id: PageId; label: string; icon: LucideIcon }[] = [
  { id: 'command', label: 'مرکز فرماندهی', icon: LayoutDashboard },
  { id: 'agents', label: 'عاملان هوش مصنوعی', icon: Bot },
  { id: 'tasks', label: 'وظایف', icon: ListTodo },
  { id: 'logs', label: 'گزارش فعالیت', icon: ScrollText },
  { id: 'communication', label: 'ارتباط تیمی', icon: MessagesSquare },
  { id: 'workflow', label: 'نمودار فرآیند', icon: Workflow },
  { id: 'settings', label: 'تنظیمات', icon: Settings },
];

export function MobileSidebar({ open, onClose, currentPage, onNavigate }: MobileSidebarProps) {
  const { tasks, agents } = useApp();
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const activeAgents = agents.filter((a) => a.status === 'active' || a.status === 'busy').length;
  const badges: Partial<Record<PageId, number>> = {
    agents: activeAgents,
    tasks: pendingTasks,
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-base-950/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-72 bg-base-950 border-l border-base-700/50 flex flex-col transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-700/50 h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
              <Cpu size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base-50 font-bold text-lg leading-none">سایه</span>
              <span className="text-base-300 text-[10px] mt-1">مرکز فرماندهی هوش مصنوعی</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-base-800/60 text-base-200">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            const badge = badges[item.id];
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={cn('nav-item w-full', active && 'nav-item-active')}
              >
                <Icon size={20} className="shrink-0" />
                <span className="flex-1 text-right">{item.label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className="badge bg-primary-500/15 text-primary-200 text-[10px] px-2 py-0.5 nums">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
