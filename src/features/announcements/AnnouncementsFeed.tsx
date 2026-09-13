/**
 * VenueOS — Real-Time Announcements Feed & Speech Reader
 */
import React, { useState } from 'react';
import { useAnnouncementStore } from '../../stores/announcementsStore';
import { mockRealtimeService } from '../../services/mockRealtimeService';
import { getSeverityBadge, formatTime } from '../../lib/utils';
import { speakText } from '../../lib/speech';
import { AnnouncementSeverity } from '../../types';
import {
  Bell,
  Volume2,
  AlertTriangle,
  Info,
  Radio,
  Sparkles,
  Filter
} from 'lucide-react';
import { Button } from '../../components/Button';

export const AnnouncementsFeed: React.FC = () => {
  const { announcements } = useAnnouncementStore();
  const [filterSeverity, setFilterSeverity] = useState<AnnouncementSeverity | 'all'>('all');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const filtered = announcements.filter(a => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  const handleSpeak = (id: string, title: string, body: string) => {
    setSpeakingId(id);
    speakText(`${title}. ${body}`).then(() => {
      setSpeakingId(null);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Broadcast status */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Live Event Broadcast
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Official Announcements & Updates
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Real-time notifications from Event Security, Speaker Coordinators, and Venue Facilities.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => mockRealtimeService.triggerSimulatedAnnouncement()}
          leftIcon={<Radio className="w-4 h-4 text-indigo-600" />}
          className="shrink-0"
          title="Simulate a new incoming announcement pushed by organizers"
        >
          Push Test Broadcast
        </Button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 pl-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {(['all', 'urgent', 'warning', 'info'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              filterSeverity === sev
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-2">
            <Bell className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No announcements in this category</h4>
            <p className="text-xs text-slate-500">All is quiet right now across the venue channels.</p>
          </div>
        ) : (
          filtered.map((ann) => {
            const badge = getSeverityBadge(ann.severity);
            const isSpeaking = speakingId === ann.id;

            return (
              <article
                key={ann.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`p-2 rounded-xl border mt-0.5 ${badge.bg} ${badge.border}`}>
                      {ann.severity === 'urgent' || ann.severity === 'warning' ? (
                        <AlertTriangle className={`w-4 h-4 ${badge.text}`} />
                      ) : (
                        <Info className={`w-4 h-4 ${badge.text}`} />
                      )}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatTime(ann.timestamp)}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {ann.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeak(ann.id, ann.title, ann.body)}
                    className={`p-2 rounded-xl border transition-all ${
                      isSpeaking
                        ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                    title="Read announcement aloud (TTS)"
                    aria-label="Read announcement aloud with text to speech"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 pl-11 leading-relaxed">
                  {ann.body}
                </p>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
