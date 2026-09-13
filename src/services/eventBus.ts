/**
 * VenueOS — In-Memory Event Bus & Simulated Real-Time Service
 * Designed to mirror a WebSocket / Server-Sent Events architecture
 * for seamless production backend swap-out.
 */

type EventHandler<T = unknown> = (payload: T) => void;

class EventBus {
  private handlers: Map<string, Set<EventHandler<any>>> = new Map();

  /**
   * Subscribes to a real-time event topic
   */
  public subscribe<T>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as EventHandler<any>);

    // Return un-subscribe function
    return () => {
      const listeners = this.handlers.get(event);
      if (listeners) {
        listeners.delete(handler as EventHandler<any>);
      }
    };
  }

  /**
   * Publishes an event to all active subscribers
   */
  public publish<T>(event: string, payload: T): void {
    const listeners = this.handlers.get(event);
    if (listeners) {
      listeners.forEach(handler => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }

  /**
   * Clears all subscribers
   */
  public clear(): void {
    this.handlers.clear();
  }
}

export const eventBus = new EventBus();

// Topic Constants
export const REALTIME_TOPICS = {
  CROWD_UPDATE: 'crowd:update',
  ANNOUNCEMENT_NEW: 'announcement:new',
  SOS_NEW: 'sos:new',
  SOS_STATUS_CHANGE: 'sos:status_change',
  ISSUE_NEW: 'issue:new',
  ISSUE_STATUS_CHANGE: 'issue:status_change',
  POLL_VOTE_UPDATE: 'poll:vote_update',
  CHECK_IN_NEW: 'checkin:new',
  BUDDY_MOVE: 'buddy:move',
} as const;
