/**
 * VenueOS — Minimal SOS Modal & Floating Button
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
import { AlertOctagon, HeartPulse, Shield, HelpCircle, MapPin, Send } from 'lucide-react';

/* ─── Type selector card ─────────────────── */
const SOS_TYPES: { id: SOSType; label: string; icon: React.FC<{ className?: string }>; color: string; activeClasses: string }[] = [
  {
    id: 'medical',
    label: 'Medical',
    icon: HeartPulse,
    color: 'text-[#dc2626]',
    activeClasses: 'border-[#dc2626] bg-[#fff5f5] text-[#dc2626]',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    color: 'text-[#4f46e5]',
    activeClasses: 'border-[#4f46e5] bg-[#f0f0ff] text-[#4f46e5]',
  },
  {
    id: 'general',
    label: 'Help',
    icon: HelpCircle,
    color: 'text-[#b45309]',
    activeClasses: 'border-[#b45309] bg-[#fffbeb] text-[#b45309]',
  },
];

/* ─── Modal ──────────────────────────────── */
export const SOSModal: React.FC = () => {
  const { isSosModalOpen, setSosModalOpen, createSOS, requests } = useSOSStore();
  const { userLocation, venues } = useNavigationStore();
  const { addToast } = useToastStore();

  const [selectedType, setSelectedType] = useState<SOSType>('medical');
  const [notes, setNotes] = useState('');
  const [activeCreatedId, setActiveCreatedId] = useState<string | null>(null);

  const nearestFirstAid = findNearestVenue(userLocation, venues, ['firstaid']);
  const nearestSecurity = findNearestVenue(userLocation, venues, ['security', 'helpdesk']);
  const activeRequest   = requests.find(r => r.id === activeCreatedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeInput(notes, 300);
    const nearest = findNearestVenue(userLocation, venues, ['stage', 'booth', 'foodcourt', 'helpdesk', 'firstaid']);
    const id = createSOS({
      type: selectedType,
      location: userLocation,
      venueId: nearest?.venue.id,
      venueName: nearest?.venue.name,
      notes: sanitized || undefined,
      reporterName: 'Attendee (Direct Mobile Dispatch)',
    });
    setActiveCreatedId(id);
    addToast('Emergency SOS dispatched. Staff alerted.', 'warning', 5000);
  };

  const handleClose = () => {
    setSosModalOpen(false);
    setTimeout(() => { setActiveCreatedId(null); setNotes(''); }, 400);
  };

  return (
    <Modal
      isOpen={isSosModalOpen}
      onClose={handleClose}
      title={activeRequest ? 'Emergency Request Active' : 'Raise Emergency SOS'}
      maxWidth="md"
    >
      {activeRequest ? (
        /* ── Confirmation view ──────────────────── */
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#dc2626] flex items-center justify-center mx-auto">
            <AlertOctagon className="w-6 h-6 text-[#dc2626]" />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#dc2626]">
              Live dispatch ticket
            </p>
            <h3 className="text-base font-semibold text-[#0a0a0a] mt-1">
              {activeRequest.status === 'acknowledged' ? 'Responder en route' : 'Help request transmitted'}
            </h3>
            <p className="text-xs text-[#6b6b6b] mt-0.5">
              Ticket {activeRequest.id}
            </p>
          </div>

          {/* Status table */}
          <div className="rounded-xl border border-[#e8e8e8] divide-y divide-[#f0f0f0] text-left text-xs">
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[#6b6b6b]">Status</span>
              <span className={`font-semibold ${activeRequest.status === 'acknowledged' ? 'text-[#16a34a]' : 'text-[#b45309]'}`}>
                {activeRequest.status.charAt(0).toUpperCase() + activeRequest.status.slice(1)}
              </span>
            </div>
            {activeRequest.assignedStaffName && (
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[#6b6b6b]">Assigned staff</span>
                <span className="font-medium text-[#0a0a0a]">{activeRequest.assignedStaffName}</span>
              </div>
            )}
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[#6b6b6b]">Location</span>
              <span className="font-medium text-[#0a0a0a]">{activeRequest.venueName || 'Main Concourse'}</span>
            </div>
          </div>

          {/* Instructions */}
          <p className="text-xs text-[#3a3a3a] bg-[#f7f7f7] rounded-xl px-4 py-3 text-left leading-relaxed">
            <strong>Stay in your current position if safe.</strong> Staff have your coordinates.
            If in immediate danger, call{' '}
            <a href="tel:+15550192831" className="font-semibold text-[#4f46e5] underline">+1 (555) 019-2831</a>.
          </p>

          <Button variant="outline" onClick={handleClose} fullWidth>
            Dismiss (ticket stays active)
          </Button>
        </div>
      ) : (
        /* ── Request form ───────────────────────── */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Alert */}
          <p className="text-xs text-[#3a3a3a] bg-[#f7f7f7] rounded-xl px-4 py-3 leading-relaxed">
            Emergency requests are broadcast in real-time to the Event Operations Center.
          </p>

          {/* Type picker */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b6b6b] mb-2">
              Emergency type
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SOS_TYPES.map(({ id, label, icon: Icon, color, activeClasses }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedType(id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] ${
                    selectedType === id
                      ? activeClasses
                      : 'border-[#e8e8e8] text-[#6b6b6b] hover:border-[#d4d4d4] hover:bg-[#f7f7f7]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${selectedType === id ? '' : color}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Nearest facilities */}
          {(nearestFirstAid || nearestSecurity) && (
            <div className="rounded-xl border border-[#e8e8e8] divide-y divide-[#f0f0f0] text-xs">
              <div className="px-4 py-2 flex items-center gap-1.5 text-[#6b6b6b] font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#4f46e5]" />
                Nearest safety points
              </div>
              {nearestFirstAid && (
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-[#3a3a3a]">{nearestFirstAid.venue.name}</span>
                  <span className="text-[#6b6b6b]">~{nearestFirstAid.distanceMeters}m</span>
                </div>
              )}
              {nearestSecurity && (
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-[#3a3a3a]">{nearestSecurity.venue.name}</span>
                  <span className="text-[#6b6b6b]">~{nearestSecurity.distanceMeters}m</span>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-wider mb-1.5">
              Details (optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Person unresponsive near table 4, or lost child with red backpack"
              rows={2}
              maxLength={300}
              className="w-full px-3 py-2.5 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#0a0a0a] placeholder:text-[#9a9a9a] resize-none focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              leftIcon={<Send className="w-3.5 h-3.5" />}
              className="flex-[2]"
            >
              Broadcast SOS
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

/* ─── Floating SOS button ────────────────── */
export const SOSButton: React.FC = () => {
  const { setSosModalOpen, requests } = useSOSStore();
  const hasPending = requests.some(r => r.status === 'pending');

  return (
    <button
      onClick={() => setSosModalOpen(true)}
      aria-label="Raise emergency SOS"
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-[#dc2626]/40 select-none ${
        hasPending
          ? 'bg-[#dc2626] ring-4 ring-[#dc2626]/30 animate-pulse'
          : 'bg-[#dc2626] hover:bg-[#b91c1c]'
      }`}
    >
      <AlertOctagon className="w-4 h-4" />
      <span className="tracking-wide">SOS</span>
    </button>
  );
};
