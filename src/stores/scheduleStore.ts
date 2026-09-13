/**
 * VenueOS — Schedule & Session Discovery Store
 */
import { create } from 'zustand';
import { Session, PollQuestion } from '../types';
import { INITIAL_SESSIONS, INITIAL_POLLS } from '../data/mockData';
import { eventBus, REALTIME_TOPICS } from '../services/eventBus';

interface ScheduleState {
  sessions: Session[];
  polls: PollQuestion[];
  selectedTag: string | null;
  searchQuery: string;
  selectedSessionId: string | null;

  // Actions
  setSelectedTag: (tag: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSelectedSessionId: (id: string | null) => void;

  // Poll voting
  votePoll: (pollId: string, optionIndex: number) => void;
  addPoll: (poll: Omit<PollQuestion, 'id' | 'votes'>) => void;

  // Organizer CRUD
  addSession: (session: Omit<Session, 'id'>) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  sessions: INITIAL_SESSIONS,
  polls: INITIAL_POLLS,
  selectedTag: null,
  searchQuery: '',
  selectedSessionId: null,

  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedSessionId: (id) => set({ selectedSessionId: id }),

  votePoll: (pollId, optionIndex) => {
    set(state => ({
      polls: state.polls.map(poll => {
        if (poll.id !== pollId) return poll;
        // If already voted, don't double vote or update
        if (poll.userVotedIndex !== undefined) return poll;
        const newVotes = [...(poll.votes || new Array(poll.options?.length || 0).fill(0))];
        newVotes[optionIndex] = (newVotes[optionIndex] || 0) + 1;
        return {
          ...poll,
          votes: newVotes,
          userVotedIndex: optionIndex
        };
      })
    }));

    eventBus.publish(REALTIME_TOPICS.POLL_VOTE_UPDATE, { pollId, optionIndex });
  },

  addPoll: (pollData) => {
    const newPoll: PollQuestion = {
      ...pollData,
      id: `poll-${Date.now()}`,
      votes: new Array(pollData.options.length).fill(0)
    };
    set(state => ({ polls: [...state.polls, newPoll] }));
  },

  addSession: (sessionData) => {
    const newSession: Session = {
      ...sessionData,
      id: `sess-${Date.now()}`
    };
    set(state => ({ sessions: [...state.sessions, newSession] }));
  },

  updateSession: (id, updates) => {
    set(state => ({
      sessions: state.sessions.map(s => (s.id === id ? { ...s, ...updates } : s))
    }));
  },

  deleteSession: (id) => {
    set(state => ({
      sessions: state.sessions.filter(s => s.id !== id),
      selectedSessionId: state.selectedSessionId === id ? null : state.selectedSessionId
    }));
  }
}));
