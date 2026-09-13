/**
 * VenueOS — 404 Not Found Page
 */
import React from 'react';
import { MapPinOff, ArrowLeft, Map, Calendar, Users } from 'lucide-react';
import { AttendeeTab } from '../lib/navigation';

interface NotFoundPageProps {
  onGoHome: () => void;
  onNavigate?: (tab: AttendeeTab) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome, onNavigate }) => {
  const handleTabClick = (tab: AttendeeTab) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      onGoHome();
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="relative inline-block">
          <div className="w-28 h-28 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto border-2 border-indigo-100 dark:border-indigo-900">
            <MapPinOff className="w-14 h-14 text-indigo-400 dark:text-indigo-500" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
            <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">?</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            4<span className="text-indigo-600 dark:text-indigo-400">0</span>4
          </h1>
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">
            This location doesn't exist on the venue map
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            It looks like you've wandered off the grid. The page you're looking for isn't part of the event venue. Let's get you back to the main concourse.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Venue Map
          </button>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 font-medium uppercase tracking-wider">
            Quick Navigation
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {([
              { label: 'Map', icon: Map, tab: 'map' as AttendeeTab },
              { label: 'Schedule', icon: Calendar, tab: 'schedule' as AttendeeTab },
              { label: 'Crowd', icon: Users, tab: 'crowd' as AttendeeTab }
            ]).map(({ label, icon: Icon, tab }) => (
              <button
                key={label}
                onClick={() => handleTabClick(tab)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-500" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
