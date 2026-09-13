/**
 * VenueOS — Navigation & Venue Store
 */
import { create } from 'zustand';
import { Venue, VenueType, RoutePath } from '../types';
import { INITIAL_VENUES } from '../data/mockData';
import { calculateRoute } from '../lib/routing';
import { eventBus, REALTIME_TOPICS } from '../services/eventBus';

interface NavigationState {
  venues: Venue[];
  selectedVenueId: string | null;
  userLocation: { x: number; y: number };
  activeRoute: RoutePath | null;
  typeFilter: VenueType | 'all';
  accessibleOnly: boolean;
  searchQuery: string;

  // Actions
  selectVenue: (id: string | null) => void;
  setUserLocation: (loc: { x: number; y: number }) => void;
  routeToVenue: (venueId: string) => void;
  clearRoute: () => void;
  setTypeFilter: (filter: VenueType | 'all') => void;
  setAccessibleOnly: (enabled: boolean) => void;
  setSearchQuery: (query: string) => void;
  
  // Organizer CRUD
  addVenue: (venue: Omit<Venue, 'id' | 'checkInCount'>) => void;
  updateVenue: (id: string, updates: Partial<Venue>) => void;
  deleteVenue: (id: string) => void;
  incrementCheckIn: (venueId: string) => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  venues: INITIAL_VENUES,
  selectedVenueId: null,
  userLocation: { x: 50, y: 12 }, // North Entrance default start
  activeRoute: null,
  typeFilter: 'all',
  accessibleOnly: false,
  searchQuery: '',

  selectVenue: (id) => {
    set({ selectedVenueId: id });
    if (id) {
      const state = get();
      const target = state.venues.find(v => v.id === id);
      if (target) {
        // Automatically compute wayfinding path
        const route = calculateRoute(
          state.userLocation,
          { x: target.x, y: target.y },
          state.accessibleOnly
        );
        set({ activeRoute: route });
      }
    }
  },

  setUserLocation: (loc) => {
    set({ userLocation: loc });
    const state = get();
    if (state.selectedVenueId) {
      const target = state.venues.find(v => v.id === state.selectedVenueId);
      if (target) {
        const route = calculateRoute(loc, { x: target.x, y: target.y }, state.accessibleOnly);
        set({ activeRoute: route });
      }
    }
  },

  routeToVenue: (venueId) => {
    const state = get();
    const target = state.venues.find(v => v.id === venueId);
    if (!target) return;
    const route = calculateRoute(
      state.userLocation,
      { x: target.x, y: target.y },
      state.accessibleOnly
    );
    set({ selectedVenueId: venueId, activeRoute: route });
  },

  clearRoute: () => set({ activeRoute: null, selectedVenueId: null }),

  setTypeFilter: (filter) => set({ typeFilter: filter }),

  setAccessibleOnly: (enabled) => {
    set({ accessibleOnly: enabled });
    // Recalculate route if active
    const state = get();
    if (state.selectedVenueId) {
      const target = state.venues.find(v => v.id === state.selectedVenueId);
      if (target) {
        const route = calculateRoute(state.userLocation, { x: target.x, y: target.y }, enabled);
        set({ activeRoute: route });
      }
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  addVenue: (venueData) => {
    const newVenue: Venue = {
      ...venueData,
      id: `venue-${Date.now()}`,
      checkInCount: 0
    };
    set(state => ({ venues: [...state.venues, newVenue] }));
  },

  updateVenue: (id, updates) => {
    set(state => ({
      venues: state.venues.map(v => (v.id === id ? { ...v, ...updates } : v))
    }));
  },

  deleteVenue: (id) => {
    set(state => ({
      venues: state.venues.filter(v => v.id !== id),
      selectedVenueId: state.selectedVenueId === id ? null : state.selectedVenueId,
      activeRoute: state.selectedVenueId === id ? null : state.activeRoute
    }));
  },

  incrementCheckIn: (venueId) => {
    set(state => ({
      venues: state.venues.map(v =>
        v.id === venueId ? { ...v, checkInCount: (v.checkInCount || 0) + 1 } : v
      )
    }));
    eventBus.publish(REALTIME_TOPICS.CHECK_IN_NEW, { venueId });
  }
}));
