/**
 * VenueOS — Organizer Broadcast Center
 */
import React, { useState } from 'react';
import { useAnnouncementStore } from '../../stores/announcementsStore';
import { useCrowdStore } from '../../stores/crowdStore';
import { useToastStore } from '../../stores/toastStore';
import { AnnouncementSeverity } from '../../types';
import { sanitizeInput } from '../../lib/utils';
import { Button } from '../../components/Button';
import {
  Radio,
  Send,
  AlertTriangle,
  Info,
  BellRing
} from 'lucide-react';

export const BroadcastManager: React.FC = () => {
  const { broadcastAnnouncement } = useAnnouncementStore();
  const { zones } = useCrowdStore();
  const { addToast } = useToastStore();

  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [severity, setSeverity] = useState<AnnouncementSeverity>('info');
  const [targetZoneId, setTargetZoneId] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitizedTitle = sanitizeInput(title, 200);
    const sanitizedBody = sanitizeInput(body, 1000);
    
    if (!sanitizedTitle.trim() || !sanitizedBody.trim()) {
      addToast('Please provide both a title and message for the broadcast.', 'error');
      return;
    }

    broadcastAnnouncement({
      title: sanitizedTitle,
      body: sanitizedBody,
      severity,
      targetZoneId: targetZoneId === 'all' ? undefined : targetZoneId
    });

    addToast(`Broadcast sent: "${sanitizedTitle}"`, 'success');
    setTitle('');
    setBody('');
    setSeverity('info');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Push Event Announcement
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Broadcast operational bulletins, schedule shifts, emergency warnings, or crowd advisories in real time to all attendee mobile devices.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Severity Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Announcement Priority Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { level: 'info', label: 'Info / General', color: 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300', icon: Info },
              { level: 'warning', label: 'Warning / Advisory', color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300', icon: AlertTriangle },
              { level: 'urgent', label: 'Urgent / Banner', color: 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300', icon: BellRing }
            ].map(({ level, label, color, icon: Icon }) => (
              <button
                key={level}
                type="button"
                onClick={() => setSeverity(level as AnnouncementSeverity)}
                className={`p-3 rounded-lg border text-left flex items-center gap-2 transition-all text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  severity === level
                    ? `${color} ring-2 ring-indigo-500/20`
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Zone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Geographic Scope
          </label>
          <select
            value={targetZoneId}
            onChange={(e) => setTargetZoneId(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <option value="all">Broadcast Entire Venue (All Attendees)</option>
            {zones.map(z => (
              <option key={z.id} value={z.id}>
                Target: {z.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Headline / Subject
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Keynote Q&A Starting in Main Amphitheater"
            maxLength={200}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
        </div>

        {/* Message Body */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Full Announcement Body
          </label>
          <textarea
            required
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Provide clear, concise instructions. Text will also be read aloud to vision-impaired attendees using text-to-speech."
            maxLength={1000}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            leftIcon={<Send className="w-4 h-4" />}
            disabled={!title.trim() || !body.trim()}
          >
            Transmit Live Broadcast
          </Button>
        </div>
      </form>
    </div>
  );
};
