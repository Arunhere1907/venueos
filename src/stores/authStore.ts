/**
 * VenueOS — Auth & Role Store
 */
import { create } from 'zustand';

export type UserRole = 'attendee' | 'organizer';

interface AuthState {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: 'attendee',
  setRole: (role) => set({ role }),
  toggleRole: () =>
    set((state) => ({
      role: state.role === 'attendee' ? 'organizer' : 'attendee',
    })),
}));
