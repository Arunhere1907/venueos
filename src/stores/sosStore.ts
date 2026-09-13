/**
 * VenueOS — Emergency & SOS Response Store
 */
import { create } from 'zustand';
import { SOSRequest, SOSType, SOSStatus, StaffMember } from '../types';
import { INITIAL_SOS_REQUESTS, INITIAL_STAFF } from '../data/mockData';
import { eventBus, REALTIME_TOPICS } from '../services/eventBus';

interface SOSState {
  requests: SOSRequest[];
  staff: StaffMember[];
  isSosModalOpen: boolean;

  // Actions
  setSosModalOpen: (open: boolean) => void;
  createSOS: (params: {
    type: SOSType;
    location: { x: number; y: number };
    venueId?: string;
    venueName?: string;
    notes?: string;
    reporterName?: string;
  }) => string;
  acknowledgeSOS: (id: string) => void;
  resolveSOS: (id: string) => void;
  dispatchStaffToSOS: (sosId: string, staffId: string) => void;
  updateStaffStatus: (staffId: string, status: 'available' | 'dispatched') => void;
}

export const useSOSStore = create<SOSState>((set, get) => ({
  requests: INITIAL_SOS_REQUESTS,
  staff: INITIAL_STAFF,
  isSosModalOpen: false,

  setSosModalOpen: (open) => set({ isSosModalOpen: open }),

  createSOS: ({ type, location, venueId, venueName, notes, reporterName }) => {
    const newId = `sos-${Date.now()}`;
    const newRequest: SOSRequest = {
      id: newId,
      type,
      location,
      venueId,
      venueName,
      status: 'pending',
      timestamp: new Date().toISOString(),
      notes,
      reporterName: reporterName || 'Attendee (Mobile)'
    };

    set(state => ({ requests: [newRequest, ...state.requests] }));
    eventBus.publish(REALTIME_TOPICS.SOS_NEW, newRequest);
    return newId;
  },

  acknowledgeSOS: (id) => {
    set(state => ({
      requests: state.requests.map(r => (r.id === id ? { ...r, status: 'acknowledged' as SOSStatus } : r))
    }));
    eventBus.publish(REALTIME_TOPICS.SOS_STATUS_CHANGE, { id, status: 'acknowledged' });
  },

  resolveSOS: (id) => {
    const req = get().requests.find(r => r.id === id);
    if (req?.assignedStaffId) {
      // Free up assigned staff
      get().updateStaffStatus(req.assignedStaffId, 'available');
    }

    set(state => ({
      requests: state.requests.map(r => (r.id === id ? { ...r, status: 'resolved' as SOSStatus } : r))
    }));
    eventBus.publish(REALTIME_TOPICS.SOS_STATUS_CHANGE, { id, status: 'resolved' });
  },

  dispatchStaffToSOS: (sosId, staffId) => {
    const staffMember = get().staff.find(s => s.id === staffId);
    if (!staffMember) return;

    set(state => ({
      // Mark staff dispatched
      staff: state.staff.map(s =>
        s.id === staffId ? { ...s, status: 'dispatched', dispatchedToSOSId: sosId } : s
      ),
      // Assign to SOS request & mark acknowledged if still pending
      requests: state.requests.map(r =>
        r.id === sosId
          ? {
              ...r,
              status: r.status === 'pending' ? 'acknowledged' : r.status,
              assignedStaffId: staffId,
              assignedStaffName: staffMember.name
            }
          : r
      )
    }));

    eventBus.publish(REALTIME_TOPICS.SOS_STATUS_CHANGE, {
      id: sosId,
      status: 'acknowledged',
      assignedStaffId: staffId
    });
  },

  updateStaffStatus: (staffId, status) => {
    set(state => ({
      staff: state.staff.map(s => (s.id === staffId ? { ...s, status, dispatchedToSOSId: undefined } : s))
    }));
  }
}));
