/**
 * VenueOS — Core TypeScript Types and Interfaces
 */

export type VenueType = 
  | 'stage' 
  | 'booth' 
  | 'foodcourt' 
  | 'restroom' 
  | 'helpdesk' 
  | 'firstaid' 
  | 'security';

export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  x: number; // 0-100 percentage map coordinates
  y: number; // 0-100 percentage map coordinates
  isAccessible: boolean;
  zoneId: string;
  floor?: number;
  capacity?: number;
  description?: string;
  features?: string[];
  checkInCount?: number;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  speaker: string;
  speakerRole: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  venueId: string;
  tags: string[];    // used for interest-based recommendations
  roomName?: string;
  capacity?: number;
  isPopular?: boolean;
  favoritesCount?: number;
}

export type CrowdLevel = 'low' | 'medium' | 'high';
export type CrowdTrend = 'rising' | 'steady' | 'falling';

export interface Zone {
  id: string;
  name: string;
  description: string;
  crowdLevel: CrowdLevel;
  updatedAt: string;
  history: CrowdLevel[];
  trend: CrowdTrend;
  predictedSurge: boolean;
  currentCount: number;
  maxCapacity: number;
  polygonPoints?: string; // SVG coordinates for zone boundary
}

export type SOSType = 'medical' | 'security' | 'general';
export type SOSStatus = 'pending' | 'acknowledged' | 'resolved';

export interface SOSRequest {
  id: string;
  type: SOSType;
  location: { x: number; y: number };
  venueId?: string;
  venueName?: string;
  status: SOSStatus;
  timestamp: string;
  notes?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  reporterName?: string;
}

export type AnnouncementSeverity = 'info' | 'warning' | 'urgent';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  severity: AnnouncementSeverity;
  timestamp: string;
  targetZoneId?: string; // optional zone filter
  isSpoken?: boolean;
}

export interface AttendeeProfile {
  id: string;
  name: string;
  interests: string[];
  favoritedSessionIds: string[];
  accessibilityMode: boolean;
  checkedInVenueIds: string[];
  buddyCode?: string;
  connectedBuddy?: {
    name: string;
    code: string;
    location: { x: number; y: number };
    lastSeen: string;
  };
}

export type IssueType = 'spill' | 'long_line' | 'broken_facility' | 'other';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export interface IssueReport {
  id: string;
  type: IssueType;
  location: { x: number; y: number };
  venueId?: string;
  venueName?: string;
  description: string;
  status: IssueStatus;
  timestamp: string;
  reporterName?: string;
}

export type StaffRole = 'medical' | 'security' | 'general';
export type StaffStatus = 'available' | 'dispatched';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  currentZoneId: string;
  status: StaffStatus;
  phone?: string;
  dispatchedToSOSId?: string;
}

export interface PollQuestion {
  id: string;
  sessionId: string;
  question: string;
  options: string[];
  votes: number[]; // parallel array matching options
  userVotedIndex?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    targetVenueId?: string;
    targetTab?: string;
  }[];
}

export interface RoutePath {
  points: { x: number; y: number }[];
  distanceMeters: number;
  estimatedMinutes: number;
  isStepFree: boolean;
  notes: string[];
}
