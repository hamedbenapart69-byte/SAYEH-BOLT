import { useApp } from '@/context/AppContext';
import { cn, agentStatusConfig, taskStatusConfig } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressRing, ProgressBar } from '@/components/ui/Progress';
import {
  Bot,
  ListTodo,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Cpu,
  Activity,
  Zap,
  Gauge,
  Eye,
  Radio,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PageId } from '@/types';

interface CommandCenterProps {
  onNavigate: (page: PageId) => void;
}

export function CommandCenter({ onNavigate }: CommandCenterProps) {
  const { agents, tasks, logs } = useApp();

  const activeAgents = agents.filter((a) => a.status === 'active' || a.status === 'busy').length;
  const totalAgents = agents.length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const failedTasks = tasks.filter((t) => t.status === 'failed').length;
  const avgSuccessRate = agents.reduce((acc, a) => acc + a.successRate, 0) / agents.length;
  const avgCpu = agents.filter((a) => a.status !== 'offline').reduce((acc, a) => acc + a.cpuUsage, 0) / (agents.filter((a) => a.status !== 'offline').length || 1);
  const avgMemory = agents.filter((a) => a.status !== 'offline').reduce((acc, a) => acc + a.memoryUsage, 0) / (agents.filter((a) => a.status !== 'offline').length || 1);

  const recentLogs = logs.slice(0, 6);
  const busyAgents = agents.filter((a) => a.status === 'busy' || a.status === 'active').slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-50 flex items-center gap-3">
            <span className="relative">
              <Radio className="text-primary-400" size={28} />
              <span className="absolute -inset-2 bg-primary-500/20 blur-xl -z-10" />
            </span>
            مرکز فرماندهی
          </h1>
          <p className="text-base-300 text-sm mt-1">نمای کلی از وضعیت عاملان و وظایف هوش مصنوعی</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success-500/10 border border-success-500/20">
            <span className="status-dot bg-success-400 animate-blink" />
            <span className="text-success-300 text-sm font-medium">عملیاتی</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Bot}
          label="عاملان فعال"
          value={activeAgents}
          total={totalAgents}
          color="primary"
          trend="+2"
          onClick={() => onNavigate('agents')}
        />
        <StatCard
          icon={ListTodo}
          label="وظایف در حال اجرا"
          value={inProgressTasks}
          total={tasks.length}
          color="warning"
          trend={`${pendingTasks} در انتظار`}
          onClick={() => onNavigate('tasks')}
        />
        <StatCard
          icon={CheckCircle2}
          label="وظایف تکمیل‌شده"
          value={completedTasks}
          total={tasks.length}
          color="success"
          trend={failedTasks > 0 ? `${failedTasks} ناموفق` : 'بدون خطا'}
          onClick={() => onNavigate('tasks')}
        />
        <StatCard
          icon={Gauge}
          label="میانگین نرخ موفقیت"
          value={`${avgSuccessRate.toFixed(1)}%`}
          color="accent"
          trend="پایدار"
          trendUp
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System resources */}
        <div className="panel p-5 lg:col-span-1 scanline">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={18} className="text-primary-400" />
            <h2 className="text-base-50 font-semibold">منابع سیستم</h2>
          </div>
          <div className="space-y-4">
            <ResourceBar label="پردازنده (CPU)" value={avgCpu} icon={Zap} color="bg-primary-500" />
            <ResourceBar label="حافظه (RAM)" value={avgMemory} icon={Activity} color="bg-accent-500" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-base-850/60 rounded-lg p-3 border border-base-700/40">
                <div className="text-base-300 text-xs mb-1">عاملان آنلاین</div>
                <div className="text-base-50 font-bold text-lg nums">
                  {totalAgents - agents.filter((a) => a.status === 'offline').length}
                  <span className="text-base-400 text-sm"> / {totalAgents}</span>
                </div>
              </div>
              <div className="bg-base-850/60 rounded-lg p-3 border border-base-700/40">
                <div className="text-base-300 text-xs mb-1">کل وظایف</div>
                <div className="text-base-50 font-bold text-lg nums">{tasks.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active agents */}
        <div className="panel p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-primary-400" />
              <h2 className="text-base-50 font-semibold">عاملان فعال</h2>
            </div>
            <button onClick={() => onNavigate('agents')} className="text-primary-300 text-xs hover:text-primary-200 transition-colors">
              مشاهده همه
            </button>
          </div>
          <div className="space-y-3">
            {busyAgents.map((agent) => {
              const cfg = agentStatusConfig[agent.status];
              return (
                <div key={agent.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-800/40 transition-colors">
                  <Avatar char={agent.avatar} status={agent.status} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base-50 text-sm font-medium truncate">{agent.name}</span>
                      <span className={cn('text-xs', cfg.color)}>{cfg.label}</span>
                    </div>
                    <span className="text-base-300 text-xs truncate block">{agent.role}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-16">
                      <ProgressBar value={agent.cpuUsage} color="bg-primary-500" />
                    </div>
                    <span className="text-xs text-base-300 nums w-8">{Math.round(agent.cpuUsage)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task distribution */}
        <div className="panel p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <ListTodo size={18} className="text-primary-400" />
            <h2 className="text-base-50 font-semibold">توزیع وظایف</h2>
          </div>
          <div className="flex flex-col items-center gap-4">
            <ProgressRing value={(completedTasks / tasks.length) * 100} size={120} stroke={8} label="تکمیل" />
            <div className="w-full space-y-2">
              {(['in_progress', 'pending', 'review', 'completed'] as const).map((status) => {
                const cfg = taskStatusConfig[status];
                const count = tasks.filter((t) => t.status === status).length;
                const pct = (count / tasks.length) * 100;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className={cn('text-xs w-20', cfg.color)}>{cfg.label}</span>
                    <div className="flex-1 h-2 bg-base-800 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all duration-500', cfg.bg.replace('/10', '/60'))} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-base-200 nums w-6 text-left">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-primary-400" />
            <h2 className="text-base-50 font-semibold">آخرین فعالیت‌ها</h2>
          </div>
          <button onClick={() => onNavigate('logs')} className="text-primary-300 text-xs hover:text-primary-200 transition-colors">
            مشاهده همه
          </button>
        </div>
        <div className="space-y-2">
          {recentLogs.map((log) => {
            const agent = agents.find((a) => a.id === log.agentId);
            return (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-base-800/40 transition-colors border border-base-800/30">
                <div className="shrink-0 mt-0.5">
                  {agent ? (
                    <Avatar char={agent.avatar} size="sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-base-700 flex items-center justify-center text-base-300">
                      <Cpu size={14} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base-50 text-sm font-medium">{log.agentName}</span>
                    <span className={cn(
                      'badge text-[10px] px-2 py-0',
                      log.level === 'success' && 'bg-success-500/10 text-success-300',
                      log.level === 'warning' && 'bg-warning-500/10 text-warning-300',
                      log.level === 'error' && 'bg-danger-500/10 text-danger-300',
                      log.level === 'info' && 'bg-primary-500/10 text-primary-300',
                      log.level === 'debug' && 'bg-base-700/30 text-base-300',
                    )}>
                      {log.action}
                    </span>
                  </div>
                  <p className="text-base-300 text-xs mt-1 truncate">{log.details}</p>
                </div>
                <span className="text-base-400 text-xs nums shrink-0 mt-1">{log.timestamp}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  total?: number;
  color: 'primary' | 'warning' | 'success' | 'accent';
  trend?: string;
  trendUp?: boolean;
  onClick?: () => void;
}

function StatCard({ icon: Icon, label, value, total, color, trend, trendUp, onClick }: StatCardProps) {
  const colorMap = {
    primary: { text: 'text-primary-300', bg: 'bg-primary-500/10', border: 'border-primary-500/20' },
    warning: { text: 'text-warning-300', bg: 'bg-warning-500/10', border: 'border-warning-500/20' },
    success: { text: 'text-success-300', bg: 'bg-success-500/10', border: 'border-success-500/20' },
    accent: { text: 'text-accent-300', bg: 'bg-accent-500/10', border: 'border-accent-500/20' },
  };
  const cfg = colorMap[color];

  return (
    <div
      className={cn('stat-card cursor-pointer', onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', cfg.bg, cfg.border, 'border')}>
          <Icon size={20} className={cfg.text} />
        </div>
        {trend && (
          <span className={cn('text-xs flex items-center gap-1', trendUp ? 'text-success-300' : 'text-base-300')}>
            {trendUp && <TrendingUp size={12} />}
            {!trendUp && trend.includes('ناموفق') && <AlertTriangle size={12} className="text-danger-300" />}
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-base-50 nums">
          {value}
          {total !== undefined && <span className="text-base-400 text-base font-normal"> / {total}</span>}
        </div>
        <div className="text-base-300 text-xs mt-1">{label}</div>
      </div>
    </div>
  );
}

function ResourceBar({ label, value, icon: Icon, color }: { label: string; value: number; icon: LucideIcon; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-base-300" />
          <span className="text-sm text-base-200">{label}</span>
        </div>
        <span className="text-xs text-base-100 nums font-medium">{Math.round(value)}%</span>
      </div>
      <div className="h-2.5 bg-base-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
