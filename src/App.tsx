/**
 * VenueOS — Smart Event Experience Platform
 * Accessible venue wayfinding, session discovery, real-time crowd coordination,
 * emergency SOS response, and organizer operations.
 */
import { useState, useEffect, lazy, Suspense } from 'react';
import { useAuthStore } from './stores/authStore';
import { useNavigationStore } from './stores/navigationStore';
import { useSOSStore } from './stores/sosStore';
import { useAttendeeStore } from './stores/attendeeStore';
import { mockRealtimeService } from './services/mockRealtimeService';
import {
  AttendeeTab,
  goHome,
  parseHash,
  syncHash
} from './lib/navigation';

// UI Components
import { ToastBanner } from './components/ToastBanner';
import { ToastNotification } from './components/ToastNotification';
import { NotFoundPage } from './features/NotFoundPage';

// Feature Modules - Attendee (eagerly loaded for main experience)
import { VenueMap } from './features/navigation/VenueMap';
import { MapSearch } from './features/navigation/MapSearch';
import { RouteGuideCard } from './features/navigation/RouteGuideCard';
import { VenueDetailDrawer } from './features/navigation/VenueDetailDrawer';
import { ScheduleDiscovery } from './features/schedule/ScheduleDiscovery';
import { LivePollCard } from './features/schedule/LivePollCard';
import { CrowdCoordination } from './features/crowd/CrowdCoordination';
import { AnnouncementsFeed } from './features/announcements/AnnouncementsFeed';
import { EventPassport } from './features/passport/EventPassport';
import { AccessibilityBar } from './features/accessibility/AccessibilityBar';
import { AIConciergeChat } from './features/concierge/AIConciergeChat';
import { SOSModal, SOSButton } from './features/sos/SOSModal';
import { IssueReportModal } from './features/issues/IssueReportModal';
import { BuddyFinderModal } from './features/buddy/BuddyFinderModal';

// Feature Modules - Organizer (lazy loaded to reduce initial bundle)
const OrganizerDashboard = lazy(() => 
  import('./features/organizer/OrganizerDashboard').then(module => ({
    default: module.OrganizerDashboard
  }))
);

// Icons
import {
  MapPin,
  Calendar,
  Users,
  Radio,
  Award,
  Shield,
  User,
  Compass,
  Share2
} from 'lucide-react';

