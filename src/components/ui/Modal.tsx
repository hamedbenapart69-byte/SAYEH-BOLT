import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
}

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-base-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative panel w-full overflow-hidden animate-slide-up',
          sizeMap[size]
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-700/50">
          <h3 className="text-base-50 font-semibold text-base">{title}</h3>
          <button
            onClick={onClose}
            className="text-base-300 hover:text-base-50 transition-colors p-1 rounded-lg hover:bg-base-800/60"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-5 py-4 border-t border-base-700/50 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
