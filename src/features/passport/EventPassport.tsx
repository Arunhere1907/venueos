/**
 * VenueOS — Event Passport & Check-In Explorer
 */
import React from 'react';
import { useAttendeeStore } from '../../stores/attendeeStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { useToastStore } from '../../stores/toastStore';
import { Button } from '../../components/Button';
import {
  Award,
  CheckCircle2,
  Trophy,
  MapPin,
  Sparkles,
  Compass,
  Star,
  QrCode
} from 'lucide-react';

export const EventPassport: React.FC = () => {
  const { profile, checkInVenue } = useAttendeeStore();
  const { venues, selectVenue } = useNavigationStore();
  const { addToast } = useToastStore();

  const totalVenues = venues.length;
  const checkedInCount = profile.checkedInVenueIds.length;
  const completionPercent = Math.min(100, Math.round((checkedInCount / totalVenues) * 100));

  const handleStamp = (venueId: string, venueName: string) => {
    checkInVenue(venueId);
    const newCount = checkedInCount + 1;
    if (newCount === 1) {
      addToast(`🎉 Unlocked Badge: "First Step Explorer"!`, 'success', 4500);
    } else if (newCount === 3) {
      addToast(`🎉 Unlocked Badge: "Tech Scout"!`, 'success', 4500);
    } else if (newCount === 5) {
      addToast(`🎉 Unlocked Badge: "Venue Navigator"!`, 'success', 4500);
    } else if (newCount === 8) {
      addToast(`🏆 Unlocked Badge: "Summit Completionist"!`, 'success', 5000);
    } else {
      addToast(`Stamped "${venueName}" into your passport!`, 'success');
    }
  };

  // Badges calculation
  const badges = [
    {
      id: 'badge-1',
      title: 'First Step Explorer',
      description: 'Check in to at least 1 summit venue.',
      unlocked: checkedInCount >= 1,
      icon: Compass,
      color: 'text-sky-500 bg-sky-50 border-sky-200'
    },
    {
      id: 'badge-2',
      title: 'Tech Scout',
      description: 'Visit 3 interactive booths or stages.',
      unlocked: checkedInCount >= 3,
      icon: Sparkles,
      color: 'text-indigo-500 bg-indigo-50 border-indigo-200'
    },
    {
      id: 'badge-3',
      title: 'Venue Navigator',
      description: 'Explore 5 diverse quadrants and lounges.',
      unlocked: checkedInCount >= 5,
      icon: Award,
      color: 'text-amber-500 bg-amber-50 border-amber-200'
    },
    {
      id: 'badge-4',
      title: 'Summit Completionist',
      description: 'Visit 8+ exhibition zones.',
      unlocked: checkedInCount >= 8,
      icon: Trophy,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Passport Header & Progress */}
      <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Award className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-400">
                Official Event Passport
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {profile.name}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-indigo-200">Attendee ID</span>
            <div className="font-mono text-sm font-bold text-indigo-300">
              {profile.buddyCode || 'VOS-7821'}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-200">Venue Exploration Progress</span>
            <span className="font-bold text-white">
              {checkedInCount} of {totalVenues} Locations ({completionPercent}%)
            </span>
          </div>

          <div className="w-full h-3.5 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-linear-to-r from-indigo-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          Achievement Badges
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  b.unlocked
                    ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2 border ${
                    b.unlocked ? b.color : 'bg-slate-200 text-slate-400 border-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {b.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                  {b.description}
                </p>
                <span
                  className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    b.unlocked
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {b.unlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Check-In Checklist */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <QrCode className="w-4 h-4 text-indigo-500" />
          Summit Passport Stamps
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {venues.map((venue) => {
            const isDone = profile.checkedInVenueIds.includes(venue.id);

            return (
              <div
                key={venue.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  isDone
                    ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <MapPin className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {venue.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Floor {venue.floor || 1} • {venue.type}
                    </span>
                  </div>
                </div>

                {isDone ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                    Stamped ✓
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStamp(venue.id, venue.name)}
                    className="text-xs shrink-0"
                  >
                    Stamp
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
