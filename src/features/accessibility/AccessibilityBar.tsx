/**
 * VenueOS — Minimal Accessibility Toggle Bar
 */
import React from 'react';
import { useAttendeeStore } from '../../stores/attendeeStore';
import { useToastStore } from '../../stores/toastStore';
import { Accessibility, Volume2 } from 'lucide-react';
import { speakText } from '../../lib/speech';

export const AccessibilityBar: React.FC = () => {
  const { profile, toggleAccessibilityMode } = useAttendeeStore();
  const { addToast } = useToastStore();
  const on = profile.accessibilityMode;

  const handleTest = () =>
    speakText('Universal accessibility mode active. Step-free routing, high-contrast visual cues, and assistive speech services are enabled.');

  const handleToggle = () => {
    toggleAccessibilityMode();
    addToast(
      on ? 'Accessibility mode disabled' : 'Accessibility mode enabled — step-free routes & high contrast',
      on ? 'info' : 'success'
    );
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-colors ${
        on
          ? 'bg-[#0a0a0a] border-[#0a0a0a] text-white'
          : 'bg-white border-[#e8e8e8] text-[#0a0a0a]'
      }`}
    >
      {/* Label */}
      <div className="flex items-center gap-2.5">
        <Accessibility className={`w-4 h-4 shrink-0 ${on ? 'text-white' : 'text-[#4f46e5]'}`} />
        <div>
          <p className="text-sm font-medium leading-none">
            Universal Accessibility Mode
            {on && (
              <span className="ml-2 text-[10px] font-semibold tracking-widest uppercase text-[#4ade80]">
                on
              </span>
            )}
          </p>
          <p className={`text-[11px] mt-0.5 ${on ? 'text-[#c8c8c8]' : 'text-[#6b6b6b]'}`}>
            Step-free routing · elevated contrast · screen reader cues
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {on && (
          <button
            onClick={handleTest}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Test voice</span>
          </button>
        )}
        <button
          onClick={handleToggle}
          aria-pressed={on}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#4f46e5] ${
            on
              ? 'bg-white text-[#0a0a0a] hover:bg-[#f7f7f7]'
              : 'bg-[#0a0a0a] text-white hover:bg-[#1a1a1a]'
          }`}
        >
          {on ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  );
};
