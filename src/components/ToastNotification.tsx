/**
 * VenueOS — Minimal Toast Notification Stack
 * Design: white cards, left accent bar, hairline border
 */
import React from 'react';
import { useToastStore, ToastType } from '../stores/toastStore';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const config: Record<ToastType, {
  icon: React.FC<{ className?: string }>;
  bar: string;
  iconColor: string;
}> = {
  success: { icon: CheckCircle2, bar: 'bg-[#16a34a]', iconColor: 'text-[#16a34a]' },
  error:   { icon: AlertCircle,  bar: 'bg-[#dc2626]', iconColor: 'text-[#dc2626]' },
  warning: { icon: AlertTriangle, bar: 'bg-[#b45309]', iconColor: 'text-[#b45309]' },
  info:    { icon: Info,          bar: 'bg-[#0369a1]', iconColor: 'text-[#0369a1]' },
};

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useToastStore();
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-50 flex flex-col gap-2 max-w-sm w-auto sm:w-full pointer-events-none"
    >
      {toasts.map(toast => {
        const { icon: Icon, bar, iconColor } = config[toast.type];
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-stretch overflow-hidden rounded-xl border border-[#e8e8e8] bg-white animate-slideUp"
          >
            {/* Left accent bar */}
            <div className={`w-0.5 shrink-0 ${bar}`} />

            {/* Content */}
            <div className="flex items-center gap-3 px-4 py-3 flex-1">
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <p className="text-sm text-[#0a0a0a] flex-1 leading-snug font-medium">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 text-[#9a9a9a] hover:text-[#0a0a0a] rounded-md transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
