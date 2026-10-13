import { cn } from '@/lib/utils';
import { agentStatusConfig } from '@/lib/utils';
import type { AgentStatus } from '@/types';

interface AvatarProps {
  char: string;
  status?: AgentStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-xl',
};

const dotSizeMap = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3.5 h-3.5',
};

export function Avatar({ char, status, size = 'md', className }: AvatarProps) {
  const cfg = status ? agentStatusConfig[status] : null;
  return (
    <div className={cn('relative shrink-0', className)}>
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center font-bold text-white border border-primary-400/30',
          sizeMap[size]
        )}
      >
        {char}
      </div>
      {cfg && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-base-900',
            dotSizeMap[size],
            cfg.dot
          )}
        >
          {status === 'active' && (
            <span className={cn('absolute inset-0 rounded-full animate-ping-slow', cfg.dot)} />
          )}
        </span>
      )}
    </div>
  );
}
