/**
 * VenueOS — Event Schedule Discovery & Personalized Recommendations
 */
import React, { useState } from 'react';
import { useScheduleStore } from '../../stores/scheduleStore';
import { useAttendeeStore } from '../../stores/attendeeStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { useToastStore } from '../../stores/toastStore';
import { rankSessionsByInterests } from '../../lib/recommendation';
import { formatTimeRange, fuzzyMatch } from '../../lib/utils';
import { Session } from '../../types';
import { LivePollCard } from './LivePollCard';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import {
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Clock,
  MapPin,
  Search,
  User,
  Navigation,
  Tag,
  Check
} from 'lucide-react';

interface ScheduleDiscoveryProps {
  onNavigateToVenue?: (venueId: string) => void;
}

export const ScheduleDiscovery: React.FC<ScheduleDiscoveryProps> = ({ onNavigateToVenue }) => {
  const { sessions, polls, selectedTag, setSelectedTag, searchQuery, setSearchQuery } = useScheduleStore();
  const { profile, toggleFavorite, addInterest, removeInterest } = useAttendeeStore();
  const { routeToVenue } = useNavigationStore();
  const { addToast } = useToastStore();

  const [activeSessionModal, setActiveSessionModal] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const handleToggleBookmark = (session: Session) => {
    const isFav = profile.favoritedSessionIds.includes(session.id);
    toggleFavorite(session.id);
    if (!isFav) {
      addToast(`Bookmarked "${session.title}"`, 'success');
    } else {
      addToast(`Removed "${session.title}" from bookmarks`, 'info');
    }
  };

  // Compute recommendation ranking
  const ranked = rankSessionsByInterests(sessions, profile.interests);
  const topRecommendations = ranked
    .filter(r => r.score > 0)
    .slice(0, 3)
    .map(r => r.session);

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    // Favorites tab check
    if (activeTab === 'favorites' && !profile.favoritedSessionIds.includes(session.id)) {
      return false;
    }

    // Tag filter
    if (selectedTag && !session.tags.includes(selectedTag)) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const match =
        fuzzyMatch(searchQuery, session.title) ||
        fuzzyMatch(searchQuery, session.speaker) ||
        fuzzyMatch(searchQuery, session.description) ||
        session.tags.some(t => fuzzyMatch(searchQuery, t));
      if (!match) return false;
    }

    return true;
  });

  // Extract all unique tags
  const allTags = Array.from(new Set(sessions.flatMap(s => s.tags)));

  const handleRouteClick = (venueId: string) => {
    setActiveSessionModal(null);
    routeToVenue(venueId);
    if (onNavigateToVenue) {
      onNavigateToVenue(venueId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personalized Recommendation Rail */}
      {topRecommendations.length > 0 && activeTab === 'all' && (
        <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-lg p-5 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-indigo-500/30 rounded-lg">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">Recommended for You</h3>
                <p className="text-sm text-indigo-200 mt-0.5">
                  Matched to your interests: {profile.interests.join(', ')}
                </p>
              </div>
            </div>

            {/* Interest Manager pills */}
            <div className="hidden sm:flex items-center gap-2">
              {allTags.slice(0, 4).map(tag => {
                const isSelected = profile.interests.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => (isSelected ? removeInterest(tag) : addInterest(tag))}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      isSelected
                        ? 'bg-indigo-500 text-white border-indigo-400'
                        : 'bg-white/10 text-indigo-200 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {tag} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topRecommendations.map(session => {
              const isFav = profile.favoritedSessionIds.includes(session.id);
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionModal(session)}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-lg p-4 border border-white/10 cursor-pointer transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white flex flex-col justify-between space-y-3"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveSessionModal(session);
                    }
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-indigo-200 mb-2">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {formatTimeRange(session.startTime, session.endTime)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(session);
                        }}
                        className="p-1.5 hover:text-white rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        title="Bookmark session"
                        aria-label={isFav ? 'Remove bookmark' : 'Add bookmark'}
                      >
                        {isFav ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <h4 className="text-sm font-semibold text-white line-clamp-2 leading-snug">
                      {session.title}
                    </h4>
                  </div>

                  <div className="text-xs text-indigo-200/90 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="truncate font-medium">{session.speaker}</span>
                    <span className="text-indigo-300 font-semibold shrink-0 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {session.roomName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Top Controls: Search and View Tab */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions by keyword, speaker, or topic..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              All Sessions ({sessions.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeTab === 'favorites'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              Bookmarked ({profile.favoritedSessionIds.length})
            </button>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-sm px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${
              selectedTag === null
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {allTags.map(tag => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`text-sm px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              No sessions found
            </h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or clearing the selected tag filter.
            </p>
          </div>
        ) : (
          filteredSessions.map(session => {
            const isFav = profile.favoritedSessionIds.includes(session.id);
            return (
              <article
                key={session.id}
                onClick={() => setActiveSessionModal(session)}
                className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all cursor-pointer space-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveSessionModal(session);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{formatTimeRange(session.startTime, session.endTime)}</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {session.roomName}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-snug">
                      {session.title}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBookmark(session);
                    }}
                    className="p-2.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    title={isFav ? 'Remove bookmark' : 'Bookmark session'}
                    aria-label={isFav ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    {isFav ? (
                      <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {session.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-sm font-semibold">
                      {session.speaker.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {session.speaker}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {session.speakerRole}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {session.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Session Details & Interactive Poll Modal */}
      {activeSessionModal && (
        <Modal
          isOpen={true}
          onClose={() => setActiveSessionModal(null)}
          title={activeSessionModal.title}
          maxWidth="lg"
        >
          <div className="space-y-4">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-indigo-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTimeRange(activeSessionModal.startTime, activeSessionModal.endTime)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                {activeSessionModal.roomName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-slate-400" />
                {activeSessionModal.speaker} ({activeSessionModal.speakerRole})
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {activeSessionModal.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeSessionModal.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Live Poll for this session if available */}
            {polls.filter(p => p.sessionId === activeSessionModal.id).map(poll => (
              <LivePollCard key={poll.id} poll={poll} />
            ))}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="primary"
                onClick={() => handleRouteClick(activeSessionModal.venueId)}
                leftIcon={<Navigation className="w-4 h-4" />}
                fullWidth
              >
                Navigate to Stage
              </Button>

              <Button
                variant="secondary"
                onClick={() => handleToggleBookmark(activeSessionModal)}
                leftIcon={<Bookmark className="w-4 h-4 text-amber-500" />}
              >
                {profile.favoritedSessionIds.includes(activeSessionModal.id) ? 'Favorited' : 'Bookmark'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
