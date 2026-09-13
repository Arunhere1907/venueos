/**
 * VenueOS — Hash-based SPA navigation helpers
 */
export type AttendeeTab = 'map' | 'schedule' | 'crowd' | 'announcements' | 'passport';
export type AppRole = 'attendee' | 'organizer';

const TAB_HASH: Record<AttendeeTab, string> = {
  map: '#/map',
  schedule: '#/schedule',
  crowd: '#/crowd',
  announcements: '#/announcements',
  passport: '#/passport'
};

const KNOWN_ROUTES: Record<string, { role: AppRole; tab?: AttendeeTab }> = {
  '#/map': { role: 'attendee', tab: 'map' },
  '#/schedule': { role: 'attendee', tab: 'schedule' },
  '#/crowd': { role: 'attendee', tab: 'crowd' },
  '#/announcements': { role: 'attendee', tab: 'announcements' },
  '#/passport': { role: 'attendee', tab: 'passport' },
  '#/organizer': { role: 'organizer' }
};

export function getHashForNavigation(role: AppRole, tab: AttendeeTab = 'map'): string {
  if (role === 'organizer') return '#/organizer';
  return TAB_HASH[tab];
}

export function syncHash(role: AppRole, tab: AttendeeTab = 'map'): void {
  const nextHash = getHashForNavigation(role, tab);
  if (window.location.hash.toLowerCase() !== nextHash) {
    window.location.hash = nextHash;
  }
}

export function goHome(): void {
  window.location.hash = '#/map';
}

export function parseHash(hash: string): {
  is404: boolean;
  role?: AppRole;
  tab?: AttendeeTab;
} {
  const normalized = hash.toLowerCase();

  if (!normalized || normalized === '#' || normalized === '#/') {
    return { is404: false, role: 'attendee', tab: 'map' };
  }

  if (normalized === '#/404' || normalized === '#404') {
    return { is404: true };
  }

  const route = KNOWN_ROUTES[normalized];
  if (route) {
    return { is404: false, ...route };
  }

  return { is404: true };
}
