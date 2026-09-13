/**
 * VenueOS — Smart Event Experience Platform
 */
import { useState, useEffect, lazy, Suspense } from 'react';
import { useAuthStore } from './stores/authStore';
import { useNavigationStore } from './stores/navigationStore';
import { useSOSStore } from './stores/sosStore';
import { useAttendeeStore } from './stores/attendeeStore';
import { mockRealtimeService } from './services/mockRealtimeService';
import { AttendeeTab, goHome, parseHash, syncHash } from './lib/navigation';

// UI
import { ToastBanner } from './components/ToastBanner';
import { ToastNotification } from './components/ToastNotification';
import { NotFoundPage } from './features/NotFoundPage';

// Attendee features
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

// Organizer (lazy)
const OrganizerDashboard = lazy(() =>
  import('./features/organizer/OrganizerDashboard').then(m => ({ default: m.OrganizerDashboard }))
);

import { MapPin, Calendar, Users, Radio, Award, Shield, User, Compass, Share2 } from 'lucide-react';

/* ─── Tab definitions ────────────────────── */
const ATTENDEE_TABS = [
  { id: 'map',           label: 'Map',      labelFull: 'Wayfinding',  icon: MapPin  },
  { id: 'schedule',      label: 'Schedule', labelFull: 'Schedule',    icon: Calendar },
  { id: 'crowd',         label: 'Crowd',    labelFull: 'Crowd Intel', icon: Users   },
  { id: 'announcements', label: 'Alerts',   labelFull: 'Alerts',      icon: Radio   },
  { id: 'passport',      label: 'Passport', labelFull: 'Passport',    icon: Award   },
] as const;