export default function App() {
  const { role, setRole } = useAuthStore();
  const { profile } = useAttendeeStore();
  const { requests } = useSOSStore();
  const { activeRoute } = useNavigationStore();

  const [attendeeTab, setAttendeeTab] = useState<AttendeeTab>('map');
  const [buddyModalOpen, setBuddyModalOpen] = useState<boolean>(false);
  const [is404, setIs404] = useState<boolean>(false);

  const navigateAttendee = (tab: AttendeeTab) => {
    setIs404(false);
    setRole('attendee');
    setAttendeeTab(tab);
    syncHash('attendee', tab);
  };

  const navigateOrganizer = () => {
    setIs404(false);
    setRole('organizer');
    syncHash('organizer');
  };

  // Hash-based route listener with 404 detection
  useEffect(() => {
    const handleHash = () => {
      const parsed = parseHash(window.location.hash);

      if (parsed.is404) {
        setIs404(true);
        return;
      }

      setIs404(false);
      if (parsed.role) setRole(parsed.role);
      if (parsed.tab) setAttendeeTab(parsed.tab);
    };

    handleHash();
    if (!window.location.hash || window.location.hash === '#') {
      syncHash('attendee', 'map');
    }
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setRole]);

  // Start the background simulated events (crowd movement, polls, announcements)
  useEffect(() => {
    mockRealtimeService.start();
    return () => {
      mockRealtimeService.stop();
    };
  }, []);

  const pendingSOSCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div
      className={`min-h-screen overflow-x-hidden flex flex-col justify-between transition-colors duration-200 ${
        profile.accessibilityMode
          ? 'bg-slate-950 text-slate-100 dark contrast-more:contrast-125'
          : 'bg-slate-50/70 text-slate-900'
      }`}
    >
      {/* Real-time High Severity Toast Banner */}
      <ToastBanner />

      {/* Primary Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Venue<span className="text-indigo-600 dark:text-indigo-400">OS</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 leading-none font-medium tracking-wide">
                Smart Event & Accessible Wayfinding
              </span>
            </div>
          </div>

          {/* Attendee Tabs (Only shown in Attendee mode on md+ screens) */}
          {role === 'attendee' && (
            <nav 
              className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl backdrop-blur-sm"
              role="navigation"
              aria-label="Main navigation"
            >
              {[
                { id: 'map', label: 'Wayfinding', icon: MapPin },
                { id: 'schedule', label: 'Schedule', icon: Calendar },
                { id: 'crowd', label: 'Crowd Intel', icon: Users },
                { id: 'announcements', label: 'Alerts', icon: Radio },
                { id: 'passport', label: 'Passport', icon: Award }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => navigateAttendee(id as AttendeeTab)}
                  aria-current={attendeeTab === id ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    attendeeTab === id
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-900'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Buddy Finder quick button (Attendee only) */}
            {role === 'attendee' && (
              <button
                onClick={() => setBuddyModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors"
                title="Share venue position with a friend"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{profile.connectedBuddy ? 'Buddy Active' : 'Buddy'}</span>
              </button>
            )}

            {/* Role Switcher Pill (Attendee vs Organizer) */}
            <div className="bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <button
                onClick={() => navigateAttendee(attendeeTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  role === 'attendee'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-900'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Attendee</span>
              </button>

              <button
                onClick={() => navigateOrganizer()}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 relative ${
                  role === 'organizer'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-900'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Organizer</span>
                {pendingSOSCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50 animate-pulse absolute -top-0.5 -right-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar for Attendee Mode */}
        {role === 'attendee' && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 py-2 flex items-center justify-around overflow-x-auto scrollbar-none">
            {[
              { id: 'map', label: 'Map', icon: MapPin },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'crowd', label: 'Crowd', icon: Users },
              { id: 'announcements', label: 'Alerts', icon: Radio },
              { id: 'passport', label: 'Passport', icon: Award }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => navigateAttendee(id as AttendeeTab)}
                aria-current={attendeeTab === id ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl text-[10px] font-bold transition-all min-w-[64px] ${
                  attendeeTab === id
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main App Container */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        {is404 ? (
          <NotFoundPage
            onGoHome={() => goHome()}
            onNavigate={(tab) => navigateAttendee(tab)}
          />
        ) : (
          <>
            {/* Attendee Experience */}
            {role === 'attendee' && (
              <div className="space-y-6">
                {/* Global Accessibility Bar */}
                <AccessibilityBar />

                {/* View: Map & Interactive Wayfinding */}
                {attendeeTab === 'map' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Controls & Search (4 columns on lg) */}
                    <div className="lg:col-span-4 space-y-4">
                      <MapSearch />
                      <VenueDetailDrawer />
                      {Boolean(activeRoute) && <RouteGuideCard />}
                      <LivePollCard />
                    </div>

                    {/* Right Interactive Map Canvas (8 columns on lg) */}
                    <div className="lg:col-span-8 space-y-4">
                      <VenueMap />
                    </div>
                  </div>
                )}

                {/* View: Schedule Discovery */}
                {attendeeTab === 'schedule' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8">
                      <ScheduleDiscovery onNavigateToVenue={() => navigateAttendee('map')} />
                    </div>
                    <div className="lg:col-span-4 space-y-4">
                      <LivePollCard />
                    </div>
                  </div>
                )}

                {/* View: Crowd Intelligence */}
                {attendeeTab === 'crowd' && (
                  <CrowdCoordination onNavigateToVenue={() => navigateAttendee('map')} />
                )}

                {/* View: Announcements & Live Updates */}
                {attendeeTab === 'announcements' && <AnnouncementsFeed />}

                {/* View: Event Passport Stamps */}
                {attendeeTab === 'passport' && <EventPassport />}
              </div>
            )}

            {/* Organizer Command Center */}
            {role === 'organizer' && (
              <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-slate-500">Loading Organizer Dashboard...</p>
                  </div>
                </div>
              }>
                <OrganizerDashboard />
              </Suspense>
            )}
          </>
        )}
      </main>

      {/* Global Application Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Venue<span className="text-indigo-600 dark:text-indigo-400">OS</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                Smart Event Experience & Universal Wayfinding platform. Providing step-free routes, live crowd telemetry, session discovery, and emergency operations dispatch.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Event Navigation
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <li>
                  <button onClick={() => navigateAttendee('map')} className="hover:text-indigo-600 transition-colors">
                    Interactive Venue Map
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateAttendee('schedule')} className="hover:text-indigo-600 transition-colors">
                    Schedule & Live Polls
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateAttendee('crowd')} className="hover:text-indigo-600 transition-colors">
                    Crowd Density Telemetry
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateAttendee('passport')} className="hover:text-indigo-600 transition-colors">
                    Summit Passport & Stamps
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Safety & Accessibility
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>ADA Step-Free Accessible</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>24/7 Rapid SOS Dispatch</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Assistive Speech Synthesis</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} VenueOS. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Operations Active
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Drawers & Modals */}
      <SOSModal />
      <IssueReportModal />
      <BuddyFinderModal
        isOpen={buddyModalOpen}
        onClose={() => setBuddyModalOpen(false)}
      />

      {/* Global Toast Notification Stack */}
      <ToastNotification />

      {/* Persistent Floating Emergency SOS Button & AI Concierge (Attendee view only) */}
      {role === 'attendee' && !is404 && (
        <>
          <AIConciergeChat onNavigateToVenue={() => navigateAttendee('map')} />
          <SOSButton />
        </>
      )}
    </div>
  );
}

