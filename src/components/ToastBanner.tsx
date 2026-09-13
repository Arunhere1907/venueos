/**
 * VenueOS — Minimal Urgency Banner
 * Design: thin top bar with left-colored stripe by severity
 */
import React from 'react';
import { AlertTriangle, Info, Volume2, X } from 'lucide-react';
import { useAnnouncementStore } from '../stores/announcementsStore';
import { speakText } from '../lib/speech';

export const ToastBanner: React.FC = () => {
  const { activeUrgentBanner, dismissUrgentBanner } = useAnnouncementStore();
  if (!activeUrgentBanner) return null;

  const { severity, title, body } = activeUrgentBanner;
  const isUrgent  = severity === 'urgent';
  const isWarning = severity === 'warning';

  const stripe = isUrgent ? 'bg-[#dc2626]' : isWarning ? 'bg-[#b45309]' : 'bg-[#4f46e5]';
  const iconColor = isUrgent ? 'text-[#dc2626]' : isWarning ? 'text-[#b45309]' : 'text-[#4f46e5]';
  const labelColor = isUrgent ? 'text-[#dc2626]' : isWarning ? 'text-[#b45309]' : 'text-[#4f46e5]';

  return (
    <aside
      role="alert"
      aria-live="assertive"
      className="sticky top-0 z-50 bg-white border-b border-[#e8e8e8] flex items-stretch animate-slideDown"
    >
      {/* Severity stripe */}
      <div className={`w-0.5 shrink-0 ${stripe}`} />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {isUrgent || isWarning
            ? <AlertTriangle className={`w-4 h-4 shrink-0 ${iconColor}`} />
            : <Info className={`w-4 h-4 shrink-0 ${iconColor}`} />
          }
          <div className="min-w-0 flex-1 truncate text-sm">
            <span className={`font-semibold mr-1.5 ${labelColor}`}>{title}:</span>
            <span className="text-[#3a3a3a] font-normal">{body}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => speakText(`${title}. ${body}`)}
            aria-label="Read aloud"
            className="p-1.5 text-[#9a9a9a] hover:text-[#0a0a0a] hover:bg-[#f7f7f7] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={dismissUrgentBanner}
            aria-label="Dismiss"
            className="p-1.5 text-[#9a9a9a] hover:text-[#0a0a0a] hover:bg-[#f7f7f7] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
