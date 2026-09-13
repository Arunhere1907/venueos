/**
 * VenueOS — Pure Utility Functions & Helpers
 */

import { CrowdLevel, AnnouncementSeverity, VenueType, IssueType } from '../types';

/**
 * Formats ISO timestamp to human friendly time "10:30 AM"
 */
export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
}

/**
 * Formats time range "9:30 AM – 10:45 AM"
 */
export function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTime(startIso)} – ${formatTime(endIso)}`;
}

/**
 * Returns color classes and labels for CrowdLevel
 */
export function getCrowdBadge(level: CrowdLevel): {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (level) {
    case 'low':
      return {
        label: 'Low Crowd',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500'
      };
    case 'medium':
      return {
        label: 'Moderate',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500'
      };
    case 'high':
      return {
        label: 'High Density',
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800',
        dot: 'bg-rose-500'
      };
  }
}

/**
 * Returns color classes for announcement severity
 */
export function getSeverityBadge(severity: AnnouncementSeverity): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (severity) {
    case 'info':
      return {
        label: 'Notice',
        bg: 'bg-sky-50 dark:bg-sky-950/50',
        text: 'text-sky-700 dark:text-sky-300',
        border: 'border-sky-200 dark:border-sky-800'
      };
    case 'warning':
      return {
        label: 'Advisory',
        bg: 'bg-amber-50 dark:bg-amber-950/50',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800'
      };
    case 'urgent':
      return {
        label: 'Urgent Alert',
        bg: 'bg-rose-50 dark:bg-rose-950/50',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800'
      };
  }
}

/**
 * Returns human label and colors for VenueType
 */
export function getVenueTypeInfo(type: VenueType): {
  label: string;
  color: string;
  badgeBg: string;
} {
  switch (type) {
    case 'stage':
      return { label: 'Stage / Theater', color: '#6366f1', badgeBg: 'bg-indigo-100 text-indigo-800' };
    case 'booth':
      return { label: 'Booth / Pavilion', color: '#0ea5e9', badgeBg: 'bg-sky-100 text-sky-800' };
    case 'foodcourt':
      return { label: 'Dining & Cafe', color: '#f59e0b', badgeBg: 'bg-amber-100 text-amber-800' };
    case 'restroom':
      return { label: 'Restroom & Care', color: '#10b981', badgeBg: 'bg-emerald-100 text-emerald-800' };
    case 'helpdesk':
      return { label: 'Info & Helpdesk', color: '#8b5cf6', badgeBg: 'bg-purple-100 text-purple-800' };
    case 'firstaid':
      return { label: 'First Aid / Medical', color: '#ef4444', badgeBg: 'bg-rose-100 text-rose-800' };
    case 'security':
      return { label: 'Security & Safety', color: '#334155', badgeBg: 'bg-slate-100 text-slate-800' };
  }
}

/**
 * Returns human label and badge for IssueType
 */
export function getIssueTypeInfo(type: IssueType): { label: string; badge: string } {
  switch (type) {
    case 'spill':
      return { label: 'Liquid Spill / Hazard', badge: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'long_line':
      return { label: 'Congestion / Long Line', badge: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'broken_facility':
      return { label: 'Broken Facility / Door', badge: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 'other':
      return { label: 'General Operational', badge: 'bg-slate-100 text-slate-800 border-slate-200' };
  }
}

/**
 * Generates unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Simple fuzzy matcher
 */
export function fuzzyMatch(pattern: string, text: string): boolean {
  if (!pattern) return true;
  const p = pattern.toLowerCase().trim();
  const t = text.toLowerCase();
  if (t.includes(p)) return true;

  // Check token inclusion
  const tokens = p.split(/\s+/);
  return tokens.every(tok => t.includes(tok));
}
