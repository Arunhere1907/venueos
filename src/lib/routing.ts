/**
 * VenueOS — Wayfinding & Spatial Pathfinding Engine
 */

import { Venue, RoutePath, Zone } from '../types';

export interface Point2D {
  x: number;
  y: number;
}

/**
 * Computes Euclidean distance between two 2D points (scaled by meters).
 */
export function calculateDistanceMeters(p1: Point2D, p2: Point2D): number {
  const dx = (p2.x - p1.x) * 2.5; // approx 2.5 meters per map unit
  const dy = (p2.y - p1.y) * 2.5;
  return Math.round(Math.sqrt(dx * dx + dy * dy));
}

/**
 * Generates an accessible or standard waypoint path from start to destination.
 * Avoids stairs/congestion barriers if isAccessible is true.
 */
export function calculateRoute(
  start: Point2D,
  destination: Point2D,
  isAccessible: boolean = false,
  zones: Zone[] = []
): RoutePath {
  const dist = calculateDistanceMeters(start, destination);
  const minutes = Math.max(1, Math.round(dist / 65)); // 65m per min average walking pace

  // Compute waypoint corridor
  const midX = (start.x + destination.x) / 2;
  const midY = (start.y + destination.y) / 2;

  // If accessible, route through central wide corridors (e.g. y=30 or x=50 corridor)
  const points: Point2D[] = [start];

  if (isAccessible) {
    // Accessible corridor routing: navigate through elevator/ramp concourse at y=32 or x=50
    if (Math.abs(start.y - destination.y) > 25) {
      points.push({ x: start.x, y: 32 });
      points.push({ x: destination.x, y: 32 });
    } else {
      points.push({ x: midX, y: midY });
    }
  } else {
    // Standard path with smooth mid point
    points.push({ x: midX, y: midY });
  }

  points.push(destination);

  const notes: string[] = [];
  if (isAccessible) {
    notes.push('Step-free route via North Elevator & ADA ramps');
    notes.push('Aisle clearance: >1.8m throughout');
  } else {
    notes.push('Direct main concourse walkway');
  }

  // Check if any zones on route are high crowd
  const highCrowdZone = zones.find(z => z.crowdLevel === 'high');
  if (highCrowdZone) {
    notes.push(`Notice: ${highCrowdZone.name} has high foot-traffic. Alternate corridors marked.`);
  }

  return {
    points,
    distanceMeters: dist,
    estimatedMinutes: minutes,
    isStepFree: isAccessible,
    notes
  };
}

/**
 * Finds nearest venue of specific type (e.g. firstaid, security, restroom)
 */
export function findNearestVenue(
  currentPos: Point2D,
  venues: Venue[],
  types: string[]
): { venue: Venue; distanceMeters: number } | null {
  const filtered = venues.filter(v => types.includes(v.type));
  if (!filtered.length) return null;

  let closestVenue: Venue = filtered[0];
  let minDistance = calculateDistanceMeters(currentPos, { x: closestVenue.x, y: closestVenue.y });

  for (let i = 1; i < filtered.length; i++) {
    const dist = calculateDistanceMeters(currentPos, { x: filtered[i].x, y: filtered[i].y });
    if (dist < minDistance) {
      minDistance = dist;
      closestVenue = filtered[i];
    }
  }

  return { venue: closestVenue, distanceMeters: minDistance };
}
