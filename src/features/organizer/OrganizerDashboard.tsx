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
      <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto scrollbar-none">
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
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeSubTab === id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
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
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                Audience Engagement
              </span>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                Launch Live Session Poll
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Push interactive feedback questions directly onto attendee mobile screens during talks.
              </p>
            </div>

            <form onSubmit={handleLaunchPoll} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase text-xs tracking-wider mb-2">
                  Target Session
                </label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-white"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.roomName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase text-xs tracking-wider mb-2">
                  Poll Question
                </label>
                <input
                  type="text"
                  required
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g. Which generative AI topic should we dive deeper into?"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase text-xs tracking-wider mb-2">
                  Answer Options (Comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={pollOptions}
                  onChange={(e) => setPollOptions(e.target.value)}
                  placeholder="Agents & Tool Use, Fine-Tuning, Real-Time Audio"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-white"
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
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Active Polls ({polls.length})
            </h3>
            <div className="space-y-3">
              {polls.map(poll => {
                const session = sessions.find(s => s.id === poll.sessionId);
                const totalVotes = (poll.votes || []).reduce((sum, v) => sum + v, 0);

                return (
                  <div key={poll.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">
                        {poll.question}
                      </span>
                      <span className="text-xs text-slate-400">
                        {totalVotes} votes
                      </span>
                    </div>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 block">
                      Session: {session?.title || 'General'}
                    </span>
                    <div className="space-y-1 pt-1">
                      {poll.options.map((optText, idx) => {
                        const count = poll.votes?.[idx] || 0;
                        const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                        return (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                            <span>{optText}</span>
                            <span className="font-medium">{count} ({pct}%)</span>
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
