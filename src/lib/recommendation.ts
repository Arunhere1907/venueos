/**
 * Pure recommendation scoring engine
 * Calculates interest overlap, popularity bonus, and ranking.
 */
import { Session } from '../types';

export interface ScoredSession {
  session: Session;
  score: number;
  matchingTags: string[];
}

/**
 * Computes recommendation score between attendee interests and session tags.
 * Pure function: strictly deterministic, no external side-effects.
 */
export function calculateSessionScore(session: Session, attendeeInterests: string[]): ScoredSession {
  if (!attendeeInterests.length) {
    return {
      session,
      score: session.isPopular ? 1 : 0,
      matchingTags: []
    };
  }

  const normalizedInterests = attendeeInterests.map(i => i.trim().toLowerCase());
  const matchingTags = session.tags.filter(tag =>
    normalizedInterests.includes(tag.trim().toLowerCase())
  );

  // Score calculation:
  // - 10 points per matching tag
  // - 3 bonus points if marked popular
  // - Normalized against max possible
  let rawScore = matchingTags.length * 10;
  if (session.isPopular) {
    rawScore += 3;
  }

  return {
    session,
    score: rawScore,
    matchingTags
  };
}

/**
 * Returns sorted sessions ranked by recommendation score descending.
 */
export function rankSessionsByInterests(sessions: Session[], attendeeInterests: string[]): ScoredSession[] {
  return sessions
    .map(session => calculateSessionScore(session, attendeeInterests))
    .sort((a, b) => b.score - a.score);
}
