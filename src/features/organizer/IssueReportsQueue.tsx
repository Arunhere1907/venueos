/**
 * VenueOS — Minimal Facilities Issue Reports Queue
 */
import React, { useState } from 'react';
import { useIssueStore } from '../../stores/issueStore';
import { mockRealtimeService } from '../../services/mockRealtimeService';
import { IssueStatus } from '../../types';
import { getIssueTypeInfo, formatTime } from '../../lib/utils';
import { Button } from '../../components/Button';
import { AlertTriangle, CheckCircle2, PlayCircle, MapPin, Zap, Filter } from 'lucide-react';

export const IssueReportsQueue: React.FC = () => {
  const { issues, updateIssueStatus } = useIssueStore();
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');

  const filtered = issues.filter(i => filterStatus === 'all' || i.status === filterStatus);

  const statusStyle: Record<string, string> = {
    open:        'bg-[#fffbeb] text-[#b45309] border-[#fde68a]',
    in_progress: 'bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]',
    resolved:    'bg-[#f0faf4] text-[#16a34a] border-[#bbf7d0]',
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="bg-white rounded-xl border border-[#e8e8e8] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#b45309] mb-1">
            Facilities &amp; Amenities Dispatch
          </p>
          <h3 className="text-base font-semibold text-[#0a0a0a]">Attendee Issue Tickets Queue</h3>
          <p className="text-xs text-[#6b6b6b] mt-0.5">
            Triage attendee-submitted reports for spills, congestion, and sanitation needs.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => mockRealtimeService.triggerSimulatedIssue()}
          leftIcon={<Zap className="w-3.5 h-3.5 text-[#b45309]" />}
          className="shrink-0"
        >
          Simulate Issue
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 text-[11px] font-medium text-[#6b6b6b]">
          <Filter className="w-3 h-3" /> Status:
        </span>
        {(['all', 'open', 'in_progress', 'resolved'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] ${
              filterStatus === s
                ? 'bg-[#0a0a0a] text-white'
                : 'bg-white text-[#3a3a3a] border border-[#e8e8e8] hover:border-[#d4d4d4]'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-[#e8e8e8] space-y-2">
            <CheckCircle2 className="w-7 h-7 text-[#16a34a] mx-auto" />
            <p className="text-sm font-semibold text-[#0a0a0a]">No Tickets Found</p>
            <p className="text-xs text-[#6b6b6b]">Facilities queue is completely caught up.</p>
          </div>
        ) : (
          filtered.map(issue => {
            const typeInfo = getIssueTypeInfo(issue.type);
            return (
              <div
                key={issue.id}
                className="bg-white rounded-xl border border-[#e8e8e8] p-5 space-y-3 hover:border-[#d4d4d4] transition-colors"
              >
                {/* Top row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${typeInfo.badge}`}>
                        {typeInfo.label}
                      </span>
                      <span className="text-[#c8c8c8]">·</span>
                      <span className="text-xs text-[#6b6b6b]">{formatTime(issue.timestamp)}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusStyle[issue.status] || ''}`}>
                        {issue.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h4 className="flex items-center gap-1.5 text-sm font-semibold text-[#0a0a0a] mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#4f46e5] shrink-0" />
                      {issue.venueName || 'Concourse Walkway'}
                    </h4>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {issue.status === 'open' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateIssueStatus(issue.id, 'in_progress')}
                        leftIcon={<PlayCircle className="w-3.5 h-3.5 text-[#0369a1]" />}
                      >
                        In Progress
                      </Button>
                    )}
                    {issue.status !== 'resolved' && (
                      <button
                        onClick={() => updateIssueStatus(issue.id, 'resolved')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolve
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[#3a3a3a] leading-relaxed">{issue.description}</p>

                <div className="pt-2.5 border-t border-[#f0f0f0] flex items-center justify-between text-[11px] text-[#9a9a9a]">
                  <span>Reported by: {issue.reporterName || 'Attendee'}</span>
                  <span>ID: {issue.id}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
