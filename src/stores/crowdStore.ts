/**
 * VenueOS — Crowd Coordination & Zone Capacity Store
 */
import { create } from 'zustand';
import { Zone, CrowdLevel, CrowdTrend } from '../types';
import { INITIAL_ZONES } from '../data/mockData';
import { eventBus, REALTIME_TOPICS } from '../services/eventBus';

interface CrowdState {
  zones: Zone[];
  selectedZoneId: string | null;
  
  // Actions
  selectZone: (id: string | null) => void;
  updateZoneCrowd: (zoneId: string, level: CrowdLevel, countDelta?: number) => void;
  simulateCrowdTick: () => void;
  getAlternateLowCrowdZone: (currentZoneId: string) => Zone | null;
}

export const useCrowdStore = create<CrowdState>((set, get) => ({
  zones: INITIAL_ZONES,
  selectedZoneId: null,

  selectZone: (id) => set({ selectedZoneId: id }),

  updateZoneCrowd: (zoneId, level, countDelta = 0) => {
    set(state => ({
      zones: state.zones.map(zone => {
        if (zone.id !== zoneId) return zone;

        const newHistory = [...zone.history.slice(-4), level];
        // Calculate trend based on history
        let trend: CrowdTrend = 'steady';
        const last = newHistory[newHistory.length - 1];
        const prev = newHistory[newHistory.length - 2];

        const levelScore = (l: CrowdLevel) => (l === 'high' ? 3 : l === 'medium' ? 2 : 1);
        if (levelScore(last) > levelScore(prev)) {
          trend = 'rising';
        } else if (levelScore(last) < levelScore(prev)) {
          trend = 'falling';
        }

        // Predicted surge if medium and rising, or already high
        const predictedSurge = (level === 'medium' && trend === 'rising') || level === 'high';

        const updatedCount = Math.max(10, Math.min(zone.maxCapacity, zone.currentCount + countDelta));

        const updated: Zone = {
          ...zone,
          crowdLevel: level,
          currentCount: updatedCount,
          history: newHistory,
          trend,
          predictedSurge,
          updatedAt: new Date().toISOString()
        };

        return updated;
      })
    }));

    eventBus.publish(REALTIME_TOPICS.CROWD_UPDATE, { zoneId, level });
  },

  simulateCrowdTick: () => {
    const { zones } = get();
    // Randomly fluctuate one zone slightly
    const targetIdx = Math.floor(Math.random() * zones.length);
    const target = zones[targetIdx];
    
    // Probabilistic transition
    const levels: CrowdLevel[] = ['low', 'medium', 'high'];
    const currentIdx = levels.indexOf(target.crowdLevel);
    
    // Tend to fluctuate within +/- 1 step
    const delta = Math.random() > 0.5 ? 1 : -1;
    const newIdx = Math.max(0, Math.min(2, currentIdx + delta));
    const newLevel = levels[newIdx];
    const countChange = delta * Math.floor(Math.random() * 40 + 15);

    get().updateZoneCrowd(target.id, newLevel, countChange);
  },

  getAlternateLowCrowdZone: (currentZoneId: string) => {
    const { zones } = get();
    const otherZones = zones.filter(z => z.id !== currentZoneId);
    // Find zone with 'low' crowdLevel, or least occupied
    const lowZone = otherZones.find(z => z.crowdLevel === 'low');
    if (lowZone) return lowZone;
    const medZone = otherZones.find(z => z.crowdLevel === 'medium' && z.trend !== 'rising');
    return medZone || otherZones[0] || null;
  }
}));
