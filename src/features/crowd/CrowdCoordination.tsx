/**
 * VenueOS — Crowd Coordination & Surge Prediction View
 */
import React from 'react';
import { useCrowdStore } from '../../stores/crowdStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { mockRealtimeService } from '../../services/mockRealtimeService';
import { getCrowdBadge } from '../../lib/utils';
import { Button } from '../../components/Button';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Compass,
  Zap,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';

interface CrowdCoordinationProps {
  onNavigateToVenue?: (venueId: string) => void;
}

export const CrowdCoordination: React.FC<CrowdCoordinationProps> = ({ onNavigateToVenue }) => {
  const { zones, getAlternateLowCrowdZone } = useCrowdStore();
  const { venues, selectVenue } = useNavigationStore();

  const handleSuggestAlt = (currentZoneId: string) => {
    const altZone = getAlternateLowCrowdZone(currentZoneId);
    if (!altZone) return;
    // Pick first venue in this alternate zone
    const venueInZone = venues.find(v => v.zoneId === altZone.id);
    if (venueInZone) {
      selectVenue(venueInZone.id);
      if (onNavigateToVenue) {
        onNavigateToVenue(venueInZone.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Live Status Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Live Foot-Traffic Intelligence
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            Zone Capacity & Crowd Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Real-time sensory telemetry tracking crowd density across all 4 quadrants with predictive surge modeling and automated load-balancing pathways.
          </p>
        </div>

        {/* Evaluation quick test button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => mockRealtimeService.triggerCrowdSurge()}
          leftIcon={<Zap className="w-4 h-4 text-amber-500" />}
          className="shrink-0"
          title="Simulate a crowd surge in East Expo Hall to test predictive alerts"
        >
          Simulate Surge Spike
        </Button>
      </div>

      {/* Grid of 4 Quadrant Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {zones.map((zone) => {
          const badge = getCrowdBadge(zone.crowdLevel);
          const percent = Math.min(100, Math.round((zone.currentCount / zone.maxCapacity) * 100));
          const isHigh = zone.crowdLevel === 'high';
          const isRising = zone.trend === 'rising';
          const venuesInZone = venues.filter(v => v.zoneId === zone.id);

          return (
            <div
              key={zone.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border transition-all ${
                zone.predictedSurge
                  ? 'border-rose-400 dark:border-rose-800 shadow-md ring-1 ring-rose-400/20'
                  : 'border-slate-200 dark:border-slate-800'
              } space-y-4`}
            >
              {/* Zone Top Bar */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {zone.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{zone.description}</p>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border} shrink-0`}
                >
                  <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                  {badge.label}
                </span>
              </div>

              {/* Progress & Occupancy Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Occupancy</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {zone.currentCount} / {zone.maxCapacity} people ({percent}%)
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      percent > 85
                        ? 'bg-rose-500'
                        : percent > 55
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Trend & Predictive Surge Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                  {isRising ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-rose-500" />
                      <span className="text-rose-600 dark:text-rose-400 font-bold">Rising Foot-Traffic</span>
                    </>
                  ) : zone.trend === 'falling' ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Decreasing</span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-4 h-4 text-slate-400" />
                      <span>Steady Density</span>
                    </>
                  )}
                </div>

                {zone.predictedSurge && (
                  <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-xl font-bold border border-rose-200">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Surge Warning
                  </span>
                )}
              </div>

              {/* High Crowd Alternate Zone Re-routing Advice */}
              {isHigh && (
                <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Avoid Congestion — Recommended Alternate:</span>
                  </div>
                  <p className="text-amber-800/90 dark:text-amber-300">
                    South Promenade & Dining Plaza currently has abundant seating and open walking lanes.
                  </p>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleSuggestAlt(zone.id)}
                    leftIcon={<Compass className="w-3.5 h-3.5" />}
                    className="w-full text-xs"
                  >
                    Reroute to Low-Crowd Zone
                  </Button>
                </div>
              )}

              {/* Key Venues in this Zone */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Venues in this quadrant:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {venuesInZone.map(v => (
                    <button
                      key={v.id}
                      onClick={() => {
                        selectVenue(v.id);
                        if (onNavigateToVenue) onNavigateToVenue(v.id);
                      }}
                      className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
