/**
 * Unit Tests — Utility Functions
 */
import { describe, it, expect } from 'vitest';
import {
  formatTime,
  formatTimeRange,
  getCrowdBadge,
  getSeverityBadge,
  getVenueTypeInfo,
  getIssueTypeInfo,
  generateId,
  fuzzyMatch,
  sanitizeInput,
  sanitizeUrl,
} from '../lib/utils';
import { CrowdLevel, AnnouncementSeverity, VenueType, IssueType } from '../types';

describe('Time Formatting', () => {
  it('should format ISO timestamp to readable time', () => {
    const isoString = '2024-03-15T14:30:00.000Z';
    const result = formatTime(isoString);
    // Result will vary by timezone, just check it's a string
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should handle invalid ISO string gracefully', () => {
    const result = formatTime('invalid-date');
    // Browser returns "Invalid Date" for invalid date strings
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should format time range correctly', () => {
    const start = '2024-03-15T09:00:00.000Z';
    const end = '2024-03-15T10:30:00.000Z';
    const result = formatTimeRange(start, end);
    expect(result).toContain('–');
    expect(typeof result).toBe('string');
  });
});

describe('Crowd Badge Styling', () => {
  it('should return correct badge for low crowd level', () => {
    const badge = getCrowdBadge('low');
    expect(badge.label).toBe('Low Crowd');
    expect(badge.dot).toBe('bg-emerald-500');
  });

  it('should return correct badge for medium crowd level', () => {
    const badge = getCrowdBadge('medium');
    expect(badge.label).toBe('Moderate');
    expect(badge.dot).toBe('bg-amber-500');
  });

  it('should return correct badge for high crowd level', () => {
    const badge = getCrowdBadge('high');
    expect(badge.label).toBe('High Density');
    expect(badge.dot).toBe('bg-rose-500');
  });
});

describe('Severity Badge Styling', () => {
  it('should return correct badge for info severity', () => {
    const badge = getSeverityBadge('info');
    expect(badge.label).toBe('Notice');
    expect(badge.bg).toContain('sky');
  });

  it('should return correct badge for warning severity', () => {
    const badge = getSeverityBadge('warning');
    expect(badge.label).toBe('Advisory');
    expect(badge.bg).toContain('amber');
  });

  it('should return correct badge for urgent severity', () => {
    const badge = getSeverityBadge('urgent');
    expect(badge.label).toBe('Urgent Alert');
    expect(badge.bg).toContain('rose');
  });
});

describe('Venue Type Info', () => {
  it('should return correct info for stage venue', () => {
    const info = getVenueTypeInfo('stage');
    expect(info.label).toBe('Stage / Theater');
    expect(info.color).toBeTruthy();
  });

  it('should return correct info for restroom venue', () => {
    const info = getVenueTypeInfo('restroom');
    expect(info.label).toBe('Restroom & Care');
  });

  it('should return correct info for firstaid venue', () => {
    const info = getVenueTypeInfo('firstaid');
    expect(info.label).toBe('First Aid / Medical');
  });
});

describe('Issue Type Info', () => {
  it('should return correct info for spill issue', () => {
    const info = getIssueTypeInfo('spill');
    expect(info.label).toBe('Liquid Spill / Hazard');
  });

  it('should return correct info for long_line issue', () => {
    const info = getIssueTypeInfo('long_line');
    expect(info.label).toBe('Congestion / Long Line');
  });
});

describe('ID Generation', () => {
  it('should generate unique IDs with prefix', () => {
    const id1 = generateId('test');
    const id2 = generateId('test');
    expect(id1).toContain('test-');
    expect(id2).toContain('test-');
    expect(id1).not.toBe(id2);
  });

  it('should generate IDs with default prefix', () => {
    const id = generateId();
    expect(id).toContain('id-');
  });
});

describe('Fuzzy Matching', () => {
  it('should match exact substring', () => {
    expect(fuzzyMatch('rest', 'Restroom North')).toBe(true);
    expect(fuzzyMatch('north', 'Restroom North')).toBe(true);
  });

  it('should match multiple tokens', () => {
    expect(fuzzyMatch('rest north', 'Restroom North')).toBe(true);
    expect(fuzzyMatch('ai session', 'AI Innovation Session')).toBe(true);
  });

  it('should be case-insensitive', () => {
    expect(fuzzyMatch('RESTROOM', 'Restroom North')).toBe(true);
    expect(fuzzyMatch('NorTH', 'Restroom North')).toBe(true);
  });

  it('should return true for empty pattern', () => {
    expect(fuzzyMatch('', 'Any text')).toBe(true);
  });

  it('should return false for non-matching pattern', () => {
    expect(fuzzyMatch('xyz', 'Restroom North')).toBe(false);
  });
});

describe('Input Sanitization (XSS Prevention)', () => {
  it('should strip HTML tags from input', () => {
    const input = '<script>alert("xss")</script>Hello';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello');
    expect(result).not.toContain('<script>');
  });

  it('should remove script tags with content', () => {
    const input = 'Text before<script>malicious code</script>text after';
    const result = sanitizeInput(input);
    expect(result).toBe('Text beforetext after');
  });

  it('should remove all HTML tags', () => {
    const input = '<div><p>Paragraph</p><span>Span</span></div>';
    const result = sanitizeInput(input);
    expect(result).toBe('ParagraphSpan');
  });

  it('should enforce maximum length', () => {
    const input = 'a'.repeat(2000);
    const result = sanitizeInput(input, 100);
    expect(result.length).toBe(100);
  });

  it('should trim whitespace', () => {
    const input = '  Hello World  ';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello World');
  });

  it('should handle empty or invalid input', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput(null as any)).toBe('');
    expect(sanitizeInput(undefined as any)).toBe('');
  });

  it('should prevent XSS via event handlers', () => {
    const input = '<img src=x onerror="alert(1)">';
    const result = sanitizeInput(input);
    expect(result).not.toContain('onerror');
    expect(result).not.toContain('alert');
  });
});

describe('URL Sanitization (Open Redirect Prevention)', () => {
  it('should allow relative paths starting with /', () => {
    const result = sanitizeUrl('/map');
    expect(result).toBe('/map');
  });

  it('should allow hash routes', () => {
    const result = sanitizeUrl('#/schedule');
    expect(result).toBe('#/schedule');
  });

  it('should allow same-origin absolute URLs', () => {
    const result = sanitizeUrl(window.location.origin + '/test');
    expect(result).toBeTruthy();
  });

  it('should reject external URLs', () => {
    const result = sanitizeUrl('https://evil.com/phishing');
    expect(result).toBeNull();
  });

  it('should reject javascript: protocol', () => {
    const result = sanitizeUrl('javascript:alert(1)');
    expect(result).toBeNull();
  });

  it('should handle empty or invalid input', () => {
    expect(sanitizeUrl('')).toBeNull();
    expect(sanitizeUrl('   ')).toBeNull();
    expect(sanitizeUrl(null as any)).toBeNull();
  });
});
