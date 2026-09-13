/**
 * VenueOS — Live Session Polling & Interactive Q&A
 */
import React from 'react';
import { PollQuestion } from '../../types';
import { useScheduleStore } from '../../stores/scheduleStore';
import { useToastStore } from '../../stores/toastStore';
import { BarChart2, CheckCircle2 } from 'lucide-react';

interface LivePollCardProps {
  poll?: PollQuestion;
}

export const LivePollCard: React.FC<LivePollCardProps> = ({ poll }) => {
  const { polls, votePoll } = useScheduleStore();
  const { addToast } = useToastStore();
  const currentPoll = poll || polls[0];

  if (!currentPoll) return null;

  const totalVotes = (currentPoll.votes || []).reduce((acc, curr) => acc + curr, 0);
  const hasVoted = currentPoll.userVotedIndex !== undefined;

  const handleVote = (idx: number) => {
    votePoll(currentPoll.id, idx);
    addToast(`Vote recorded for "${currentPoll.options[idx]}"!`, 'success');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          <BarChart2 className="w-4 h-4" />
          <span>Live Audience Poll</span>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {totalVotes} total votes
        </span>
      </div>

      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
        {currentPoll.question}
      </h4>

      {/* Options */}
      <div className="space-y-2">
        {(currentPoll.options || []).map((option, idx) => {
          const votesCount = currentPoll.votes?.[idx] || 0;
          const percentage = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
          const isSelected = currentPoll.userVotedIndex === idx;

          return (
            <button
              key={idx}
              disabled={hasVoted}
              onClick={() => handleVote(idx)}
              className={`w-full relative overflow-hidden text-left p-3 rounded-xl border transition-all text-xs font-medium ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
              } ${hasVoted ? 'cursor-default' : 'cursor-pointer hover:bg-slate-50'}`}
            >
              {/* Result background progress bar */}
              {hasVoted && (
                <div
                  className="absolute inset-y-0 left-0 bg-indigo-500/15 dark:bg-indigo-500/25 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative flex items-center justify-between gap-2 z-10">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  <span>{option}</span>
                </span>
                {hasVoted && (
                  <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">
                    {percentage}% <span className="text-slate-400 font-normal">({votesCount})</span>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!hasVoted && (
        <p className="text-[11px] text-slate-500 italic text-center">
          Tap an option to cast your live vote.
        </p>
      )}
    </div>
  );
};
