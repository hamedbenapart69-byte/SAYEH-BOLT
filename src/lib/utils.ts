import type { AgentStatus, TaskStatus, TaskPriority, LogLevel } from '@/types';

export const agentStatusConfig: Record<
  AgentStatus,
  { label: string; color: string; dot: string; bg: string }
> = {
  active: { label: 'فعال', color: 'text-success-300', dot: 'bg-success-400', bg: 'bg-success-500/10' },
  idle: { label: 'بیکار', color: 'text-base-200', dot: 'bg-base-300', bg: 'bg-base-600/20' },
  busy: { label: 'مشغول', color: 'text-warning-300', dot: 'bg-warning-400', bg: 'bg-warning-500/10' },
  offline: { label: 'آفلاین', color: 'text-base-300', dot: 'bg-base-500', bg: 'bg-base-700/30' },
  error: { label: 'خطا', color: 'text-danger-300', dot: 'bg-danger-400', bg: 'bg-danger-500/10' },
};

export const taskStatusConfig: Record<
  TaskStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  pending: { label: 'در انتظار', color: 'text-base-200', bg: 'bg-base-700/40', border: 'border-base-600/40' },
  assigned: { label: 'محول‌شده', color: 'text-primary-200', bg: 'bg-primary-500/10', border: 'border-primary-500/20' },
  in_progress: { label: 'در حال اجرا', color: 'text-warning-200', bg: 'bg-warning-500/10', border: 'border-warning-500/20' },
  review: { label: 'در حال بازبینی', color: 'text-accent-200', bg: 'bg-accent-500/10', border: 'border-accent-500/20' },
  completed: { label: 'تکمیل‌شده', color: 'text-success-200', bg: 'bg-success-500/10', border: 'border-success-500/20' },
  failed: { label: 'ناموفق', color: 'text-danger-200', bg: 'bg-danger-500/10', border: 'border-danger-500/20' },
  cancelled: { label: 'لغوشده', color: 'text-base-300', bg: 'bg-base-700/30', border: 'border-base-600/30' },
};

export const priorityConfig: Record<
  TaskPriority,
  { label: string; color: string; bg: string; border: string }
> = {
  low: { label: 'کم', color: 'text-base-200', bg: 'bg-base-700/40', border: 'border-base-600/40' },
  medium: { label: 'متوسط', color: 'text-primary-200', bg: 'bg-primary-500/10', border: 'border-primary-500/20' },
  high: { label: 'زیاد', color: 'text-warning-200', bg: 'bg-warning-500/10', border: 'border-warning-500/20' },
  critical: { label: 'بحرانی', color: 'text-danger-200', bg: 'bg-danger-500/10', border: 'border-danger-500/20' },
};

export const logLevelConfig: Record<
  LogLevel,
  { label: string; color: string; bg: string; icon: string }
> = {
  info: { label: 'اطلاع', color: 'text-primary-300', bg: 'bg-primary-500/10', icon: 'info' },
  success: { label: 'موفق', color: 'text-success-300', bg: 'bg-success-500/10', icon: 'check' },
  warning: { label: 'هشدار', color: 'text-warning-300', bg: 'bg-warning-500/10', icon: 'alert' },
  error: { label: 'خطا', color: 'text-danger-300', bg: 'bg-danger-500/10', icon: 'error' },
  debug: { label: 'دیباگ', color: 'text-base-300', bg: 'bg-base-700/30', icon: 'debug' },
};

export function getNowTime(): string {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
