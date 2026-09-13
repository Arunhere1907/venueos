/**
 * VenueOS — Organizer Facilities Issue Reports Queue
 */
import React, { useState } from 'react';
import { useIssueStore } from '../../stores/issueStore';
import { mockRealtimeService } from '../../services/mockRealtimeService';
import { IssueStatus } from '../../types';
import { getIssueTypeInfo, formatTime } from '../../lib/utils';
import { Button } from '../../components/Button';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  PlayCircle,
  MapPin,
  Zap,
  Filter
} from 'lucide-react';

export const IssueReportsQueue: React.FC = () => {
  const { issues, updateIssueStatus } = useIssueStore();
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');

  const filtered = issues.filter(issue => {
    if (filterStatus === 'all') return true;
    return issue.status === filterStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Facilities & Amenities Dispatch
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            Attendee Issue Tickets Queue
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Triage attendee-submitted reports for liquid spills, queue congestions, broken doors, and sanitation needs.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => mockRealtimeService.triggerSimulatedIssue()}
          leftIcon={<Zap className="w-4 h-4 text-amber-500" />}
          className="shrink-0"
          title="Simulate an attendee reporting a spill"
        >
          Simulate Test Issue
        </Button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Status:
        </span>
        {(['all', 'open', 'in_progress', 'resolved'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              filterStatus === status
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No Tickets Found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Facilities queue is completely caught up!</p>
          </div>
        ) : (
          filtered.map(issue => {
            const typeInfo = getIssueTypeInfo(issue.type);

            return (
              <div
                key={issue.id}
                className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${typeInfo.badge}`}>
                        {typeInfo.label}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatTime(issue.timestamp)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          issue.status === 'open'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                            : issue.status === 'in_progress'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        }`}
                      >
                        {issue.status.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-base font-semibold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>{issue.venueName || 'Concourse Walkway'}</span>
                    </h4>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-2">
                    {issue.status === 'open' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => updateIssueStatus(issue.id, 'in_progress')}
                        leftIcon={<PlayCircle className="w-4 h-4 text-sky-600" />}
                      >
                        Mark In Progress
                      </Button>
                    )}

                    {issue.status !== 'resolved' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateIssueStatus(issue.id, 'resolved')}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Resolve Ticket
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {issue.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
                  <span>Reported by: {issue.reporterName || 'Attendee'}</span>
                  <span>Ticket ID: {issue.id}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
