/**
 * VenueOS — Organizer Live SOS & Staff Dispatch Center
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
  Clock,
  UserCheck,
  MapPin,
  Send,
  Zap,
  Phone,
  Radio
} from 'lucide-react';

export const LiveSOSDispatchPanel: React.FC = () => {
  const { requests, staff, acknowledgeSOS, resolveSOS, dispatchStaffToSOS } = useSOSStore();
  const [selectedStaffBySOS, setSelectedStaffBySOS] = useState<Record<string, string>>({});

  const pendingRequests = requests.filter(r => r.status !== 'resolved');
  const resolvedRequests = requests.filter(r => r.status === 'resolved');

  const availableStaff = staff.filter(s => s.status === 'available');

  const handleStaffSelect = (sosId: string, staffId: string) => {
    setSelectedStaffBySOS(prev => ({ ...prev, [sosId]: staffId }));
  };

  const handleDispatch = (sosId: string) => {
    const chosenStaffId = selectedStaffBySOS[sosId] || availableStaff[0]?.id;
    if (chosenStaffId) {
      dispatchStaffToSOS(sosId, chosenStaffId);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Emergency Command Center
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Live SOS Triage & Tactical Staff Dispatch
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor incoming SOS requests from attendees and deploy the closest certified medical or security personnel.
          </p>
        </div>

        {/* Demo SOS trigger */}
        <Button
          variant="danger"
          size="sm"
          onClick={() => mockRealtimeService.triggerSimulatedSOS()}
          leftIcon={<Zap className="w-4 h-4" />}
          className="shrink-0 shadow-md"
          title="Simulate an emergency alert to demonstrate the full responder workflow"
        >
          Simulate Test SOS
        </Button>
      </div>

      {/* Staff Roster Snapshot */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-2">
          On-Duty Staff Roster ({availableStaff.length} Available / {staff.length} Total)
        </span>
        <div className="flex flex-wrap gap-2">
          {staff.map(member => (
            <div
              key={member.id}
              className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
                member.status === 'available'
                  ? 'bg-white dark:bg-slate-900 border-emerald-300 text-slate-800 dark:text-slate-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-800 dark:text-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  member.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="font-semibold">{member.name}</span>
              <span className="text-[10px] text-slate-400 uppercase">
                ({member.role} • {member.status})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active SOS Request Cards */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-600" />
          Active Requests Requiring Action ({pendingRequests.length})
        </h4>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Active Emergencies
            </h4>
            <p className="text-xs text-slate-500">
              All venue sectors are green and clear. Emergency response teams standing by.
            </p>
          </div>
        ) : (
          pendingRequests.map(req => {
            const isPending = req.status === 'pending';
            const assignedStaff = staff.find(s => s.id === req.assignedStaffId);

            return (
              <div
                key={req.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isPending
                    ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900 shadow-md ring-1 ring-rose-400/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                } space-y-3`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`p-3 rounded-xl text-white ${
                        req.type === 'medical'
                          ? 'bg-rose-600'
                          : req.type === 'security'
                          ? 'bg-indigo-600'
                          : 'bg-amber-600'
                      }`}
                    >
                      {req.type === 'medical' ? (
                        <HeartPulse className="w-5 h-5" />
                      ) : req.type === 'security' ? (
                        <Shield className="w-5 h-5" />
                      ) : (
                        <HelpCircle className="w-5 h-5" />
                      )}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                          {req.type} Emergency
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          {formatTime(req.timestamp)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPending
                              ? 'bg-rose-100 text-rose-800 animate-pulse'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {req.status.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {req.venueName || 'Concourse Corridor'}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => acknowledgeSOS(req.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => resolveSOS(req.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 border-emerald-500/20"
                    >
                      Mark Resolved
                    </Button>
                  </div>
                </div>

                {/* Reporter notes */}
                {req.notes && (
                  <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                      Reporter Notes ({req.reporterName}):
                    </span>
                    {req.notes}
                  </div>
                )}

                {/* Staff Dispatch Section */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  {req.assignedStaffName ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <UserCheck className="w-4 h-4" />
                      <span>Dispatched: {req.assignedStaffName} (En Route)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1">
                      <select
                        value={selectedStaffBySOS[req.id] || availableStaff[0]?.id || ''}
                        onChange={(e) => handleStaffSelect(req.id, e.target.value)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                      >
                        {availableStaff.map(s => (
                          <option key={s.id} value={s.id}>
                            Assign: {s.name} ({s.role} in {s.currentZoneId})
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
                        Deploy Staff
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Coordinates: ({req.location.x}, {req.location.y})</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolved Request Archive */}
      {resolvedRequests.length > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Resolved Incident Log ({resolvedRequests.length})
          </span>
          <div className="space-y-2">
            {resolvedRequests.map(req => (
              <div
                key={req.id}
                className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between opacity-70"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {req.type.toUpperCase()} • {req.venueName || 'Concourse'}
                  </span>
                  <span className="text-slate-400">({formatTime(req.timestamp)})</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Resolved by {req.assignedStaffName || 'Command Center'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
