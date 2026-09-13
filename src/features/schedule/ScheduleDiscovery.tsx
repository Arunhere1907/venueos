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
        <section className="bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/30 rounded-xl">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Recommended for You</h3>
                <p className="text-xs text-indigo-200">
                  Matched to your interests: {profile.interests.join(', ')}
                </p>
              </div>
            </div>

            {/* Interest Manager pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              {allTags.slice(0, 4).map(tag => {
                const isSelected = profile.interests.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => (isSelected ? removeInterest(tag) : addInterest(tag))}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
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
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-indigo-200 mb-1.5">
                      <span className="font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTimeRange(session.startTime, session.endTime)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(session);
                        }}
                        className="p-1 hover:text-white"
                        title="Bookmark session"
                      >
                        {isFav ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                      {session.title}
                    </h4>
                  </div>

                  <div className="text-xs text-indigo-200/90 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="truncate">{session.speaker}</span>
                    <span className="text-indigo-300 font-medium shrink-0 flex items-center gap-1">
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Top Controls: Search and View Tab */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions by keyword, speaker, or topic..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Sessions ({sessions.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'favorites'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              Bookmarked ({profile.favoritedSessionIds.length})
            </button>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-xs px-3 py-1 rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedTag === null
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
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
                className={`text-xs px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-2">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No sessions found
            </h4>
            <p className="text-xs text-slate-500">
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
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTimeRange(session.startTime, session.endTime)}</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {session.roomName}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {session.title}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBookmark(session);
                    }}
                    className="p-2 text-slate-400 hover:text-amber-500 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
                    title={isFav ? 'Remove bookmark' : 'Bookmark session'}
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

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                      {session.speaker.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {session.speaker}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      ({session.speakerRole})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {session.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
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
