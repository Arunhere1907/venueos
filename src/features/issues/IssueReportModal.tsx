/**
 * VenueOS — In-App Issue Reporting Modal
 */
import React, { useState } from 'react';
import { useIssueStore } from '../../stores/issueStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { useToastStore } from '../../stores/toastStore';
import { IssueType } from '../../types';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { getIssueTypeInfo, sanitizeInput } from '../../lib/utils';
import {
  AlertCircle,
  Droplets,
  Users,
  Wrench,
  HelpCircle,
  CheckCircle2,
  MapPin,
  Send
} from 'lucide-react';

export const IssueReportModal: React.FC = () => {
  const { isReportModalOpen, closeReportModal, selectedVenueForReport, reportIssue } = useIssueStore();
  const { userLocation, venues } = useNavigationStore();
  const { addToast } = useToastStore();

  const [issueType, setIssueType] = useState<IssueType>('spill');
  const [description, setDescription] = useState<string>('');
  const [selectedVenueId, setSelectedVenueId] = useState<string>(
    selectedVenueForReport ? selectedVenueForReport.id : (venues[0]?.id || '')
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedDescription = sanitizeInput(description, 500);
    
    if (!sanitizedDescription.trim()) {
      addToast('Please describe the issue before submitting.', 'error');
      return;
    }

    const targetVenue = venues.find(v => v.id === selectedVenueId);

    reportIssue({
      type: issueType,
      location: targetVenue ? { x: targetVenue.x, y: targetVenue.y } : userLocation,
      venueId: targetVenue?.id,
      venueName: targetVenue?.name,
      description: sanitizedDescription,
      reporterName: 'Attendee (Mobile App)'
    });

    setIsSuccess(true);
    addToast('Issue ticket logged — facilities staff have been notified.', 'success');
    setTimeout(() => {
      setIsSuccess(false);
      setDescription('');
      closeReportModal();
    }, 1800);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setDescription('');
    closeReportModal();
  };

  return (
    <Modal
      isOpen={isReportModalOpen}
      onClose={handleClose}
      title="Report a Venue Issue"
      description="Report spills, queue blockages, or broken amenities directly to facilities staff."
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Issue Ticket Logged</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Thank you! Facilities and ground marshals have received your report in the operations queue.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Issue Category Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Issue Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'spill', label: 'Liquid Spill / Hazard', icon: Droplets },
                { type: 'long_line', label: 'Overcrowded Line', icon: Users },
                { type: 'broken_facility', label: 'Broken Amenity / Door', icon: Wrench },
                { type: 'other', label: 'Other Operational', icon: HelpCircle }
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setIssueType(type as IssueType)}
                  className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    issueType === type
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-indigo-500" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Location / Venue Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Specific Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedVenueId}
                onChange={(e) => setSelectedVenueId(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} (Floor {v.floor || 1})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Description of the Issue
            </label>
            <textarea
              required
              rows={3}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Large coffee puddle near table 12, slip hazard for wheelchairs."
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Send className="w-4 h-4" />}
              className="flex-[2]"
              disabled={!description.trim()}
            >
              Submit Ticket
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
