/**
 * Unit Tests — Routing & Navigation Engine
 */
import { describe, it, expect } from 'vitest';
import {
  calculateDistanceMeters,
  calculateRoute,
  findNearestVenue,
  Point2D,
} from '../lib/routing';
import { Venue, Zone } from '../types';

describe('Distance Calculation', () => {
  it('should calculate distance between two points', () => {
    const p1: Point2D = { x: 0, y: 0 };
    const p2: Point2D = { x: 10, y: 10 };
    const distance = calculateDistanceMeters(p1, p2);
    expect(distance).toBeGreaterThan(0);
    expect(typeof distance).toBe('number');
  });

  it('should return 0 for same point', () => {
    const p1: Point2D = { x: 50, y: 50 };
    const p2: Point2D = { x: 50, y: 50 };
    const distance = calculateDistanceMeters(p1, p2);
    expect(distance).toBe(0);
  });

  it('should calculate symmetric distance', () => {
    const p1: Point2D = { x: 10, y: 20 };
    const p2: Point2D = { x: 30, y: 40 };
    const d1 = calculateDistanceMeters(p1, p2);
    const d2 = calculateDistanceMeters(p2, p1);
    expect(d1).toBe(d2);
  });
});

describe('Route Calculation', () => {
  const start: Point2D = { x: 10, y: 10 };
  const destination: Point2D = { x: 90, y: 90 };

  it('should generate a route with waypoints', () => {
    const route = calculateRoute(start, destination);
    expect(route.points.length).toBeGreaterThanOrEqual(2);
    expect(route.points[0]).toEqual(start);
    expect(route.points[route.points.length - 1]).toEqual(destination);
  });

  it('should calculate distance and estimated time', () => {
    const route = calculateRoute(start, destination);
    expect(route.distanceMeters).toBeGreaterThan(0);
    expect(route.estimatedMinutes).toBeGreaterThanOrEqual(1);
  });

  it('should mark accessible routes as step-free', () => {
    const route = calculateRoute(start, destination, true);
    expect(route.isStepFree).toBe(true);
    expect(route.notes.some(n => n.toLowerCase().includes('step-free'))).toBe(true);
  });

  it('should mark standard routes as non-step-free', () => {
    const route = calculateRoute(start, destination, false);
    expect(route.isStepFree).toBe(false);
  });

  it('should include high crowd warnings in notes', () => {
    const zones: Zone[] = [
      {
        id: 'zone-1',
        name: 'East Hall',
        description: 'Main expo area',
        crowdLevel: 'high',
        updatedAt: new Date().toISOString(),
        history: ['high'],
        trend: 'steady',
        predictedSurge: true,
        currentCount: 200,
        maxCapacity: 250,
      },
    ];
    const route = calculateRoute(start, destination, false, zones);
    expect(route.notes.some(n => n.toLowerCase().includes('high'))).toBe(true);
  });
});

describe('Nearest Venue Finder', () => {
  const currentPos: Point2D = { x: 50, y: 50 };
  const venues: Venue[] = [
    {
      id: 'v1',
      name: 'Restroom North',
      type: 'restroom',
      x: 55,
      y: 55,
      isAccessible: true,
      zoneId: 'zone-1',
    },
    {
      id: 'v2',
      name: 'Restroom South',
      type: 'restroom',
      x: 10,
      y: 10,
      isAccessible: true,
      zoneId: 'zone-2',
    },
    {
      id: 'v3',
      name: 'First Aid Station',
      type: 'firstaid',
      x: 60,
      y: 60,
      isAccessible: true,
      zoneId: 'zone-1',
    },
  ];

  it('should find nearest venue of specified type', () => {
    const result = findNearestVenue(currentPos, venues, ['restroom']);
    expect(result).not.toBeNull();
    expect(result?.venue.name).toBe('Restroom North');
    expect(result?.venue.type).toBe('restroom');
  });

  it('should return null if no venues of type exist', () => {
    const result = findNearestVenue(currentPos, venues, ['security']);
    expect(result).toBeNull();
  });

  it('should find nearest among multiple types', () => {
    const result = findNearestVenue(currentPos, venues, ['restroom', 'firstaid']);
    expect(result).not.toBeNull();
    expect(['Restroom North', 'First Aid Station']).toContain(result?.venue.name);
  });

  it('should calculate correct distance to nearest venue', () => {
    const result = findNearestVenue(currentPos, venues, ['restroom']);
    expect(result).not.toBeNull();
    expect(result?.distanceMeters).toBeGreaterThan(0);
    expect(typeof result?.distanceMeters).toBe('number');
  });

  it('should handle empty venue array', () => {
    const result = findNearestVenue(currentPos, [], ['restroom']);
    expect(result).toBeNull();
  });
});
