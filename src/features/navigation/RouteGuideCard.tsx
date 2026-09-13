/**
 * VenueOS — Active Wayfinding Route Guide Card
 */
import React from 'react';
import { useNavigationStore } from '../../stores/navigationStore';
import { useCrowdStore } from '../../stores/crowdStore';
import { speakText } from '../../lib/speech';
import {
  Navigation,
  Clock,
  Footprints,
  Accessibility,
  Volume2,
  X,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/Button';

export const RouteGuideCard: React.FC = () => {
  const { activeRoute, clearRoute, venues, selectedVenueId } = useNavigationStore();
  const { zones } = useCrowdStore();

  if (!activeRoute || !selectedVenueId) return null;

  const targetVenue = venues.find(v => v.id === selectedVenueId);
  if (!targetVenue) return null;

  const targetZone = zones.find(z => z.id === targetVenue.zoneId);
  const isTargetHighCrowd = targetZone?.crowdLevel === 'high';

  const handleReadDirections = () => {
    const text = `Navigating to ${targetVenue.name}. Distance is ${activeRoute.distanceMeters} meters, approximately ${activeRoute.estimatedMinutes} minute walk. ${
      activeRoute.isStepFree
        ? 'Following step-free accessible concourse via elevators and ramps.'
        : 'Following main concourse walkway.'
    } ${activeRoute.notes.join('. ')}`;
    speakText(text);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-500/30 p-4 sm:p-5 shadow-lg space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Active Wayfinding
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              To: {targetVenue.name}
            </h4>
          </div>
        </div>

        <button
          onClick={clearRoute}
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Cancel navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800 text-center">
        <div className="px-2">
          <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Time
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            ~{activeRoute.estimatedMinutes} min
          </div>
        </div>

        <div className="px-2 border-x border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Footprints className="w-3.5 h-3.5" /> Distance
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {activeRoute.distanceMeters} m
          </div>
        </div>

        <div className="px-2">
          <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Accessibility className="w-3.5 h-3.5" /> Access
          </div>
          <div className={`text-base font-bold ${activeRoute.isStepFree ? 'text-emerald-600' : 'text-slate-700'}`}>
            {activeRoute.isStepFree ? 'Step-Free' : 'Standard'}
          </div>
        </div>
      </div>

      {/* Crowd Warning (if destination zone is high) */}
      {isTargetHighCrowd && (
        <div className="flex items-start gap-2.5 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <span className="font-semibold">High Crowd Density in {targetZone?.name}:</span>
            {' '}Walkways near this destination are congested. Expect slight delays.
          </div>
        </div>
      )}

      {/* Route Notes */}
      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
        {activeRoute.notes.map((note, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
            <span>{note}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleReadDirections}
          leftIcon={<Volume2 className="w-4 h-4" />}
          className="flex-1"
        >
          Read Directions
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearRoute}
          className="flex-1"
        >
          End Route
        </Button>
      </div>
    </div>
  );
};
