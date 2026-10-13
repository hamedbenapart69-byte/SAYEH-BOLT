import { taskStatusConfig, priorityConfig } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { TaskStatus, TaskPriority } from '@/types';

export function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = taskStatusConfig[status];
  return (
    <span className={cn('badge', cfg.color, cfg.bg, cfg.border, 'border')}>
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const cfg = priorityConfig[priority];
  return (
    <span className={cn('badge', cfg.color, cfg.bg, cfg.border, 'border')}>
      {cfg.label}
    </span>
  );
}
