/**
 * VenueOS — Venue Detail Drawer & Actions
 */
import React from 'react';
import { useNavigationStore } from '../../stores/navigationStore';
import { useCrowdStore } from '../../stores/crowdStore';
import { useAttendeeStore } from '../../stores/attendeeStore';
import { useIssueStore } from '../../stores/issueStore';
import { useToastStore } from '../../stores/toastStore';
import { getVenueTypeInfo, getCrowdBadge } from '../../lib/utils';
import { speakText } from '../../lib/speech';
import { Button } from '../../components/Button';
import {
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Users,
  Sparkles,
  Layers,
  MapPin,
  Check,
  X
} from 'lucide-react';

export const VenueDetailDrawer: React.FC = () => {
  const { venues, selectedVenueId, selectVenue, routeToVenue } = useNavigationStore();
  const { zones } = useCrowdStore();
  const { profile, checkInVenue } = useAttendeeStore();
  const { openReportModal } = useIssueStore();
  const { addToast } = useToastStore();

  const venue = venues.find(v => v.id === selectedVenueId);
  if (!venue) return null;

  const zone = zones.find(z => z.id === venue.zoneId);
  const isCheckedIn = profile.checkedInVenueIds.includes(venue.id);
  const typeInfo = getVenueTypeInfo(venue.type);

  const handleCheckIn = () => {
    checkInVenue(venue.id);
    addToast(`Stamped & checked in at ${venue.name}!`, 'success');
  };

  const handleSpeakDetails = () => {
    speakText(
      `${venue.name}. Located in ${zone?.name || 'the venue'}. Floor ${
        venue.floor || 1
      }. ${venue.description}. ${
        venue.features ? `Accessibility features include: ${venue.features.join(', ')}` : ''
      }`
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      {/* Category & Status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${typeInfo.badgeBg}`}>
            {typeInfo.label}
          </span>
          {zone && (
            <span className={`text-xs font-medium px-3 py-1 rounded-lg border ${getCrowdBadge(zone.crowdLevel).bg} ${getCrowdBadge(zone.crowdLevel).text} ${getCrowdBadge(zone.crowdLevel).border}`}>
              {zone.name} • {zone.crowdLevel.toUpperCase()}
            </span>
          )}
        </div>
        <button
          onClick={() => selectVenue(null)}
          className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
          aria-label="Close venue details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-snug">
          {venue.name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          {venue.description}
        </p>
      </div>

      {/* Meta Specs */}
      <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-200 dark:border-slate-700 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Floor</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Floor {venue.floor || 1}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Capacity</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{venue.capacity || 'Open Space'}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block text-xs mb-1">Check-ins</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{venue.checkInCount || 0}</span>
        </div>
      </div>

      {/* Accessibility Features */}
      {venue.features && venue.features.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Accessibility & Facilities
          </div>
          <div className="flex flex-wrap gap-2">
            {venue.features.map((feat, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <Button
          variant="primary"
          onClick={() => routeToVenue(venue.id)}
          leftIcon={<Navigation className="w-4 h-4" />}
          fullWidth
        >
          Navigate
        </Button>

        <Button
          variant={isCheckedIn ? 'secondary' : 'outline'}
          onClick={handleCheckIn}
          leftIcon={isCheckedIn ? <Check className="w-4 h-4 text-emerald-600" /> : <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
          fullWidth
          disabled={isCheckedIn}
        >
          {isCheckedIn ? 'Checked In' : 'Check In'}
        </Button>
      </div>

      {/* Secondary Actions: Report Issue & Voice Aloud */}
      <div className="flex items-center justify-between pt-2 text-xs gap-2">
        <button
          onClick={() => openReportModal(venue)}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium flex items-center gap-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded px-2 py-1 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Report issue</span>
        </button>

        <button
          onClick={handleSpeakDetails}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-medium flex items-center gap-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1 transition-colors"
          title="Read venue information aloud"
        >
          <Volume2 className="w-3.5 h-3.5 shrink-0" />
          <span>Listen</span>
        </button>
      </div>
    </div>
  );
};
