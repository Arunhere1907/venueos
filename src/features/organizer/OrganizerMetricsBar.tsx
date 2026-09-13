/**
 * VenueOS — Minimal Organizer KPI Metrics Bar
 */
import React from 'react';
import { useSOSStore } from '../../stores/sosStore';
import { useIssueStore } from '../../stores/issueStore';
import { useCrowdStore } from '../../stores/crowdStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { useAnnouncementStore } from '../../stores/announcementsStore';
import { AlertOctagon, AlertTriangle, Users, Radio, CheckCircle } from 'lucide-react';

interface MetricProps {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
  alert?: boolean;
}

const Metric: React.FC<MetricProps> = ({ label, value, sub, icon, iconBg, alert }) => (
  <div className={`bg-white rounded-xl border p-4 ${alert ? 'border-[#fecaca]' : 'border-[#e8e8e8]'}`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6b6b6b]">{label}</span>
      <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className={`text-2xl font-bold ${alert ? 'text-[#dc2626]' : 'text-[#0a0a0a]'}`}>{value}</span>
      {sub && <span className="text-xs text-[#9a9a9a]">{sub}</span>}
    </div>
  </div>
);

export const OrganizerMetricsBar: React.FC = () => {
  const { requests }     = useSOSStore();
  const { issues }       = useIssueStore();
  const { zones }        = useCrowdStore();
  const { venues }       = useNavigationStore();
  const { announcements } = useAnnouncementStore();

  const pendingSOS      = requests.filter(r => r.status === 'pending');
  const acknowledgedSOS = requests.filter(r => r.status === 'acknowledged');
  const openIssues      = issues.filter(i => i.status === 'open' || i.status === 'in_progress');
  const totalAttendees  = zones.reduce((s, z) => s + z.currentCount, 0);
  const totalCapacity   = zones.reduce((s, z) => s + z.maxCapacity, 0);
  const totalCheckIns   = venues.reduce((s, v) => s + (v.checkInCount || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <Metric
        label="Active SOS"
        value={pendingSOS.length}
        sub={`(${acknowledgedSOS.length} dispatched)`}
        icon={<AlertOctagon className="w-4 h-4 text-[#dc2626]" />}
        iconBg="bg-[#fff5f5]"
        alert={pendingSOS.length > 0}
      />
      <Metric
        label="Issue Tickets"
        value={openIssues.length}
        sub="open"
        icon={<AlertTriangle className="w-4 h-4 text-[#b45309]" />}
        iconBg="bg-[#fffbeb]"
      />
      <Metric
        label="Venue Headcount"
        value={totalAttendees}
        sub={`/ ${totalCapacity}`}
        icon={<Users className="w-4 h-4 text-[#4f46e5]" />}
        iconBg="bg-[#f0f0ff]"
      />
      <Metric
        label="Passport Stamps"
        value={totalCheckIns}
        sub="verified"
        icon={<CheckCircle className="w-4 h-4 text-[#16a34a]" />}
        iconBg="bg-[#f0faf4]"
      />
      <div className="col-span-2 lg:col-span-1">
        <Metric
          label="Broadcast Feed"
          value={announcements.length}
          sub="alerts"
          icon={<Radio className="w-4 h-4 text-[#0369a1]" />}
          iconBg="bg-[#f0f9ff]"
        />
      </div>
    </div>
  );
};
