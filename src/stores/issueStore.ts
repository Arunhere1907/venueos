/**
 * VenueOS — In-App Issue Reporting Store
 */
import { create } from 'zustand';
import { IssueReport, IssueType, IssueStatus, Venue } from '../types';
import { INITIAL_ISSUES } from '../data/mockData';
import { eventBus, REALTIME_TOPICS } from '../services/eventBus';

interface IssueState {
  issues: IssueReport[];
  isReportModalOpen: boolean;
  selectedVenueForReport: Venue | null;

  // Actions
  openReportModal: (venue?: Venue | null) => void;
  closeReportModal: () => void;
  reportIssue: (params: {
    type: IssueType;
    location: { x: number; y: number };
    venueId?: string;
    venueName?: string;
    description: string;
    reporterName?: string;
  }) => string;
  updateIssueStatus: (id: string, status: IssueStatus) => void;
}

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: INITIAL_ISSUES,
  isReportModalOpen: false,
  selectedVenueForReport: null,

  openReportModal: (venue = null) =>
    set({ isReportModalOpen: true, selectedVenueForReport: venue }),

  closeReportModal: () =>
    set({ isReportModalOpen: false, selectedVenueForReport: null }),

  reportIssue: ({ type, location, venueId, venueName, description, reporterName }) => {
    const newId = `issue-${Date.now()}`;
    const newIssue: IssueReport = {
      id: newId,
      type,
      location,
      venueId,
      venueName,
      description,
      status: 'open',
      timestamp: new Date().toISOString(),
      reporterName: reporterName || 'Attendee (In-App)'
    };

    set(state => ({ issues: [newIssue, ...state.issues] }));
    eventBus.publish(REALTIME_TOPICS.ISSUE_NEW, newIssue);
    return newId;
  },

  updateIssueStatus: (id, status) => {
    set(state => ({
      issues: state.issues.map(issue =>
        issue.id === id ? { ...issue, status } : issue
      )
    }));
    eventBus.publish(REALTIME_TOPICS.ISSUE_STATUS_CHANGE, { id, status });
  }
}));
