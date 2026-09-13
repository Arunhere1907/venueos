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

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Summit Telemetry & Real-Time Analytics
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Operational telemetry cross-referencing zone density, attendee session interest, incident categories, and passport stamp foot-traffic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Zone Capacity vs Occupancy */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                Foot-Traffic
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Zone Occupancy vs. Maximum Threshold
              </h4>
            </div>
            <BarChart3 className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneCapacityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #cbd5e1' }}
                />
                <Bar dataKey="current" fill="#6366f1" name="Current Count" radius={[4, 4, 0, 0]} />
                <Bar dataKey="max" fill="#cbd5e1" name="Max Capacity" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Session Bookmarks */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Schedule Demand
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Top Bookmarked Sessions (Attendee Interest)
              </h4>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sessionPopularityData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #cbd5e1' }}
                />
                <Bar dataKey="bookmarks" fill="#10b981" name="Attendee Bookmarks" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: SOS Incident Categories */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                Safety & Security
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Emergency SOS Reports by Category
              </h4>
            </div>
            <PieIcon className="w-5 h-5 text-rose-500" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sosDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sosDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #cbd5e1' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Passport Foot-Traffic Check-Ins */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                Exhibition Footfall
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Venue Passport Stamp Count
              </h4>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={venueTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #cbd5e1' }}
                />
                <Bar dataKey="checkIns" fill="#f59e0b" name="Passport Stamps" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
