/**
 * Component Tests — Issue Report Modal
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IssueReportModal } from '../features/issues/IssueReportModal';
import { useIssueStore } from '../stores/issueStore';
import { useNavigationStore } from '../stores/navigationStore';

describe('IssueReportModal Component', () => {
  beforeEach(() => {
    // Reset stores
    useIssueStore.setState({
      issues: [],
      isReportModalOpen: false,
      selectedVenueForReport: null,
    });
    useNavigationStore.setState({
      venues: [
        {
          id: 'venue-1',
          name: 'Food Court',
          type: 'foodcourt',
          x: 40,
          y: 60,
          isAccessible: true,
          zoneId: 'zone-1',
          floor: 1,
        },
      ],
      userLocation: { x: 50, y: 50 },
    });
  });

  it('should not render when modal is closed', () => {
    useIssueStore.setState({ isReportModalOpen: false });
    render(<IssueReportModal />);
    expect(screen.queryByText(/Report a Venue Issue/i)).not.toBeInTheDocument();
  });

  it('should render when modal is open', () => {
    useIssueStore.setState({ isReportModalOpen: true });
    render(<IssueReportModal />);
    expect(screen.getByText(/Report a Venue Issue/i)).toBeInTheDocument();
  });

  it('should display all issue category options', () => {
    useIssueStore.setState({ isReportModalOpen: true });
    render(<IssueReportModal />);
    
    expect(screen.getByText(/Liquid Spill/i)).toBeInTheDocument();
    expect(screen.getByText(/Overcrowded Line/i)).toBeInTheDocument();
    expect(screen.getByText(/Broken Amenity/i)).toBeInTheDocument();
    expect(screen.getByText(/Other Operational/i)).toBeInTheDocument();
  });

  it('should require description before submission', async () => {
    useIssueStore.setState({ isReportModalOpen: true });
    render(<IssueReportModal />);
    
    const submitButton = screen.getByText(/Submit Ticket/i);
    expect(submitButton).toBeDisabled();
    
    const descriptionInput = screen.getByPlaceholderText(/Large coffee puddle/i);
    fireEvent.change(descriptionInput, { target: { value: 'Test issue description' } });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should sanitize description input on submission', async () => {
    useIssueStore.setState({ isReportModalOpen: true });
    render(<IssueReportModal />);
    
    const descriptionInput = screen.getByPlaceholderText(/Large coffee puddle/i);
    const submitButton = screen.getByText(/Submit Ticket/i);
    
    fireEvent.change(descriptionInput, { 
      target: { value: '<img src=x onerror="alert(1)">Spill near exit' } 
    });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const issues = useIssueStore.getState().issues;
      expect(issues.length).toBe(1);
      expect(issues[0]?.description).not.toContain('<img');
      expect(issues[0]?.description).not.toContain('onerror');
      expect(issues[0]?.description).toContain('Spill near exit');
    });
  });

  it('should enforce maxLength constraint on description', () => {
    useIssueStore.setState({ isReportModalOpen: true });
    render(<IssueReportModal />);
    
    const descriptionInput = screen.getByPlaceholderText(/Large coffee puddle/i) as HTMLTextAreaElement;
    expect(descriptionInput.maxLength).toBe(500);
  });

  it('should allow selecting different issue types', () => {
    useIssueStore.setState({ isReportModalOpen: true });
    render(<IssueReportModal />);
    
    const longLineButton = screen.getByText(/Overcrowded Line/i).closest('button');
    fireEvent.click(longLineButton!);
    
    expect(longLineButton?.className).toContain('indigo');
  });

  it('should show success confirmation after submission', async () => {
    useIssueStore.setState({ isReportModalOpen: true });
    render(<IssueReportModal />);
    
    const descriptionInput = screen.getByPlaceholderText(/Large coffee puddle/i);
    const submitButton = screen.getByText(/Submit Ticket/i);
    
    fireEvent.change(descriptionInput, { target: { value: 'Valid issue description' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Issue Ticket Logged/i)).toBeInTheDocument();
    });
  });
});
