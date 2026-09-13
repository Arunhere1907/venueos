/**
 * VenueOS — Real-Time Announcements Store
 */
import { create } from 'zustand';
import { Announcement, AnnouncementSeverity } from '../types';
import { INITIAL_ANNOUNCEMENTS } from '../data/mockData';
import { eventBus, REALTIME_TOPICS } from '../services/eventBus';

interface AnnouncementState {
  announcements: Announcement[];
  activeUrgentBanner: Announcement | null;

  // Actions
  broadcastAnnouncement: (ann: {
    title: string;
    body: string;
    severity: AnnouncementSeverity;
    targetZoneId?: string;
  }) => void;
  dismissUrgentBanner: () => void;
  markSpoken: (id: string) => void;
}

export const useAnnouncementStore = create<AnnouncementState>((set, get) => ({
  announcements: INITIAL_ANNOUNCEMENTS,
  activeUrgentBanner: null,

  broadcastAnnouncement: ({ title, body, severity, targetZoneId }) => {
    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      body,
      severity,
      timestamp: new Date().toISOString(),
      targetZoneId
    };

    set(state => ({
      announcements: [newAnnouncement, ...state.announcements],
      activeUrgentBanner: severity === 'urgent' ? newAnnouncement : state.activeUrgentBanner
    }));

    eventBus.publish(REALTIME_TOPICS.ANNOUNCEMENT_NEW, newAnnouncement);
  },

  dismissUrgentBanner: () => set({ activeUrgentBanner: null }),

  markSpoken: (id) => {
    set(state => ({
      announcements: state.announcements.map(a => (a.id === id ? { ...a, isSpoken: true } : a))
    }));
  }
}));
