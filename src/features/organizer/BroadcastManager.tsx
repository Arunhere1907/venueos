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

  /* shared input style */
  const inputCls = 'w-full px-3 py-2.5 bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg text-xs text-[#0a0a0a] placeholder:text-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]';
  const labelCls = 'block text-[11px] font-semibold uppercase tracking-wider text-[#6b6b6b] mb-1.5';

  return (
    <div className="bg-white rounded-xl border border-[#e8e8e8] p-5 space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <Radio className="w-4 h-4 text-[#4f46e5]" />
          <h3 className="text-base font-semibold text-[#0a0a0a]">Push Event Announcement</h3>
        </div>
        <p className="text-xs text-[#6b6b6b]">
          Broadcast bulletins, schedule shifts, warnings, or crowd advisories in real time to all attendee devices.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Severity */}
        <div>
          <label className={labelCls}>Priority level</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { level: 'info',    label: 'Info',    activeClass: 'border-[#0369a1] bg-[#f0f9ff] text-[#0369a1]', icon: Info          },
              { level: 'warning', label: 'Warning', activeClass: 'border-[#b45309] bg-[#fffbeb] text-[#b45309]', icon: AlertTriangle  },
              { level: 'urgent',  label: 'Urgent',  activeClass: 'border-[#dc2626] bg-[#fff5f5] text-[#dc2626]', icon: BellRing       },
            ] as const).map(({ level, label, activeClass, icon: Icon }) => (
              <button
                key={level}
                type="button"
                onClick={() => setSeverity(level)}
                className={`flex items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] ${
                  severity === level
                    ? activeClass
                    : 'border-[#e8e8e8] bg-white text-[#6b6b6b] hover:bg-[#f7f7f7]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Target zone */}
        <div>
          <label className={labelCls}>Geographic scope</label>
          <select
            value={targetZoneId}
            onChange={e => setTargetZoneId(e.target.value)}
            className={inputCls}
          >
            <option value="all">Entire venue (all attendees)</option>
            {zones.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className={labelCls}>Headline</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Keynote Q&A starting in Main Amphitheater"
            maxLength={200}
            className={inputCls}
          />
        </div>

        {/* Body */}
        <div>
          <label className={labelCls}>Message body</label>
          <textarea
            required
            rows={3}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Provide clear, concise instructions."
            maxLength={1000}
            className={inputCls + ' resize-none'}
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            variant="primary"
            leftIcon={<Send className="w-3.5 h-3.5" />}
            disabled={!title.trim() || !body.trim()}
          >
            Transmit Broadcast
          </Button>
        </div>
      </form>
    </div>
  );
};
