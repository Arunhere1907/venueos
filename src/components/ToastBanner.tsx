/**
 * VenueOS — Top Urgency / Real-time Toast Banner
 */
import React from 'react';
import { AlertTriangle, Info, Volume2, X } from 'lucide-react';
import { useAnnouncementStore } from '../stores/announcementsStore';
import { speakText } from '../lib/speech';

export const ToastBanner: React.FC = () => {
  const { activeUrgentBanner, dismissUrgentBanner } = useAnnouncementStore();

  if (!activeUrgentBanner) return null;

  const isUrgent = activeUrgentBanner.severity === 'urgent';
  const isWarning = activeUrgentBanner.severity === 'warning';

  const handleSpeak = () => {
    speakText(`${activeUrgentBanner.title}. ${activeUrgentBanner.body}`);
  };

  const bgStyle = isUrgent
    ? 'bg-rose-600 text-white'
    : isWarning
    ? 'bg-amber-600 text-white'
    : 'bg-indigo-600 text-white';

  return (
    <aside
      role="alert"
      aria-live="assertive"
      className={`${bgStyle} px-4 py-3 shadow-md border-b border-black/10 transition-all duration-200 sticky top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="p-1.5 rounded-lg bg-white/20 shrink-0">
            {isUrgent || isWarning ? (
              <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
            ) : (
              <Info className="w-5 h-5 text-white" />
            )}
          </span>
          <div className="min-w-0 flex-1 leading-snug">
            <span className="font-bold mr-2 text-sm sm:text-base inline">
              {activeUrgentBanner.title}:
            </span>
            <span className="text-xs sm:text-sm text-white/95 font-normal inline">
              {activeUrgentBanner.body}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSpeak}
            title="Read announcement aloud"
            aria-label="Read announcement aloud with text to speech"
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={dismissUrgentBanner}
            title="Dismiss"
            aria-label="Dismiss announcement banner"
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
