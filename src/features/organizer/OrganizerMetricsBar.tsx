/**
 * VenueOS — Organizer Operational KPIs & Summary Header
 */
import React from 'react';
import { useSOSStore } from '../../stores/sosStore';
import { useIssueStore } from '../../stores/issueStore';
import { useCrowdStore } from '../../stores/crowdStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { useAnnouncementStore } from '../../stores/announcementsStore';
import {
  AlertOctagon,
  AlertTriangle,
  Users,
  Radio,
  Building2,
  CheckCircle
} from 'lucide-react';

export const OrganizerMetricsBar: React.FC = () => {
  const { requests } = useSOSStore();
  const { issues } = useIssueStore();
  const { zones } = useCrowdStore();
  const { venues } = useNavigationStore();
  const { announcements } = useAnnouncementStore();

  const pendingSOS = requests.filter(r => r.status === 'pending');
  const acknowledgedSOS = requests.filter(r => r.status === 'acknowledged');
  const openIssues = issues.filter(i => i.status === 'open' || i.status === 'in_progress');

  const totalAttendees = zones.reduce((sum, z) => sum + z.currentCount, 0);
  const totalCapacity = zones.reduce((sum, z) => sum + z.maxCapacity, 0);
  const totalCheckIns = venues.reduce((sum, v) => sum + (v.checkInCount || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {/* 1. SOS Emergency Alerts */}
      <div
        className={`p-5 rounded-lg border transition-all shadow-sm ${
          pendingSOS.length > 0
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 animate-pulse'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active SOS Alerts
          </span>
          <span className={`p-2 rounded-lg ${pendingSOS.length > 0 ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            <AlertOctagon className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-2xl font-extrabold ${pendingSOS.length > 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
            {pendingSOS.length}
          </span>
          <span className="text-xs text-slate-500">
            ({acknowledgedSOS.length} in dispatch)
          </span>
        </div>
      </div>

      {/* 2. Open Facilities Issues */}
      <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Issue Tickets
          </span>
          <span className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {openIssues.length}
          </span>
          <span className="text-xs text-slate-500">tickets open</span>
        </div>
      </div>

      {/* 3. Real-Time Venue Footprint */}
      <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Venue Headcount
          </span>
          <span className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
            <Users className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalAttendees}
          </span>
          <span className="text-xs text-slate-500">
            / {totalCapacity} cap
          </span>
        </div>
      </div>

      {/* 4. Passport Foot-Traffic Check-Ins */}
      <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Passport Stamps
          </span>
          <span className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalCheckIns}
          </span>
          <span className="text-xs text-slate-500">stamps verified</span>
        </div>
      </div>

      {/* 5. Broadcast Count */}
      <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Broadcast Feed
          </span>
          <span className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400">
            <Radio className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {announcements.length}
          </span>
          <span className="text-xs text-slate-500">active alerts</span>
        </div>
      </div>
    </div>
  );
};
