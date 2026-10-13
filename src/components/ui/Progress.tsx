import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  label?: string;
}

export function ProgressRing({
  value,
  size = 60,
  stroke = 4,
  className,
  label,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-base-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary-400 transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base-50 font-bold nums text-sm">{Math.round(value)}%</span>
        {label && <span className="text-base-300 text-[10px]">{label}</span>}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
}

export function ProgressBar({ value, className, showLabel, color }: ProgressBarProps) {
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-xs">
          <span className="text-base-300">پیشرفت</span>
          <span className="text-base-100 nums">{Math.round(value)}%</span>
        </div>
      )}
      <div className="h-2 bg-base-800 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            color || 'bg-primary-500'
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
