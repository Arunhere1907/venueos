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
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-indigo-200 dark:border-indigo-900/50 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-lg shadow-sm">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Active Wayfinding
            </span>
            <h4 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5">
              To: {targetVenue.name}
            </h4>
          </div>
        </div>

        <button
          onClick={clearRoute}
          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
          title="Cancel navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-200 dark:border-slate-700 text-center">
        <div className="px-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5" /> Time
          </div>
          <div className="text-base font-semibold text-slate-900 dark:text-white">
            ~{activeRoute.estimatedMinutes} min
          </div>
        </div>

        <div className="px-2 border-x border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-1">
            <Footprints className="w-3.5 h-3.5" /> Distance
          </div>
          <div className="text-base font-semibold text-slate-900 dark:text-white">
            {activeRoute.distanceMeters} m
          </div>
        </div>

        <div className="px-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mb-1">
            <Accessibility className="w-3.5 h-3.5" /> Access
          </div>
          <div className={`text-base font-semibold ${activeRoute.isStepFree ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
            {activeRoute.isStepFree ? 'Step-Free' : 'Standard'}
          </div>
        </div>
      </div>

      {/* Crowd Warning (if destination zone is high) */}
      {isTargetHighCrowd && (
        <div className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-lg text-xs text-rose-800 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div>
            <span className="font-semibold">High Crowd Density in {targetZone?.name}:</span>
            {' '}Walkways near this destination are congested. Expect slight delays.
          </div>
        </div>
      )}

      {/* Route Notes */}
      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
        {activeRoute.notes.map((note, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
            <span>{note}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
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
