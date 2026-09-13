/**
 * VenueOS — Master Organizer Operations & Command Center
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
import {
  ShieldAlert,
  BarChart3,
  Building2,
  Radio,
  Vote,
  Layers,
  Sparkles,
  Plus
} from 'lucide-react';

export const OrganizerDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ops' | 'analytics' | 'crud' | 'broadcast' | 'polls'>('ops');
  const { polls, sessions, addPoll } = useScheduleStore();
  const { addToast } = useToastStore();

  const [pollQuestion, setPollQuestion] = useState<string>('');
  const [pollOptions, setPollOptions] = useState<string>('Very Useful, Somewhat Useful, Needs Work');
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');

  const handleLaunchPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim() || !pollOptions.trim()) {
      addToast('Please enter a poll question and at least two answer options.', 'error');
      return;
    }

    const opts = pollOptions.split(',').map(o => o.trim()).filter(Boolean);
    if (opts.length < 2) {
      addToast('Provide at least two comma-separated answer options.', 'error');
      return;
    }

    addPoll({
      sessionId: selectedSessionId,
      question: pollQuestion.trim(),
      options: opts
    });

    addToast('Live poll pushed to attendees!', 'success');
    setPollQuestion('');
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <OrganizerMetricsBar />

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto scrollbar-none">
        {[
          { id: 'ops', label: 'Command & SOS', icon: ShieldAlert },
          { id: 'analytics', label: 'Telemetry & Analytics', icon: BarChart3 },
          { id: 'crud', label: 'Venues & Sessions', icon: Building2 },
          { id: 'broadcast', label: 'Live Broadcasts', icon: Radio },
          { id: 'polls', label: 'Session Polling', icon: Vote }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSubTab(id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* View Content */}
      {activeSubTab === 'ops' && (
        <div className="space-y-8">
          <LiveSOSDispatchPanel />
          <IssueReportsQueue />
        </div>
      )}

      {activeSubTab === 'analytics' && <OrganizerAnalytics />}

      {activeSubTab === 'crud' && <VenuesSessionsCRUD />}

      {activeSubTab === 'broadcast' && <BroadcastManager />}

      {activeSubTab === 'polls' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Poll Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                Audience Engagement
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                Launch Live Session Poll
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Push interactive feedback questions directly onto attendee mobile screens during talks.
              </p>
            </div>

            <form onSubmit={handleLaunchPoll} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Session
                </label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.roomName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Poll Question
                </label>
                <input
                  type="text"
                  required
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g. Which generative AI topic should we dive deeper into?"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Answer Options (Comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={pollOptions}
                  onChange={(e) => setPollOptions(e.target.value)}
                  placeholder="Agents & Tool Use, Fine-Tuning, Real-Time Audio"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Launch Poll
                </Button>
              </div>
            </form>
          </div>

          {/* Active Polls Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Active Polls ({polls.length})
            </h3>
            <div className="space-y-4">
              {polls.map(poll => {
                const session = sessions.find(s => s.id === poll.sessionId);
                const totalVotes = (poll.votes || []).reduce((sum, v) => sum + v, 0);

                return (
                  <div key={poll.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {poll.question}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {totalVotes} votes
                      </span>
                    </div>
                    <span className="text-[11px] text-indigo-600 block">
                      Session: {session?.title || 'General'}
                    </span>
                    <div className="space-y-1 pt-1">
                      {poll.options.map((optText, idx) => {
                        const count = poll.votes?.[idx] || 0;
                        const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                        return (
                          <div key={idx} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                            <span>{optText}</span>
                            <span className="font-bold">{count} ({pct}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
