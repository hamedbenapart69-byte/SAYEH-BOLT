import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { mockWorkflows } from '@/data/mockData';
import type { Workflow } from '@/types';
import {
  Workflow as WorkflowIcon,
  Play,
  Pause,
  Circle,
  Square,
  Diamond,
  ArrowLeft,
  GitBranch,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export function WorkflowPage() {
  const { agents } = useApp();
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [selectedId, setSelectedId] = useState<string>(mockWorkflows[0].id);

  const selected = workflows.find((w) => w.id === selectedId);

  const toggleStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.status === 'active') return { ...w, status: 'paused' };
        if (w.status === 'paused') return { ...w, status: 'active' };
        return w;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-base-50 flex items-center gap-3">
          <WorkflowIcon className="text-primary-400" size={28} />
          نمودار فرآیند
        </h1>
        <p className="text-base-300 text-sm mt-1">نمایش بصری گردش کار و وابستگی‌های بین عاملان</p>
      </div>

      {/* Workflow selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {workflows.map((wf) => (
          <button
            key={wf.id}
            onClick={() => setSelectedId(wf.id)}
            className={cn(
              'panel px-4 py-3 min-w-[200px] text-right transition-all',
              selectedId === wf.id ? 'glow-border' : 'panel-hover'
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-base-50 truncate">{wf.name}</span>
              <StatusIcon status={wf.status} />
            </div>
            <p className="text-xs text-base-300 truncate">{wf.description}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="panel p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-base-50">{selected.name}</h2>
              <p className="text-sm text-base-300">{selected.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                'badge',
                selected.status === 'active' && 'bg-success-500/10 text-success-300',
                selected.status === 'paused' && 'bg-warning-500/10 text-warning-300',
                selected.status === 'completed' && 'bg-primary-500/10 text-primary-300',
                selected.status === 'draft' && 'bg-base-700/40 text-base-200',
              )}>
                {selected.status === 'active' ? 'فعال' : selected.status === 'paused' ? 'متوقف' : selected.status === 'completed' ? 'تکمیل‌شده' : 'پیش‌نویس'}
              </span>
              {(selected.status === 'active' || selected.status === 'paused') && (
                <button
                  onClick={() => toggleStatus(selected.id)}
                  className="btn btn-ghost text-xs"
                >
                  {selected.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                  {selected.status === 'active' ? 'توقف' : 'ادامه'}
                </button>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="relative bg-base-950 rounded-xl border border-base-700/40 overflow-hidden grid-bg" style={{ minHeight: '420px' }}>
            <div className="absolute inset-0 radar-bg" />
            <WorkflowCanvas workflow={selected} agents={agents} />
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 flex-wrap text-xs">
            <LegendItem icon={Circle} label="شروع" color="text-success-400" />
            <LegendItem icon={Square} label="وظیفه" color="text-primary-400" />
            <LegendItem icon={Diamond} label="تصمیم" color="text-warning-400" />
            <LegendItem icon={GitBranch} label="عامل" color="text-accent-400" />
            <LegendItem icon={Square} label="پایان" color="text-base-300" />
          </div>

          {/* Node details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
            {selected.nodes
              .filter((n) => n.type === 'agent')
              .map((node) => {
                const agent = agents.find((a) => a.id === node.agentId);
                if (!agent) return null;
                return (
                  <div key={node.id} className="bg-base-850/60 rounded-lg p-3 border border-base-700/40">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar char={agent.avatar} status={agent.status} size="sm" />
                      <div>
                        <div className="text-sm text-base-100 font-medium">{agent.name}</div>
                        <div className="text-[10px] text-base-300">{node.label}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'badge text-[10px]',
                        node.status === 'done' && 'bg-success-500/10 text-success-300',
                        node.status === 'active' && 'bg-warning-500/10 text-warning-300',
                        node.status === 'pending' && 'bg-base-700/40 text-base-200',
                        node.status === 'error' && 'bg-danger-500/10 text-danger-300',
                      )}>
                        {node.status === 'done' ? 'انجام‌شده' : node.status === 'active' ? 'در حال اجرا' : node.status === 'error' ? 'خطا' : 'در انتظار'}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkflowCanvas({ workflow, agents }: { workflow: Workflow; agents: { id: string; name: string; avatar: string; status: string; role: string }[] }) {
  const nodeColors = {
    start: { bg: 'bg-success-500/15', border: 'border-success-500/30', text: 'text-success-300' },
    end: { bg: 'bg-base-700/40', border: 'border-base-600/40', text: 'text-base-200' },
    task: { bg: 'bg-primary-500/15', border: 'border-primary-500/30', text: 'text-primary-300' },
    decision: { bg: 'bg-warning-500/15', border: 'border-warning-500/30', text: 'text-warning-300' },
    agent: { bg: 'bg-accent-500/15', border: 'border-accent-500/30', text: 'text-accent-300' },
  };

  const statusColors = {
    done: 'ring-2 ring-success-500/40',
    active: 'ring-2 ring-warning-500/40 animate-pulse',
    pending: 'opacity-60',
    error: 'ring-2 ring-danger-500/40',
  };

  return (
    <div className="relative" style={{ width: '100%', minHeight: '420px' }}>
      <svg className="absolute inset-0 w-full h-full" style={{ minHeight: '420px' }}>
        {/* Edges */}
        {workflow.edges.map((edge) => {
          const from = workflow.nodes.find((n) => n.id === edge.from);
          const to = workflow.nodes.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          const x1 = from.x + 70;
          const y1 = from.y + 35;
          const x2 = to.x;
          const y2 = to.y + 35;
          const midX = (x1 + x2) / 2;
          return (
            <g key={edge.id}>
              <path
                d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={edge.active ? '#b88a3e' : '#2f3a47'}
                strokeWidth="2"
                strokeDasharray={edge.active ? '0' : '4 4'}
                className={edge.active ? 'animate-flow' : ''}
                markerEnd="url(#arrowhead)"
              />
              {edge.active && (
                <circle r="3" fill="#d0a85a">
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                  />
                </circle>
              )}
            </g>
          );
        })}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#3a4654" />
          </marker>
        </defs>
      </svg>

      {/* Nodes */}
      {workflow.nodes.map((node) => {
        const cfg = nodeColors[node.type];
        const agent = node.agentId ? agents.find((a) => a.id === node.agentId) : null;
        return (
          <div
            key={node.id}
            className={cn(
              'absolute flex flex-col items-center justify-center rounded-xl border-2 transition-all',
              cfg.bg,
              cfg.border,
              cfg.text,
              statusColors[node.status],
              node.type === 'decision' && 'rotate-45',
              'w-[140px] h-[70px]'
            )}
            style={{ right: `${node.x}px`, top: `${node.y}px` }}
          >
            <div className={cn('flex flex-col items-center', node.type === 'decision' && '-rotate-45')}>
              {agent && (
                <Avatar char={agent.avatar} size="sm" className="mb-1" />
              )}
              <span className="text-xs font-medium text-center px-2">{node.label}</span>
              {node.status === 'done' && (
                <CheckCircle2 size={12} className="text-success-400 mt-0.5" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusIcon({ status }: { status: Workflow['status'] }) {
  if (status === 'active') return <Play size={14} className="text-success-400" />;
  if (status === 'paused') return <Pause size={14} className="text-warning-400" />;
  if (status === 'completed') return <CheckCircle2 size={14} className="text-primary-400" />;
  return <Plus size={14} className="text-base-300" />;
}

function LegendItem({ icon: Icon, label, color }: { icon: typeof Circle; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className={color} />
      <span className="text-base-300">{label}</span>
    </div>
  );
}
