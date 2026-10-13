import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { cn, logLevelConfig } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import {
  ScrollText,
  Search,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bug,
  Download,
  Filter,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { LogLevel } from '@/types';

const levelIcons: Record<LogLevel, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  debug: Bug,
};

export function LogsPage() {
  const { logs, agents } = useApp();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');

  const filtered = logs.filter((log) => {
    const matchesSearch = log.action.includes(search) || log.details.includes(search);
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesAgent = agentFilter === 'all' || log.agentId === agentFilter;
    return matchesSearch && matchesLevel && matchesAgent;
  });

  const levelOptions = [
    { id: 'all', label: 'همه' },
    { id: 'info', label: 'اطلاع' },
    { id: 'success', label: 'موفق' },
    { id: 'warning', label: 'هشدار' },
    { id: 'error', label: 'خطا' },
    { id: 'debug', label: 'دیباگ' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-50 flex items-center gap-3">
            <ScrollText className="text-primary-400" size={28} />
            گزارش فعالیت
          </h1>
          <p className="text-base-300 text-sm mt-1">لاگ‌های سیستم و فعالیت عاملان</p>
        </div>
        <button
          onClick={() => {
            const text = logs.map((l) => `[${l.timestamp}] ${l.agentName} - ${l.action}: ${l.details}`).join('\n');
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sayeh-logs.txt';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="btn btn-ghost"
        >
          <Download size={16} />
          خروجی
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در لاگ‌ها..."
            className="input pr-10"
          />
        </div>
        <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)} className="input w-auto py-2">
          <option value="all">همه عاملان</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <div className="flex gap-2 overflow-x-auto">
          {levelOptions.map((opt) => {
            const cfg = opt.id !== 'all' ? logLevelConfig[opt.id as LogLevel] : null;
            return (
              <button
                key={opt.id}
                onClick={() => setLevelFilter(opt.id)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border',
                  levelFilter === opt.id
                    ? cfg
                      ? cn(cfg.bg, cfg.color, cfg.bg.replace('/10', '/30'))
                      : 'bg-primary-500/15 text-primary-200 border-primary-500/30'
                    : 'bg-base-850 text-base-200 border-base-700/40 hover:border-base-600/60'
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Log timeline */}
      <div className="panel overflow-hidden">
        <div className="px-5 py-3 border-b border-base-700/50 flex items-center gap-2">
          <Filter size={16} className="text-base-300" />
          <span className="text-sm text-base-200">{filtered.length} رکورد</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {filtered.map((log, idx) => {
            const agent = agents.find((a) => a.id === log.agentId);
            const Icon = levelIcons[log.level];
            const cfg = logLevelConfig[log.level];
            return (
              <div
                key={log.id}
                className={cn(
                  'flex items-start gap-3 px-5 py-3 border-b border-base-800/40 hover:bg-base-850/40 transition-colors',
                  idx === 0 && 'animate-fade-in'
                )}
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center shrink-0 pt-1">
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', cfg.bg)}>
                    <Icon size={14} className={cfg.color} />
                  </div>
                  {idx < filtered.length - 1 && (
                    <div className="w-px h-full bg-base-700/40 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {agent ? (
                      <Avatar char={agent.avatar} size="sm" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-base-700 flex items-center justify-center text-base-300">
                        <Info size={14} />
                      </div>
                    )}
                    <span className="text-base-50 text-sm font-medium">{log.agentName}</span>
                    <span className={cn('badge text-[10px] px-2 py-0', cfg.bg, cfg.color)}>{cfg.label}</span>
                    <span className="text-xs text-base-100">{log.action}</span>
                  </div>
                  <p className="text-sm text-base-300 mt-1.5 mr-10">{log.details}</p>
                </div>

                {/* Timestamp */}
                <div className="shrink-0 text-left">
                  <span className="text-xs text-base-400 nums block">{log.timestamp}</span>
                  <span className={cn(
                    'text-[10px] flex items-center gap-1 mt-1 justify-end',
                    log.isReal ? 'text-success-300' : 'text-base-400'
                  )}>
                    <span className={cn('status-dot', log.isReal ? 'bg-success-400' : 'bg-base-500')} />
                    {log.isReal ? 'واقعی' : 'شبیه'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="panel p-12 text-center">
          <ScrollText size={40} className="text-base-500 mx-auto mb-3" />
          <p className="text-base-300">هیچ لاگی یافت نشد</p>
        </div>
      )}
    </div>
  );
}
