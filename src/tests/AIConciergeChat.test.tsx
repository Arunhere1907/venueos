/**
 * Component Tests — AI Concierge Chat
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIConciergeChat } from '../features/concierge/AIConciergeChat';
import { useNavigationStore } from '../stores/navigationStore';
import { useScheduleStore } from '../stores/scheduleStore';
import { useCrowdStore } from '../stores/crowdStore';

describe('AIConciergeChat Component', () => {
  beforeEach(() => {
    // Setup mock data
    useNavigationStore.setState({
      venues: [
        {
          id: 'venue-restroom',
          name: 'North Restrooms',
          type: 'restroom',
          x: 30,
          y: 40,
          isAccessible: true,
          zoneId: 'zone-1',
        },
        {
          id: 'venue-food',
          name: 'Food Plaza',
          type: 'foodcourt',
          x: 50,
          y: 50,
          isAccessible: true,
          zoneId: 'zone-2',
        },
      ],
    });

    useScheduleStore.setState({
      sessions: [
        {
          id: 'session-1',
          title: 'AI Workshop',
          description: 'Learn about AI',
          speaker: 'John Doe',
          speakerRole: 'Engineer',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          venueId: 'venue-1',
          tags: ['AI', 'Workshop'],
        },
      ],
    });

    useCrowdStore.setState({
      zones: [
        {
          id: 'zone-1',
          name: 'East Hall',
          description: 'Main area',
          crowdLevel: 'high',
          updatedAt: new Date().toISOString(),
          history: ['high'],
          trend: 'steady',
          predictedSurge: true,
          currentCount: 200,
          maxCapacity: 250,
        },
      ],
    });
  });

  it('should render chat trigger button', () => {
    render(<AIConciergeChat />);
    expect(screen.getByLabelText(/Open AI Event Concierge/i)).toBeInTheDocument();
  });

  it('should open chat when trigger is clicked', () => {
    render(<AIConciergeChat />);
    const triggerButton = screen.getByLabelText(/Open AI Event Concierge/i);
    fireEvent.click(triggerButton);
    
    expect(screen.getByText(/VenueOS Concierge/i)).toBeInTheDocument();
    expect(screen.getByText(/Instant Event Intelligence/i)).toBeInTheDocument();
  });

  it('should display welcome message on open', () => {
    render(<AIConciergeChat />);
    const triggerButton = screen.getByLabelText(/Open AI Event Concierge/i);
    fireEvent.click(triggerButton);
    
    expect(screen.getByText(/Hello! I'm your VenueOS Smart Concierge/i)).toBeInTheDocument();
  });

  it('should sanitize user input before processing', async () => {
    render(<AIConciergeChat />);
    const triggerButton = screen.getByLabelText(/Open AI Event Concierge/i);
    fireEvent.click(triggerButton);
    
    const input = screen.getByPlaceholderText(/Ask anything about the venue/i);
    const sendButton = screen.getByRole('button', { name: '' }); // Send button has no text, just icon
    
    fireEvent.change(input, { target: { value: '<script>alert("xss")</script>Where is restroom?' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      const userMessage = screen.queryByText(/alert/i);
      expect(userMessage).not.toBeInTheDocument();
    });
  });

  it('should respond to restroom query', async () => {
    render(<AIConciergeChat />);
    fireEvent.click(screen.getByLabelText(/Open AI Event Concierge/i));
    
    const input = screen.getByPlaceholderText(/Ask anything about the venue/i);
    fireEvent.change(input, { target: { value: 'Where is the restroom?' } });
    fireEvent.submit(input.closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByText(/restroom/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should respond to AI session query', async () => {
    render(<AIConciergeChat />);
    fireEvent.click(screen.getByLabelText(/Open AI Event Concierge/i));
    
    const input = screen.getByPlaceholderText(/Ask anything about the venue/i);
    fireEvent.change(input, { target: { value: 'What AI sessions are available?' } });
    fireEvent.submit(input.closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByText(/AI/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should respond to crowd query', async () => {
    render(<AIConciergeChat />);
    fireEvent.click(screen.getByLabelText(/Open AI Event Concierge/i));
    
    const input = screen.getByPlaceholderText(/Ask anything about the venue/i);
    fireEvent.change(input, { target: { value: 'How crowded is it?' } });
    fireEvent.submit(input.closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByText(/crowd/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should enforce maxLength on input field', () => {
    render(<AIConciergeChat />);
    fireEvent.click(screen.getByLabelText(/Open AI Event Concierge/i));
    
    const input = screen.getByPlaceholderText(/Ask anything about the venue/i) as HTMLInputElement;
    expect(input.maxLength).toBe(500);
  });

  it('should display quick question buttons', () => {
    render(<AIConciergeChat />);
    fireEvent.click(screen.getByLabelText(/Open AI Event Concierge/i));
    
    expect(screen.getByText(/Where is the nearest restroom?/i)).toBeInTheDocument();
    expect(screen.getByText(/What AI sessions are scheduled?/i)).toBeInTheDocument();
  });

  it('should close chat when X button is clicked', () => {
    render(<AIConciergeChat />);
    fireEvent.click(screen.getByLabelText(/Open AI Event Concierge/i));
    
    const closeButton = screen.getByRole('button', { name: '' }); // X button
    const xButtons = screen.getAllByRole('button');
    const closeBtn = xButtons.find(btn => btn.querySelector('svg'));
    
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(screen.queryByText(/VenueOS Concierge/i)).not.toBeInTheDocument();
    }
  });
});
