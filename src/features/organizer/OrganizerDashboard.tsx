/**
 * VenueOS — Minimal Organizer Operations Dashboard
 */
import React, { useState } from 'react';
import { OrganizerMetricsBar } from './OrganizerMetricsBar';
import { LiveSOSDispatchPanel } from './LiveSOSDispatchPanel';
import { IssueReportsQueue } from './IssueReportsQueue';
import { BroadcastManager } from './BroadcastManager';
import { VenuesSessionsCRUD } from './VenuesSessionsCRUD';
import { OrganizerAnalytics } from './OrganizerAnalytics';
import { useScheduleStore } from '../../stores/scheduleStore';
import { useToastStore } from '../../stores/toastStore';
import { Button } from '../../components/Button';
import { ShieldAlert, BarChart3, Building2, Radio, Vote, Plus } from 'lucide-react';

type SubTab = 'ops' | 'analytics' | 'crud' | 'broadcast' | 'polls';

const SUB_TABS: { id: SubTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'ops',       label: 'Command & SOS',     icon: ShieldAlert },
  { id: 'analytics', label: 'Analytics',         icon: BarChart3   },
  { id: 'crud',      label: 'Venues & Sessions', icon: Building2   },
  { id: 'broadcast', label: 'Broadcasts',        icon: Radio       },
  { id: 'polls',     label: 'Polls',             icon: Vote        },
];

/* ─── Input shared style ─────────────────── */
const inputCls =
  'w-full px-3 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg text-xs text-[#0a0a0a] placeholder:text-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]';

export const OrganizerDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('ops');
  const { polls, sessions, addPoll } = useScheduleStore();
  const { addToast } = useToastStore();

  const [pollQuestion,     setPollQuestion]     = useState('');
  const [pollOptions,      setPollOptions]      = useState('Very Useful, Somewhat Useful, Needs Work');
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id || '');

  const handleLaunchPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim() || !pollOptions.trim()) {
      addToast('Enter a poll question and at least two answer options.', 'error');
      return;
    }
    const opts = pollOptions.split(',').map(o => o.trim()).filter(Boolean);
    if (opts.length < 2) { addToast('Provide at least two comma-separated options.', 'error'); return; }
    addPoll({ sessionId: selectedSessionId, question: pollQuestion.trim(), options: opts });
    addToast('Live poll pushed to attendees.', 'success');
    setPollQuestion('');
  };

  return (
    <div className="space-y-5">
      {/* Metrics bar */}
      <OrganizerMetricsBar />

      {/* Sub-tab strip */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-[#e8e8e8]">
        {SUB_TABS.map(({ id, label, icon: Icon }) => {
          const active = activeSubTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveSubTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 -mb-px transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] ${
                active
                  ? 'border-[#0a0a0a] text-[#0a0a0a]'
                  : 'border-transparent text-[#6b6b6b] hover:text-[#0a0a0a]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#4f46e5]' : ''}`} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeSubTab === 'ops' && (
        <div className="space-y-6">
          <LiveSOSDispatchPanel />
          <IssueReportsQueue />
        </div>
      )}

      {activeSubTab === 'analytics' && <OrganizerAnalytics />}
      {activeSubTab === 'crud'      && <VenuesSessionsCRUD />}
      {activeSubTab === 'broadcast' && <BroadcastManager />}

      {activeSubTab === 'polls' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Create poll */}
          <div className="bg-white rounded-xl border border-[#e8e8e8] p-5 space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4f46e5]">
                Audience engagement
              </p>
              <h3 className="text-base font-semibold text-[#0a0a0a] mt-0.5">
                Launch Live Poll
              </h3>
              <p className="text-xs text-[#6b6b6b] mt-0.5">
                Push feedback questions directly to attendee screens.
              </p>
            </div>

            <form onSubmit={handleLaunchPoll} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6b6b6b] mb-1">
                  Target session
                </label>
                <select
                  value={selectedSessionId}
                  onChange={e => setSelectedSessionId(e.target.value)}
                  className={inputCls}
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>{s.title} — {s.roomName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6b6b6b] mb-1">
                  Poll question
                </label>
                <input
                  type="text"
                  required
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                  placeholder="e.g. Which AI topic should we explore next?"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6b6b6b] mb-1">
                  Options (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={pollOptions}
                  onChange={e => setPollOptions(e.target.value)}
                  placeholder="Agents, Fine-Tuning, Real-Time Audio"
                  className={inputCls}
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Launch poll
                </Button>
              </div>
            </form>
          </div>

          {/* Active polls */}
          <div className="bg-white rounded-xl border border-[#e8e8e8] p-5 space-y-4">
            <h3 className="text-base font-semibold text-[#0a0a0a]">
              Active polls
              <span className="ml-2 text-xs font-normal text-[#6b6b6b]">({polls.length})</span>
            </h3>

            {polls.length === 0 ? (
              <p className="text-xs text-[#9a9a9a] py-4 text-center">No polls yet.</p>
            ) : (
              <div className="space-y-3">
                {polls.map(poll => {
                  const session    = sessions.find(s => s.id === poll.sessionId);
                  const totalVotes = (poll.votes || []).reduce((sum, v) => sum + v, 0);
                  return (
                    <div key={poll.id} className="rounded-xl border border-[#e8e8e8] p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-[#0a0a0a] leading-snug">{poll.question}</p>
                        <span className="text-[11px] text-[#9a9a9a] shrink-0">{totalVotes} votes</span>
                      </div>
                      <p className="text-[11px] text-[#4f46e5]">{session?.title || 'General'}</p>
                      <div className="space-y-1 pt-1">
                        {poll.options.map((opt, idx) => {
                          const count = poll.votes?.[idx] || 0;
                          const pct   = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                          return (
                            <div key={idx} className="text-xs flex items-center gap-2">
                              <div className="flex-1 h-1 rounded-full bg-[#f0f0f0] overflow-hidden">
                                <div
                                  className="h-full bg-[#4f46e5] rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-[#3a3a3a] w-24 text-right truncate">{opt}</span>
                              <span className="text-[#9a9a9a] w-10 text-right">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
