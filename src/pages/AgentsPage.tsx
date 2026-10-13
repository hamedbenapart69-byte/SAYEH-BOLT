import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { cn, agentStatusConfig } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressRing, ProgressBar } from '@/components/ui/Progress';
import { Modal } from '@/components/ui/Modal';
import type { AIAgent } from '@/types';
import {
  Bot,
  Search,
  Cpu,
  Zap,
  Activity,
  Award,
  Shield,
  Eye,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function AgentsPage() {
  const { agents, tasks } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<AIAgent | null>(null);

  const filtered = agents.filter((a) => {
    const matchesSearch = a.name.includes(search) || a.role.includes(search);
    const matchesFilter = filter === 'all' || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { id: 'all', label: 'همه' },
    { id: 'active', label: 'فعال' },
    { id: 'busy', label: 'مشغول' },
    { id: 'idle', label: 'بیکار' },
    { id: 'offline', label: 'آفلاین' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-base-50 flex items-center gap-3">
          <Bot className="text-primary-400" size={28} />
          عاملان هوش مصنوعی
        </h1>
        <p className="text-base-300 text-sm mt-1">مدیریت و نظارت بر کارکنان هوش مصنوعی</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی عامل بر اساس نام یا نقش..."
            className="input pr-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                filter === opt.id
                  ? 'bg-primary-500/15 text-primary-200 border border-primary-500/30'
                  : 'bg-base-850 text-base-200 border border-base-700/40 hover:border-base-600/60'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((agent) => {
          const cfg = agentStatusConfig[agent.status];
          const currentTask = tasks.find((t) => t.id === agent.currentTaskId);
          return (
            <div
              key={agent.id}
              className="panel panel-hover p-4 cursor-pointer"
              onClick={() => setSelected(agent)}
            >
              <div className="flex items-start gap-3 mb-3">
                <Avatar char={agent.avatar} status={agent.status} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base-50 font-semibold truncate">{agent.name}</h3>
                    <span className={cn('badge text-[10px]', cfg.color, cfg.bg)}>{cfg.label}</span>
                  </div>
                  <p className="text-base-300 text-xs mt-0.5">{agent.role}</p>
                  <p className="text-base-400 text-[10px] mt-1">{agent.model}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-base-300 flex items-center gap-1">
                    <Award size={12} /> نرخ موفقیت
                  </span>
                  <span className="text-success-300 font-medium nums">{agent.successRate}%</span>
                </div>
                <ProgressBar value={agent.successRate} color="bg-success-500" />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <ResourceMini icon={Zap} label="CPU" value={agent.cpuUsage} color="text-primary-300" />
                  <ResourceMini icon={Activity} label="RAM" value={agent.memoryUsage} color="text-accent-300" />
                </div>

                {currentTask ? (
                  <div className="bg-base-850/60 rounded-lg p-2 border border-base-700/40 mt-2">
                    <div className="text-[10px] text-base-400 mb-1">وظیفه جاری</div>
                    <div className="text-xs text-base-100 truncate">{currentTask.title}</div>
                    <div className="mt-1.5">
                      <ProgressBar value={currentTask.progress} color="bg-warning-500" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-base-850/40 rounded-lg p-2 text-center mt-2">
                    <span className="text-xs text-base-400">بدون وظیفه جاری</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-base-400 nums">{agent.completedTasks} وظیفه تکمیل‌شده</span>
                  <span className={cn('flex items-center gap-1', agent.isReal ? 'text-success-300' : 'text-base-400')}>
                    <span className={cn('status-dot', agent.isReal ? 'bg-success-400' : 'bg-base-500')} />
                    {agent.isReal ? 'واقعی' : 'شبیه‌سازی'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="panel p-12 text-center">
          <Bot size={40} className="text-base-500 mx-auto mb-3" />
          <p className="text-base-300">هیچ عاملی با این مشخصات یافت نشد</p>
        </div>
      )}

      {/* Detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `عامل ${selected.name}` : ''}
        size="lg"
      >
        {selected && <AgentDetail agent={selected} />}
      </Modal>
    </div>
  );
}

function AgentDetail({ agent }: { agent: AIAgent }) {
  const cfg = agentStatusConfig[agent.status];
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Avatar char={agent.avatar} status={agent.status} size="lg" />
        <div>
          <h3 className="text-xl font-bold text-base-50">{agent.name}</h3>
          <p className="text-base-300">{agent.role}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('badge text-xs', cfg.color, cfg.bg)}>{cfg.label}</span>
            <span className="text-xs text-base-400">{agent.model}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-base-200 leading-relaxed bg-base-850/60 rounded-lg p-3 border border-base-700/40">
        {agent.description}
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center bg-base-850/60 rounded-lg p-4 border border-base-700/40">
          <ProgressRing value={agent.successRate} size={80} stroke={6} label="موفقیت" />
        </div>
        <div className="flex flex-col items-center justify-center bg-base-850/60 rounded-lg p-4 border border-base-700/40">
          <Award size={24} className="text-success-400 mb-2" />
          <span className="text-2xl font-bold text-base-50 nums">{agent.completedTasks}</span>
          <span className="text-xs text-base-300">وظیفه تکمیل‌شده</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-base-850/60 rounded-lg p-4 border border-base-700/40">
          <Shield size={24} className={agent.isReal ? 'text-success-400' : 'text-base-400'} mb-2 />
          <span className={cn('text-sm font-bold', agent.isReal ? 'text-success-300' : 'text-base-200')}>
            {agent.isReal ? 'واقعی' : 'شبیه‌سازی'}
          </span>
          <span className="text-xs text-base-300">نوع اجرا</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-base-100 mb-2">قابلیت‌ها</h4>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.map((cap) => (
            <span key={cap} className="badge bg-primary-500/10 text-primary-200 border border-primary-500/20">
              {cap}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-base-850/60 rounded-lg p-3 border border-base-700/40">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-primary-300" />
            <span className="text-sm text-base-200">پردازنده</span>
          </div>
          <ProgressBar value={agent.cpuUsage} showLabel color="bg-primary-500" />
        </div>
        <div className="bg-base-850/60 rounded-lg p-3 border border-base-700/40">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-accent-300" />
            <span className="text-sm text-base-200">حافظه</span>
          </div>
          <ProgressBar value={agent.memoryUsage} showLabel color="bg-accent-500" />
        </div>
      </div>
    </div>
  );
}

function ResourceMini({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: number; color: string }) {
  return (
    <div className="bg-base-850/60 rounded-lg p-2 border border-base-700/40">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-base-400 flex items-center gap-1">
          <Icon size={10} className={color} />
          {label}
        </span>
        <span className={cn('text-[10px] nums font-medium', color)}>{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 bg-base-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-current transition-all duration-500" style={{ width: `${value}%`, color: color.includes('primary') ? '#3a82c4' : '#36a48c' }} />
      </div>
    </div>
  );
}
