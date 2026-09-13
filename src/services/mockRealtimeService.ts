/**
 * VenueOS — Background Mock Real-Time Simulation Engine
 * Periodically drives crowd fluctuations and provides instant triggers for evaluation.
 */
import { useCrowdStore } from '../stores/crowdStore';
import { useAnnouncementStore } from '../stores/announcementsStore';
import { useSOSStore } from '../stores/sosStore';
import { useIssueStore } from '../stores/issueStore';

class MockRealtimeService {
  private timerId: number | null = null;
  private isRunning: boolean = false;

  /**
   * Starts periodic background simulation
   */
  public start(intervalMs: number = 25000): void {
    if (this.isRunning) return;
    this.isRunning = true;

    if (typeof window !== 'undefined') {
      this.timerId = window.setInterval(() => {
        this.tick();
      }, intervalMs);
    }
  }

  /**
   * Stops simulation
   */
  public stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isRunning = false;
  }

  /**
   * Executes one simulation tick
   */
  public tick(): void {
    // 1. Slightly adjust one zone's crowd
    useCrowdStore.getState().simulateCrowdTick();
  }

  /**
   * Manual trigger: Simulates a sudden crowd surge in the East Expo Hall
   */
  public triggerCrowdSurge(): void {
    useCrowdStore.getState().updateZoneCrowd('zone-east', 'high', 85);
    useAnnouncementStore.getState().broadcastAnnouncement({
      title: 'High Congestion: East Expo Hall at 94% Capacity',
      body: 'Heavy queue formed near AI Innovation Pavilion. Automated crowd routing suggests alternative path via West Concourse.',
      severity: 'warning',
      targetZoneId: 'zone-east'
    });
  }

  /**
   * Manual trigger: Simulates an urgent incoming SOS request
   */
  public triggerSimulatedSOS(): void {
    useSOSStore.getState().createSOS({
      type: 'medical',
      location: { x: 38, y: 70 },
      venueId: 'venue-stage-c',
      venueName: 'Workshop Lab C',
      notes: 'Attendee fainted during technical workshop. Paramedic requested immediately.',
      reporterName: 'Attendee (Simulated Emergency)'
    });
  }

  /**
   * Manual trigger: Simulates a new attendee issue report
   */
  public triggerSimulatedIssue(): void {
    useIssueStore.getState().reportIssue({
      type: 'spill',
      location: { x: 45, y: 85 },
      venueId: 'venue-food-garden',
      venueName: 'Artisan Food Plaza',
      description: 'Water dispenser leakage causing slippery floor tiles near exit ramp.',
      reporterName: 'Attendee #402'
    });
  }

  /**
   * Manual trigger: Broadcasts a general announcement
   */
  public triggerSimulatedAnnouncement(): void {
    const titles = [
      'Breakout Stage B Panel Starting in 10 Minutes',
      'Complimentary Cold Brew Available at Artisan Food Plaza',
      'Quiet Sensory Decompression Room Available at East Wing'
    ];
    const bodies = [
      'Universal Accessibility & Neurodiversity panel begins shortly. Step-free front seating reserved.',
      'Refuel between sessions with complimentary refreshments sponsored by Apex Dynamics.',
      'Dim lighting, noise-canceling headsets, and soft seating are open in East Wing Room 104.'
    ];

    const idx = Math.floor(Math.random() * titles.length);
    useAnnouncementStore.getState().broadcastAnnouncement({
      title: titles[idx],
      body: bodies[idx],
      severity: 'info'
    });
  }
}

export const mockRealtimeService = new MockRealtimeService();