export default function App() {
  const { role, setRole } = useAuthStore();
  const { profile } = useAttendeeStore();
  const { requests } = useSOSStore();
  const { activeRoute } = useNavigationStore();

  const [attendeeTab, setAttendeeTab] = useState<AttendeeTab>('map');
  const [buddyModalOpen, setBuddyModalOpen] = useState(false);
  const [is404, setIs404] = useState(false);

  const navigateAttendee = (tab: AttendeeTab) => {
    setIs404(false); setRole('attendee'); setAttendeeTab(tab); syncHash('attendee', tab);
  };
  const navigateOrganizer = () => {
    setIs404(false); setRole('organizer'); syncHash('organizer');
  };

  useEffect(() => {
    const handleHash = () => {
      const parsed = parseHash(window.location.hash);
      if (parsed.is404) { setIs404(true); return; }
      setIs404(false);
      if (parsed.role) setRole(parsed.role);
      if (parsed.tab)  setAttendeeTab(parsed.tab);
    };
    handleHash();
    if (!window.location.hash || window.location.hash === '#') syncHash('attendee', 'map');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setRole]);

  useEffect(() => {
    mockRealtimeService.start();
    return () => mockRealtimeService.stop();
  }, []);

  const pendingSOSCount = requests.filter(r => r.status === 'pending').length;
  const isA11y = profile.accessibilityMode;

  return (
    <div className={`min-h-screen overflow-x-hidden flex flex-col ${isA11y ? 'bg-[#0a0a0a] text-white' : 'bg-[#f7f7f7] text-[#0a0a0a]'}`}>

      {/* Urgency banner */}
      <ToastBanner />

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#e8e8e8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <a
            href="#"
            onClick={e => { e.preventDefault(); navigateAttendee('map'); }}
            className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] rounded-md"
          >
            <div className="w-7 h-7 rounded-lg bg-[#0a0a0a] flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-[#0a0a0a]">
              Venue<span className="text-[#4f46e5]">OS</span>
            </span>
            {/* Live dot */}
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#f0faf4] text-[#16a34a] border border-[#bbf7d0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
              Live
            </span>
          </a>

          {/* Desktop attendee nav — underline style */}
          {role === 'attendee' && (
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
              {ATTENDEE_TABS.map(({ id, labelFull, icon: Icon }) => {
                const active = attendeeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => navigateAttendee(id as AttendeeTab)}
                    className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] ${
                      active
                        ? 'text-[#0a0a0a] bg-[#f7f7f7]'
                        : 'text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#f7f7f7]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#4f46e5]' : ''}`} />
                    {labelFull}
                    {active && <span className="sr-only">(current)</span>}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Buddy */}
            {role === 'attendee' && (
              <button
                onClick={() => setBuddyModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#3a3a3a] border border-[#e8e8e8] hover:border-[#d4d4d4] hover:bg-[#f7f7f7] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]"
              >
                <Share2 className="w-3.5 h-3.5" />
                {profile.connectedBuddy ? 'Buddy ●' : 'Buddy'}
              </button>
            )}

            {/* Role switcher — two text buttons separated by a slash */}
            <div className="flex items-center text-xs font-medium">
              <button
                onClick={() => navigateAttendee(attendeeTab)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-l-lg border border-r-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] ${
                  role === 'attendee'
                    ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                    : 'bg-white text-[#6b6b6b] border-[#e8e8e8] hover:bg-[#f7f7f7]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Attendee</span>
              </button>
              <button
                onClick={navigateOrganizer}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-r-lg border relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] ${
                  role === 'organizer'
                    ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                    : 'bg-white text-[#6b6b6b] border-[#e8e8e8] hover:bg-[#f7f7f7]'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Organizer</span>
                {pendingSOSCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-ping absolute -top-1 -right-1" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile tab bar */}
        {role === 'attendee' && (
          <div className="md:hidden border-t border-[#e8e8e8] bg-white px-2 py-1 flex items-center justify-around overflow-x-auto scrollbar-none">
            {ATTENDEE_TABS.map(({ id, label, icon: Icon }) => {
              const active = attendeeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => navigateAttendee(id as AttendeeTab)}
                  className={`flex flex-col items-center py-1 px-3 gap-0.5 text-[10px] font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] ${
                    active ? 'text-[#4f46e5]' : 'text-[#9a9a9a]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 flex-1 w-full"
      >
        {is404 ? (
          <NotFoundPage onGoHome={goHome} onNavigate={navigateAttendee} />
        ) : (
          <>
            {role === 'attendee' && (
              <div className="space-y-5">
                <AccessibilityBar />

                {attendeeTab === 'map' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    <div className="lg:col-span-4 space-y-4">
                      <MapSearch />
                      <VenueDetailDrawer />
                      {Boolean(activeRoute) && <RouteGuideCard />}
                      <LivePollCard />
                    </div>
                    <div className="lg:col-span-8">
                      <VenueMap />
                    </div>
                  </div>
                )}

                {attendeeTab === 'schedule' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    <div className="lg:col-span-8">
                      <ScheduleDiscovery onNavigateToVenue={() => navigateAttendee('map')} />
                    </div>
                    <div className="lg:col-span-4">
                      <LivePollCard />
                    </div>
                  </div>
                )}

                {attendeeTab === 'crowd' && (
                  <CrowdCoordination onNavigateToVenue={() => navigateAttendee('map')} />
                )}

                {attendeeTab === 'announcements' && <AnnouncementsFeed />}
                {attendeeTab === 'passport'      && <EventPassport />}
              </div>
            )}

            {role === 'organizer' && (
              <Suspense fallback={
                <div className="flex items-center justify-center py-24">
                  <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-[#6b6b6b]">Loading…</p>
                  </div>
                </div>
              }>
                <OrganizerDashboard />
              </Suspense>
            )}
          </>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="mt-16 border-t border-[#e8e8e8] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

            {/* Brand blurb */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0a0a0a] flex items-center justify-center">
                  <Compass className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold text-sm text-[#0a0a0a]">
                  Venue<span className="text-[#4f46e5]">OS</span>
                </span>
              </div>
              <p className="text-xs text-[#6b6b6b] leading-relaxed max-w-xs">
                Smart Event Experience & Universal Wayfinding platform — step-free routes, live crowd telemetry, session discovery, emergency dispatch.
              </p>
            </div>

            {/* Navigation links */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold text-[#0a0a0a] uppercase tracking-wider">Navigation</p>
              <ul className="space-y-1.5 text-xs text-[#6b6b6b]">
                {[
                  ['map',           'Venue Map'],
                  ['schedule',      'Schedule'],
                  ['crowd',         'Crowd Intel'],
                  ['passport',      'Event Passport'],
                ].map(([tab, label]) => (
                  <li key={tab}>
                    <button
                      onClick={() => navigateAttendee(tab as AttendeeTab)}
                      className="hover:text-[#4f46e5] transition-colors focus:outline-none focus-visible:underline"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold text-[#0a0a0a] uppercase tracking-wider">Safety</p>
              <ul className="space-y-1.5 text-xs text-[#6b6b6b]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] shrink-0" />
                  ADA Step-Free Accessible
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] shrink-0" />
                  24/7 Rapid SOS Dispatch
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4f46e5] shrink-0" />
                  Assistive Speech Synthesis
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#f0f0f0] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#9a9a9a]">
            <span>© {new Date().getFullYear()} VenueOS. All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
              Operations active
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SOSModal />
      <IssueReportModal />
      <BuddyFinderModal isOpen={buddyModalOpen} onClose={() => setBuddyModalOpen(false)} />

      {/* Toast stack */}
      <ToastNotification />

      {/* Floating attendee buttons */}
      {role === 'attendee' && !is404 && (
        <>
          <AIConciergeChat onNavigateToVenue={() => navigateAttendee('map')} />
          <SOSButton />
        </>
      )}
    </div>
  );
}
