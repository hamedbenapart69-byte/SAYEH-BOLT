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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MobileNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

const items: { id: PageId; label: string; icon: LucideIcon }[] = [
  { id: 'command', label: 'فرماندهی', icon: LayoutDashboard },
  { id: 'agents', label: 'عاملان', icon: Bot },
  { id: 'tasks', label: 'وظایف', icon: ListTodo },
  { id: 'logs', label: 'گزارش‌ها', icon: ScrollText },
  { id: 'communication', label: 'ارتباط', icon: MessagesSquare },
  { id: 'workflow', label: 'فرآیند', icon: Workflow },
  { id: 'settings', label: 'تنظیمات', icon: Settings },
];

export function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-base-950/95 backdrop-blur-md border-t border-base-700/50">
      <div className="flex items-center justify-around px-1 py-1 overflow-x-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors min-w-[58px]',
                active ? 'text-primary-300' : 'text-base-300'
              )}
            >
              <Icon size={20} className={active ? 'text-glow' : ''} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
