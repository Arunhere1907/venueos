/**
 * VenueOS — Organizer Intelligence & Analytics Charts
 */
import React from 'react';
import { useCrowdStore } from '../../stores/crowdStore';
import { useScheduleStore } from '../../stores/scheduleStore';
import { useSOSStore } from '../../stores/sosStore';
import { useNavigationStore } from '../../stores/navigationStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, Award } from 'lucide-react';

export const OrganizerAnalytics: React.FC = () => {
  const { zones } = useCrowdStore();
  const { sessions } = useScheduleStore();
  const { requests } = useSOSStore();
  const { venues } = useNavigationStore();

  // Zone Capacity Data
  const zoneCapacityData = zones.map(z => ({
    name: z.name.replace(' Quadrant', '').replace('Hall', ''),
    current: z.currentCount,
    max: z.maxCapacity
  }));

  // Session Popularity Data
  const sessionPopularityData = [...sessions]
    .sort((a, b) => ((b.favoritesCount || (b.isPopular ? 142 : 38)) - (a.favoritesCount || (a.isPopular ? 142 : 38))))
    .slice(0, 5)
    .map(s => ({
      name: s.title.length > 20 ? s.title.slice(0, 18) + '...' : s.title,
      bookmarks: s.favoritesCount || (s.isPopular ? 142 : 38),
      room: s.roomName
    }));

  // SOS Incidents Breakdown
  const medicalCount = requests.filter(r => r.type === 'medical').length;
  const securityCount = requests.filter(r => r.type === 'security').length;
  const generalCount = requests.filter(r => r.type === 'general').length;

  const sosDistributionData = [
    { name: 'Medical', value: Math.max(1, medicalCount), color: '#ef4444' },
    { name: 'Security', value: Math.max(1, securityCount), color: '#6366f1' },
    { name: 'General/Help', value: Math.max(1, generalCount), color: '#f59e0b' }
  ];

  // Venue Passport Stamp Foot-Traffic
  const venueTrafficData = [...venues]
    .sort((a, b) => (b.checkInCount || 0) - (a.checkInCount || 0))
    .slice(0, 6)
    .map(v => ({
      name: v.name.length > 18 ? v.name.slice(0, 16) + '...' : v.name,
      checkIns: v.checkInCount || 0
    }));

  /* shared chart tooltip style */
  const tooltipStyle = { borderRadius: '8px', fontSize: '12px', border: '1px solid #e8e8e8', color: '#0a0a0a' };
  const gridColor = '#f0f0f0';
  const tickStyle = { fontSize: 11, fill: '#6b6b6b' };

  const ChartCard = ({ eyebrow, title, icon, children }: {
    eyebrow: string; title: string; icon: React.ReactNode; children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-xl border border-[#e8e8e8] p-5 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b6b6b]">{eyebrow}</p>
          <h4 className="text-sm font-semibold text-[#0a0a0a] mt-0.5">{title}</h4>
        </div>
        <div className="text-[#9a9a9a] shrink-0">{icon}</div>
      </div>
      <div className="h-56 w-full">{children}</div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-[#e8e8e8] p-5">
        <h3 className="text-base font-semibold text-[#0a0a0a]">Summit Telemetry &amp; Analytics</h3>
        <p className="text-xs text-[#6b6b6b] mt-0.5">
          Zone density, session interest, incident categories, and passport foot-traffic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard eyebrow="Foot-Traffic" title="Zone Occupancy vs. Capacity" icon={<BarChart3 className="w-4 h-4" />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zoneCapacityData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" tick={tickStyle} />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="current" fill="#4f46e5" name="Current" radius={[4, 4, 0, 0]} />
              <Bar dataKey="max"     fill="#e8e8e8" name="Capacity" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard eyebrow="Schedule Demand" title="Top Bookmarked Sessions" icon={<TrendingUp className="w-4 h-4" />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sessionPopularityData} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
              <XAxis type="number" tick={tickStyle} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: '#6b6b6b' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="bookmarks" fill="#16a34a" name="Bookmarks" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard eyebrow="Safety & Security" title="SOS Reports by Category" icon={<PieIcon className="w-4 h-4" />}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={sosDistributionData} cx="50%" cy="45%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {sosDistributionData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="bottom" height={32} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard eyebrow="Exhibition Footfall" title="Venue Passport Stamp Count" icon={<Award className="w-4 h-4" />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={venueTrafficData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b6b6b' }} />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="checkIns" fill="#b45309" name="Stamps" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
