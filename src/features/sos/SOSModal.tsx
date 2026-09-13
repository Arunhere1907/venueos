/**
 * VenueOS — Emergency & SOS Rapid Dispatch Modal
 */
import React, { useState } from 'react';
import { useSOSStore } from '../../stores/sosStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { useToastStore } from '../../stores/toastStore';
import { SOSType } from '../../types';
import { findNearestVenue } from '../../lib/routing';
import { sanitizeInput } from '../../lib/utils';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import {
  AlertOctagon,
  HeartPulse,
  Shield,
  HelpCircle,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';

export const SOSModal: React.FC = () => {
  const { isSosModalOpen, setSosModalOpen, createSOS, requests } = useSOSStore();
  const { userLocation, venues } = useNavigationStore();
  const { addToast } = useToastStore();

  const [selectedType, setSelectedType] = useState<SOSType>('medical');
  const [notes, setNotes] = useState<string>('');
  const [activeCreatedId, setActiveCreatedId] = useState<string | null>(null);

  // Find nearest first aid and security stations
  const nearestFirstAid = findNearestVenue(userLocation, venues, ['firstaid']);
  const nearestSecurity = findNearestVenue(userLocation, venues, ['security', 'helpdesk']);

  // Check if there is an active pending request from this session
  const activeRequest = requests.find(r => r.id === activeCreatedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedNotes = sanitizeInput(notes, 300);

    // Determine closest venue for reference
    const nearestAny = findNearestVenue(userLocation, venues, [
      'stage',
      'booth',
      'foodcourt',
      'helpdesk',
      'firstaid'
    ]);

    const newId = createSOS({
      type: selectedType,
      location: userLocation,
      venueId: nearestAny?.venue.id,
      venueName: nearestAny?.venue.name,
      notes: sanitizedNotes || undefined,
      reporterName: 'Attendee (Direct Mobile Dispatch)'
    });

    setActiveCreatedId(newId);
    addToast('🚨 High Priority Emergency SOS Broadcasted! Staff Dispatched.', 'warning', 5000);
  };

  const handleClose = () => {
    setSosModalOpen(false);
    // Reset form after delay
    setTimeout(() => {
      setActiveCreatedId(null);
      setNotes('');
    }, 400);
  };

  return (
    <Modal
      isOpen={isSosModalOpen}
      onClose={handleClose}
      title={activeRequest ? 'Emergency Request Active' : 'Raise Immediate Emergency SOS'}
      maxWidth="md"
    >
      {activeRequest ? (
        // Confirmation & Live Dispatch Tracking View
        <div className="space-y-4 py-2 text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-rose-600">
              Live Priority Dispatch Ticket
            </span>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
              {activeRequest.status === 'acknowledged'
                ? 'Responder En Route'
                : 'Help Request Transmitted'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ticket ID: {activeRequest.id} • Assigned to Event Operations Desk
            </p>
          </div>

          {/* Status Indicator Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
              <span
                className={`font-semibold px-2.5 py-0.5 rounded-full text-xs ${
                  activeRequest.status === 'acknowledged'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                }`}
              >
                {activeRequest.status.toUpperCase()}
              </span>
            </div>

            {activeRequest.assignedStaffName && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Assigned Staff:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{activeRequest.assignedStaffName}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Reported Location:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{activeRequest.venueName || 'Main Concourse'}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-lg text-left text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
            <strong>Stay in your current position if safe.</strong> Medical and safety staff have your coordinates. If immediate life-threatening danger exists, also call venue emergency dispatch at{' '}
            <a href="tel:+15550192831" className="font-semibold underline hover:no-underline">
              +1 (555) 019-2831
            </a>.
          </div>

          <Button variant="secondary" onClick={handleClose} fullWidth>
            Dismiss Dialog (Ticket Remains Active)
          </Button>
        </div>
      ) : (
        // New SOS Submission Form
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-lg text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
            Emergency requests are broadcast in high-priority real-time to the Event Operations Center.
          </div>

          {/* Emergency Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Emergency Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedType('medical')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                  selectedType === 'medical'
                    ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-500 text-rose-700 dark:text-rose-300 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <HeartPulse className="w-5 h-5 text-rose-500" />
                <span>Medical</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('security')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  selectedType === 'security'
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Shield className="w-5 h-5 text-indigo-600" />
                <span>Security</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('general')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  selectedType === 'general'
                    ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-500 text-amber-800 dark:text-amber-300 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <span>Urgent Help</span>
              </button>
            </div>
          </div>

          {/* Nearest Facility Quick References */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              Nearest Fixed Safety Points:
            </div>
            {nearestFirstAid && (
              <div className="flex items-center justify-between">
                <span>{nearestFirstAid.venue.name}</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">~{nearestFirstAid.distanceMeters}m away</span>
              </div>
            )}
            {nearestSecurity && (
              <div className="flex items-center justify-between">
                <span>{nearestSecurity.venue.name}</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">~{nearestSecurity.distanceMeters}m away</span>
              </div>
            )}
          </div>

          {/* Optional Details Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Brief details (Optional):
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Person unresponsive near table 4, or lost child with red backpack"
              rows={2}
              maxLength={300}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            />
          </div>

          {/* Action Buttons */}
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
              variant="danger"
              leftIcon={<Send className="w-4 h-4" />}
              className="flex-[2]"
            >
              Broadcast SOS Now
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export const SOSButton: React.FC = () => {
  const { setSosModalOpen, requests } = useSOSStore();
  const hasPending = requests.some(r => r.status === 'pending');

  return (
    <button
      onClick={() => setSosModalOpen(true)}
      aria-label="Raise emergency SOS request"
      className={`fixed bottom-6 right-6 z-40 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 font-semibold text-white text-sm transition-all transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/50 select-none ${
        hasPending
          ? 'bg-rose-600 dark:bg-rose-700 animate-bounce ring-4 ring-rose-400/50'
          : 'bg-rose-600 dark:bg-rose-700 hover:bg-rose-700 dark:hover:bg-rose-600 shadow-rose-900/30'
      }`}
    >
      <AlertOctagon className="w-5 h-5 animate-pulse" />
      <span className="tracking-wide uppercase">SOS</span>
    </button>
  );
};
