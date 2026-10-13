import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { AlertTriangle, Radio, Cpu } from 'lucide-react';

export function SimBanner() {
  const { settings, isSimulating } = useApp();

  if (settings.executionMode === 'live') {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-warning-500/10 border-b border-warning-500/20 text-warning-200 text-xs">
        <AlertTriangle size={14} className="shrink-0" />
        <span>
          حالت زنده فعال است، اما اتصال واقعی هنوز پیکربندی نشده. فعالیت‌ها همچنان شبیه‌سازی می‌شوند.
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 bg-primary-500/5 border-b border-primary-500/15 text-primary-200 text-xs'
    )}>
      <Radio size={14} className="shrink-0 animate-pulse" />
      <Cpu size={14} className="shrink-0" />
      <span>
        حالت شبیه‌سازی فعال — تمام فعالیت عاملان شبیه‌سازی شده و داده‌ها نمایشی هستند. برای اتصال واقعی به بخش تنظیمات مراجعه کنید.
      </span>
      {isSimulating && (
        <span className="flex items-center gap-1 mr-auto">
          <span className="status-dot bg-success-400 animate-blink" />
          <span className="text-success-300">شبیه‌سازی در حال اجرا</span>
        </span>
      )}
    </div>
  );
}
