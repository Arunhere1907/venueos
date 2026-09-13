/**
 * VenueOS — Minimal Live SOS & Staff Dispatch Panel
 */
import React, { useState } from 'react';
import { useSOSStore } from '../../stores/sosStore';
import { mockRealtimeService } from '../../services/mockRealtimeService';
import { formatTime } from '../../lib/utils';
import { Button } from '../../components/Button';
import {
  AlertOctagon,
  HeartPulse,
  Shield,
  HelpCircle,
  CheckCircle2,
  UserCheck,
  MapPin,
  Send,
  Zap,
} from 'lucide-react';

export const LiveSOSDispatchPanel: React.FC = () => {
  const { requests, staff, acknowledgeSOS, resolveSOS, dispatchStaffToSOS } = useSOSStore();
  const [selectedStaffBySOS, setSelectedStaffBySOS] = useState<Record<string, string>>({});

  const pendingRequests  = requests.filter(r => r.status !== 'resolved');
  const resolvedRequests = requests.filter(r => r.status === 'resolved');
  const availableStaff   = staff.filter(s => s.status === 'available');

  const handleStaffSelect = (sosId: string, staffId: string) =>
    setSelectedStaffBySOS(prev => ({ ...prev, [sosId]: staffId }));

  const handleDispatch = (sosId: string) => {
    const id = selectedStaffBySOS[sosId] || availableStaff[0]?.id;
    if (id) dispatchStaffToSOS(sosId, id);
  };

  /* ─ shared input style ─ */
  const inputCls = 'px-3 py-1.5 bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg text-xs text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]';

  return (
    <div className="space-y-5">

      {/* ── Header card ──────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#e8e8e8] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-ping" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#dc2626]">
              Emergency Command Center
            </span>
          </div>
          <h3 className="text-base font-semibold text-[#0a0a0a]">
            Live SOS Triage &amp; Tactical Staff Dispatch
          </h3>
          <p className="text-xs text-[#6b6b6b] mt-0.5">
            Monitor incoming SOS requests and deploy the closest certified medical or security personnel.
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => mockRealtimeService.triggerSimulatedSOS()}
          leftIcon={<Zap className="w-3.5 h-3.5" />}
          className="shrink-0"
        >
          Simulate Test SOS
        </Button>
      </div>

      {/* ── Staff roster ─────────────────────────────────── */}
      <div className="bg-[#f7f7f7] rounded-xl border border-[#e8e8e8] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b6b6b] mb-3">
          On-duty staff roster — {availableStaff.length} available / {staff.length} total
        </p>
        <div className="flex flex-wrap gap-2">
          {staff.map(member => (
            <div
              key={member.id}
              className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border ${
                member.status === 'available'
                  ? 'bg-white border-[#e8e8e8] text-[#0a0a0a]'
                  : 'bg-[#fffbeb] border-[#fde68a] text-[#b45309]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                member.status === 'available' ? 'bg-[#16a34a]' : 'bg-[#b45309]'
              }`} />
              <span className="font-medium">{member.name}</span>
              <span className="text-[10px] text-[#9a9a9a] uppercase">
                {member.role} · {member.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Active requests ───────────────────────────────── */}
      <div className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0a0a0a]">
          <AlertOctagon className="w-4 h-4 text-[#dc2626]" />
          Active Requests Requiring Action
          <span className="text-xs font-normal text-[#6b6b6b]">({pendingRequests.length})</span>
        </h4>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-[#e8e8e8] space-y-2">
            <CheckCircle2 className="w-7 h-7 text-[#16a34a] mx-auto" />
            <p className="text-sm font-semibold text-[#0a0a0a]">No Active Emergencies</p>
            <p className="text-xs text-[#6b6b6b]">All venue sectors are clear. Response teams standing by.</p>
          </div>
        ) : (
          pendingRequests.map(req => {
            const isPending = req.status === 'pending';

            return (
              <div
                key={req.id}
                className={`rounded-xl border p-5 space-y-3 ${
                  isPending
                    ? 'bg-[#fff5f5] border-[#fecaca]'
                    : 'bg-white border-[#e8e8e8]'
                }`}
              >
                {/* Row 1: type + status + actions */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Type icon */}
                    <div className={`p-2.5 rounded-lg ${
                      req.type === 'medical'  ? 'bg-[#dc2626] text-white' :
                      req.type === 'security' ? 'bg-[#4f46e5] text-white' :
                                                'bg-[#b45309] text-white'
                    }`}>
                      {req.type === 'medical'  ? <HeartPulse className="w-4 h-4" /> :
                       req.type === 'security' ? <Shield className="w-4 h-4" />    :
                                                 <HelpCircle className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[#dc2626] uppercase tracking-wide">
                          {req.type} Emergency
                        </span>
                        <span className="text-[#c8c8c8]">·</span>
                        <span className="text-xs text-[#6b6b6b]">{formatTime(req.timestamp)}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          isPending
                            ? 'bg-[#dc2626] text-white'
                            : 'bg-[#f0faf4] text-[#16a34a] border border-[#bbf7d0]'
                        }`}>
                          {req.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#0a0a0a] mt-0.5">
                        {req.venueName || 'Concourse Corridor'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <Button variant="outline" size="sm" onClick={() => acknowledgeSOS(req.id)}>
                        Acknowledge
                      </Button>
                    )}
                    <button
                      onClick={() => resolveSOS(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a]"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>

                {/* Reporter notes */}
                {req.notes && (
                  <div className="bg-white rounded-lg border border-[#e8e8e8] px-4 py-3 text-xs">
                    <p className="font-semibold text-[#0a0a0a] mb-0.5">
                      Reporter Notes ({req.reporterName}):
                    </p>
                    <p className="text-[#3a3a3a] leading-relaxed">{req.notes}</p>
                  </div>
                )}

                {/* Dispatch row */}
                <div className="pt-3 border-t border-[#f0f0f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {req.assignedStaffName ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[#16a34a]">
                      <UserCheck className="w-3.5 h-3.5" />
                      Dispatched: {req.assignedStaffName} (En Route)
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 flex-1">
                      <select
                        value={selectedStaffBySOS[req.id] || availableStaff[0]?.id || ''}
                        onChange={e => handleStaffSelect(req.id, e.target.value)}
                        className={inputCls + ' flex-1'}
                      >
                        {availableStaff.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.role} · {s.currentZoneId})
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDispatch(req.id)}
                        disabled={availableStaff.length === 0}
                        leftIcon={<Send className="w-3.5 h-3.5" />}
                      >
                        Deploy
                      </Button>
                    </div>
                  )}

                  <span className="flex items-center gap-1.5 text-xs text-[#9a9a9a]">
                    <MapPin className="w-3.5 h-3.5" />
                    Coordinates: ({req.location.x}, {req.location.y})
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Resolved archive ──────────────────────────────── */}
      {resolvedRequests.length > 0 && (
        <div className="pt-4 border-t border-[#e8e8e8]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">
            Resolved incident log ({resolvedRequests.length})
          </p>
          <div className="space-y-2">
            {resolvedRequests.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-lg border border-[#e8e8e8] px-4 py-2.5 flex items-center justify-between text-xs text-[#6b6b6b]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span className="font-medium text-[#0a0a0a]">
                    {req.type.toUpperCase()} · {req.venueName || 'Concourse'}
                  </span>
                  <span>({formatTime(req.timestamp)})</span>
                </div>
                <span>Resolved by {req.assignedStaffName || 'Command Center'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
