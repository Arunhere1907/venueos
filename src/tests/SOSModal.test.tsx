/**
 * Component Tests — SOS Emergency Modal
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SOSModal } from '../features/sos/SOSModal';
import { useSOSStore } from '../stores/sosStore';
import { useNavigationStore } from '../stores/navigationStore';
import { useToastStore } from '../stores/toastStore';

describe('SOSModal Component', () => {
  beforeEach(() => {
    // Reset stores before each test
    useSOSStore.setState({
      requests: [],
      isSosModalOpen: false,
    });
    useNavigationStore.setState({
      venues: [
        {
          id: 'venue-1',
          name: 'Main Stage',
          type: 'stage',
          x: 50,
          y: 50,
          isAccessible: true,
          zoneId: 'zone-1',
        },
      ],
      userLocation: { x: 50, y: 50 },
    });
  });

  it('should not render when modal is closed', () => {
    useSOSStore.setState({ isSosModalOpen: false });
    render(<SOSModal />);
    expect(screen.queryByText(/Emergency/i)).not.toBeInTheDocument();
  });

  it('should render when modal is open', () => {
    useSOSStore.setState({ isSosModalOpen: true });
    render(<SOSModal />);
    expect(screen.getByText(/Raise Immediate Emergency SOS/i)).toBeInTheDocument();
  });

  it('should display emergency type options', () => {
    useSOSStore.setState({ isSosModalOpen: true });
    render(<SOSModal />);
    expect(screen.getByText(/Medical/i)).toBeInTheDocument();
    expect(screen.getByText(/Security/i)).toBeInTheDocument();
    expect(screen.getByText(/Urgent Help/i)).toBeInTheDocument();
  });

  it('should allow selecting emergency type', () => {
    useSOSStore.setState({ isSosModalOpen: true });
    render(<SOSModal />);
    
    const securityButton = screen.getByText(/Security/i).closest('button');
    expect(securityButton).toBeInTheDocument();
    fireEvent.click(securityButton!);
    
    // Button should have active styling
    expect(securityButton?.className).toContain('indigo');
  });

  it('should submit SOS request with sanitized notes', async () => {
    useSOSStore.setState({ isSosModalOpen: true });
    render(<SOSModal />);
    
    const notesInput = screen.getByPlaceholderText(/Brief details/i) as HTMLTextAreaElement;
    const submitButton = screen.getByText(/Broadcast SOS Now/i);
    
    // Try to submit with script tag (should be sanitized)
    fireEvent.change(notesInput, { target: { value: '<script>alert("xss")</script>Person injured' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const requests = useSOSStore.getState().requests;
      expect(requests.length).toBe(1);
      expect(requests[0]?.notes).not.toContain('<script>');
      expect(requests[0]?.notes).toContain('Person injured');
    });
  });

  it('should enforce maxLength on notes textarea', () => {
    useSOSStore.setState({ isSosModalOpen: true });
    render(<SOSModal />);
    
    const notesInput = screen.getByPlaceholderText(/Brief details/i) as HTMLTextAreaElement;
    expect(notesInput.maxLength).toBe(300);
  });

  it('should close modal when cancel is clicked', () => {
    useSOSStore.setState({ isSosModalOpen: true });
    render(<SOSModal />);
    
    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);
    
    expect(useSOSStore.getState().isSosModalOpen).toBe(false);
  });
});
