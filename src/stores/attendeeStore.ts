/**
 * VenueOS — Attendee Profile & Preferences Store
 */
import { create } from 'zustand';
import { AttendeeProfile } from '../types';
import { INITIAL_ATTENDEE_PROFILE } from '../data/mockData';
import { useNavigationStore } from './navigationStore';

interface AttendeeState {
  profile: AttendeeProfile;

  // Actions
  toggleFavorite: (sessionId: string) => void;
  toggleAccessibilityMode: () => void;
  setAccessibilityMode: (enabled: boolean) => void;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  checkInVenue: (venueId: string) => boolean;
  connectBuddy: (code: string) => boolean;
  disconnectBuddy: () => void;
}

export const useAttendeeStore = create<AttendeeState>((set, get) => ({
  profile: INITIAL_ATTENDEE_PROFILE,

  toggleFavorite: (sessionId) => {
    set(state => {
      const isFav = state.profile.favoritedSessionIds.includes(sessionId);
      const updated = isFav
        ? state.profile.favoritedSessionIds.filter(id => id !== sessionId)
        : [...state.profile.favoritedSessionIds, sessionId];

      return {
        profile: { ...state.profile, favoritedSessionIds: updated }
      };
    });
  },

  toggleAccessibilityMode: () => {
    const current = get().profile.accessibilityMode;
    get().setAccessibilityMode(!current);
  },

  setAccessibilityMode: (enabled) => {
    set(state => ({
      profile: { ...state.profile, accessibilityMode: enabled }
    }));
    // Sync with navigation routing store
    useNavigationStore.getState().setAccessibleOnly(enabled);
  },

  addInterest: (interest) => {
    set(state => {
      if (state.profile.interests.includes(interest)) return state;
      return {
        profile: {
          ...state.profile,
          interests: [...state.profile.interests, interest]
        }
      };
    });
  },

  removeInterest: (interest) => {
    set(state => ({
      profile: {
        ...state.profile,
        interests: state.profile.interests.filter(i => i !== interest)
      }
    }));
  },

  checkInVenue: (venueId) => {
    const state = get();
    if (state.profile.checkedInVenueIds.includes(venueId)) {
      return false; // already checked in
    }

    set({
      profile: {
        ...state.profile,
        checkedInVenueIds: [...state.profile.checkedInVenueIds, venueId]
      }
    });

    // Also update venue check-in count
    useNavigationStore.getState().incrementCheckIn(venueId);
    return true;
  },

  connectBuddy: (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length < 4) return false;

    // Simulate finding a buddy with realistic location
    set(state => ({
      profile: {
        ...state.profile,
        connectedBuddy: {
          name: cleanCode === 'VOS-DEMO' ? 'Taylor Swift' : `Attendee (${cleanCode})`,
          code: cleanCode,
          location: {
            x: Math.floor(Math.random() * 60 + 20),
            y: Math.floor(Math.random() * 60 + 20)
          },
          lastSeen: 'Just now'
        }
      }
    }));
    return true;
  },

  disconnectBuddy: () => {
    set(state => ({
      profile: {
        ...state.profile,
        connectedBuddy: undefined
      }
    }));
  }
}));
