/**
 * VenueOS — Accessibility Control & Preferences Bar
 */
import React from 'react';
import { useAttendeeStore } from '../../stores/attendeeStore';
import { useToastStore } from '../../stores/toastStore';
import { Accessibility, Volume2, Check } from 'lucide-react';
import { speakText } from '../../lib/speech';

export const AccessibilityBar: React.FC = () => {
  const { profile, toggleAccessibilityMode } = useAttendeeStore();
  const { addToast } = useToastStore();
  const isEnabled = profile.accessibilityMode;

  const handleTestTTS = () => {
    speakText('Universal accessibility mode active. Step-free routing, high-contrast visual cues, and assistive speech services are enabled.');
  };

  const handleToggle = () => {
    toggleAccessibilityMode();
    if (!isEnabled) {
      addToast('Universal Accessibility Mode enabled (Step-Free routes & high-contrast)', 'success');
    } else {
      addToast('Universal Accessibility Mode disabled', 'info');
    }
  };

  return (
    <div
      className={`rounded-2xl p-3.5 transition-all flex flex-wrap items-center justify-between gap-3 ${
        isEnabled
          ? 'bg-slate-900 text-white border-2 border-emerald-400 shadow-md'
          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-xl shrink-0 ${
            isEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-50 text-indigo-600'
          }`}
        >
          <Accessibility className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold">Universal Accessibility Mode</h4>
            {isEnabled && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs opacity-80">
            Step-free routing, elevated contrast typography, and assistive screen reader cues.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleTestTTS}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 border transition-all ${
            isEnabled
              ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
          title="Test screen reader speech"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Speech Guide</span>
        </button>

        <button
          onClick={handleToggle}
          aria-pressed={isEnabled}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            isEnabled
              ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-sm'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isEnabled ? (
            <>
              <Check className="w-4 h-4" />
              <span>Enabled</span>
            </>
          ) : (
            <span>Enable Mode</span>
          )}
        </button>
      </div>
    </div>
  );
};
