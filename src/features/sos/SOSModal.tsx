/**
 * VenueOS — Emergency & SOS Rapid Dispatch Modal
 */
import React, { useState } from 'react';
import { useSOSStore } from '../../stores/sosStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { useToastStore } from '../../stores/toastStore';
import { SOSType } from '../../types';
import { findNearestVenue } from '../../lib/routing';
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
      notes: notes.trim() || undefined,
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
            <span className="text-xs uppercase tracking-wider font-bold text-rose-600">
              Live Priority Dispatch Ticket
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              {activeRequest.status === 'acknowledged'
                ? 'Responder En Route'
                : 'Help Request Transmitted'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ticket ID: {activeRequest.id} • Assigned to Event Operations Desk
            </p>
          </div>

          {/* Status Indicator Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Status:</span>
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full ${
                  activeRequest.status === 'acknowledged'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {activeRequest.status.toUpperCase()}
              </span>
            </div>

            {activeRequest.assignedStaffName && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Assigned Staff:</span>
                <span className="font-bold text-slate-800">{activeRequest.assignedStaffName}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Reported Location:</span>
              <span className="font-semibold text-slate-800">{activeRequest.venueName || 'Main Concourse'}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-left text-xs text-rose-800 leading-relaxed">
            <strong>Stay in your current position if safe.</strong> Medical and safety staff have your coordinates. If immediate life-threatening danger exists, also call venue emergency dispatch at{' '}
            <a href="tel:+15550192831" className="font-bold underline">
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
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 leading-relaxed">
            Emergency requests are broadcast in high-priority real-time to the Event Operations Center.
          </div>

          {/* Emergency Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Emergency Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedType('medical')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                  selectedType === 'medical'
                    ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <HeartPulse className="w-5 h-5 text-rose-500" />
                <span>Medical</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('security')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                  selectedType === 'security'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Shield className="w-5 h-5 text-indigo-600" />
                <span>Security</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('general')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                  selectedType === 'general'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <span>Urgent Help</span>
              </button>
            </div>
          </div>

          {/* Nearest Facility Quick References */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              Nearest Fixed Safety Points:
            </div>
            {nearestFirstAid && (
              <div className="flex items-center justify-between">
                <span>{nearestFirstAid.venue.name}</span>
                <span className="font-medium text-slate-800">~{nearestFirstAid.distanceMeters}m away</span>
              </div>
            )}
            {nearestSecurity && (
              <div className="flex items-center justify-between">
                <span>{nearestSecurity.venue.name}</span>
                <span className="font-medium text-slate-800">~{nearestSecurity.distanceMeters}m away</span>
              </div>
            )}
          </div>

          {/* Optional Details Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Brief details (Optional):
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Person unresponsive near table 4, or lost child with red backpack"
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
      className={`fixed bottom-6 right-6 z-40 p-4 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-white transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-400 select-none ${
        hasPending
          ? 'bg-rose-600 animate-bounce ring-4 ring-rose-400/50'
          : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/30'
      }`}
    >
      <AlertOctagon className="w-6 h-6 animate-pulse" />
      <span className="text-sm tracking-wide uppercase font-extrabold pr-1">SOS</span>
    </button>
  );
};
