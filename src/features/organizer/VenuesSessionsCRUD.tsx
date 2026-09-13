/**
 * VenueOS — Organizer CRUD Management for Venues & Sessions
 */
import React, { useState } from 'react';
import { useNavigationStore } from '../../stores/navigationStore';
import { useScheduleStore } from '../../stores/scheduleStore';
import { useCrowdStore } from '../../stores/crowdStore';
import { useToastStore } from '../../stores/toastStore';
import { Venue, Session, VenueType } from '../../types';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { getVenueTypeInfo, formatTimeRange } from '../../lib/utils';
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Accessibility,
  Check,
  AlertTriangle
} from 'lucide-react';

export const VenuesSessionsCRUD: React.FC = () => {
  const { venues, addVenue, updateVenue, deleteVenue } = useNavigationStore();
  const { sessions, addSession, updateSession, deleteSession } = useScheduleStore();
  const { zones } = useCrowdStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'venues' | 'sessions'>('venues');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string; type: 'venue' | 'session' } | null>(null);

  // Venue Edit/Create Modal
  const [venueModalOpen, setVenueModalOpen] = useState<boolean>(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [venueForm, setVenueForm] = useState<{
    name: string;
    type: VenueType;
    zoneId: string;
    floor: number;
    capacity: number;
    isAccessible: boolean;
    description: string;
    x: number;
    y: number;
  }>({
    name: '',
    type: 'stage',
    zoneId: zones[0]?.id || 'zone-north',
    floor: 1,
    capacity: 250,
    isAccessible: true,
    description: '',
    x: 50,
    y: 50
  });

  // Session Edit/Create Modal
  const [sessionModalOpen, setSessionModalOpen] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionForm, setSessionForm] = useState<{
    title: string;
    description: string;
    speaker: string;
    speakerRole: string;
    startTime: string;
    endTime: string;
    venueId: string;
    tags: string;
    capacity: number;
  }>({
    title: '',
    description: '',
    speaker: '',
    speakerRole: '',
    startTime: '2026-09-13T10:00:00.000Z',
    endTime: '2026-09-13T11:00:00.000Z',
    venueId: venues[0]?.id || '',
    tags: 'AI, Keynote',
    capacity: 300
  });

  // Open Venue Add
  const handleOpenAddVenue = () => {
    setEditingVenue(null);
    setVenueForm({
      name: '',
      type: 'booth',
      zoneId: zones[0]?.id || 'zone-north',
      floor: 1,
      capacity: 100,
      isAccessible: true,
      description: '',
      x: Math.floor(Math.random() * 50 + 25),
      y: Math.floor(Math.random() * 50 + 25)
    });
    setVenueModalOpen(true);
  };

  // Open Venue Edit
  const handleOpenEditVenue = (v: Venue) => {
    setEditingVenue(v);
    setVenueForm({
      name: v.name,
      type: v.type,
      zoneId: v.zoneId,
      floor: v.floor || 1,
      capacity: v.capacity || 100,
      isAccessible: v.isAccessible,
      description: v.description || '',
      x: v.x,
      y: v.y
    });
    setVenueModalOpen(true);
  };

  const handleSaveVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueForm.name.trim()) return;

    if (editingVenue) {
      updateVenue(editingVenue.id, {
        name: venueForm.name.trim(),
        type: venueForm.type,
        zoneId: venueForm.zoneId,
        floor: Number(venueForm.floor),
        capacity: Number(venueForm.capacity),
        isAccessible: venueForm.isAccessible,
        description: venueForm.description.trim(),
        x: Number(venueForm.x),
        y: Number(venueForm.y)
      });
      addToast(`Venue "${venueForm.name}" updated successfully.`, 'success');
    } else {
      addVenue({
        name: venueForm.name.trim(),
        type: venueForm.type,
        zoneId: venueForm.zoneId,
        floor: Number(venueForm.floor),
        capacity: Number(venueForm.capacity),
        isAccessible: venueForm.isAccessible,
        description: venueForm.description.trim(),
        x: Number(venueForm.x),
        y: Number(venueForm.y)
      });
      addToast(`New venue "${venueForm.name}" created!`, 'success');
    }
    setVenueModalOpen(false);
  };

  const handleExecuteDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'venue') {
      deleteVenue(deleteConfirm.id);
      addToast(`Venue "${deleteConfirm.name}" deleted.`, 'info');
    } else {
      deleteSession(deleteConfirm.id);
      addToast(`Session "${deleteConfirm.name}" deleted.`, 'info');
    }
    setDeleteConfirm(null);
  };

  // Open Session Add
  const handleOpenAddSession = () => {
    setEditingSession(null);
    setSessionForm({
      title: '',
      description: '',
      speaker: '',
      speakerRole: '',
      startTime: '2026-09-13T11:00:00.000Z',
      endTime: '2026-09-13T12:00:00.000Z',
      venueId: venues[0]?.id || '',
      tags: 'Innovation, Tech',
      capacity: 250
    });
    setSessionModalOpen(true);
  };

  // Open Session Edit
  const handleOpenEditSession = (s: Session) => {
    setEditingSession(s);
    setSessionForm({
      title: s.title,
      description: s.description,
      speaker: s.speaker,
      speakerRole: s.speakerRole,
      startTime: s.startTime,
      endTime: s.endTime,
      venueId: s.venueId,
      tags: s.tags.join(', '),
      capacity: s.capacity || 200
    });
    setSessionModalOpen(true);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.title.trim()) return;

    const targetVenue = venues.find(v => v.id === sessionForm.venueId);
    const parsedTags = sessionForm.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingSession) {
      updateSession(editingSession.id, {
        title: sessionForm.title.trim(),
        description: sessionForm.description.trim(),
        speaker: sessionForm.speaker.trim(),
        speakerRole: sessionForm.speakerRole.trim(),
        startTime: sessionForm.startTime,
        endTime: sessionForm.endTime,
        venueId: sessionForm.venueId,
        roomName: targetVenue?.name || 'Main Hall',
        tags: parsedTags,
        capacity: Number(sessionForm.capacity)
      });
      addToast(`Session "${sessionForm.title}" updated successfully.`, 'success');
    } else {
      addSession({
        title: sessionForm.title.trim(),
        description: sessionForm.description.trim(),
        speaker: sessionForm.speaker.trim(),
        speakerRole: sessionForm.speakerRole.trim(),
        startTime: sessionForm.startTime,
        endTime: sessionForm.endTime,
        venueId: sessionForm.venueId,
        roomName: targetVenue?.name || 'Main Hall',
        tags: parsedTags,
        capacity: Number(sessionForm.capacity)
      });
      addToast(`New session "${sessionForm.title}" added to schedule!`, 'success');
    }
    setSessionModalOpen(false);
  };

  /* Shared input class for all modal form fields */
  const inputCls = "w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

  return (
    <div className="space-y-5">
      {/* Top Selector and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Venues & Event Programming Directory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure map coordinates, accessibility specifications, speaker details, and room capacities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setActiveTab('venues')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeTab === 'venues'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Venues ({venues.length})
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeTab === 'sessions'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Sessions ({sessions.length})
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={activeTab === 'venues' ? handleOpenAddVenue : handleOpenAddSession}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {activeTab === 'venues' ? 'Add Venue' : 'Add Session'}
          </Button>
        </div>
      </div>

      {/* Venues Table / List */}
      {activeTab === 'venues' && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Venue Name</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Zone</th>
                  <th className="py-3.5 px-4">Coords (X, Y)</th>
                  <th className="py-3.5 px-4">Accessibility</th>
                  <th className="py-3.5 px-4">Check-ins</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {venues.map(v => {
                  const typeInfo = getVenueTypeInfo(v.type);
                  const zone = zones.find(z => z.id === v.zoneId);

                  return (
                    <tr key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white block">{v.name}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-1">{v.description}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${typeInfo.badgeBg}`}>
                          {v.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {zone?.name || v.zoneId}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                        ({v.x}, {v.y})
                      </td>
                      <td className="py-3.5 px-4">
                        {v.isAccessible ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <Accessibility className="w-3.5 h-3.5" /> Step-Free
                          </span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                        {v.checkInCount || 0}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditVenue(v)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
                            title="Edit venue"
                            aria-label={`Edit ${v.name}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ id: v.id, name: v.name, type: 'venue' })}
                            className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors"
                            title="Delete venue"
                            aria-label={`Delete ${v.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sessions List */}
      {activeTab === 'sessions' && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Session Title</th>
                  <th className="py-3.5 px-4">Speaker</th>
                  <th className="py-3.5 px-4">Room / Venue</th>
                  <th className="py-3.5 px-4">Time Slot</th>
                  <th className="py-3.5 px-4">Tags</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {sessions.map(s => {
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-slate-900 dark:text-white block">{s.title}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-1">{s.description}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">{s.speaker}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{s.speakerRole}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {s.roomName}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                        {formatTimeRange(s.startTime, s.endTime)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {s.tags.map(t => (
                            <span key={t} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded text-slate-600 dark:text-slate-400">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditSession(s)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
                            title="Edit session"
                            aria-label={`Edit ${s.title}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ id: s.id, name: s.title, type: 'session' })}
                            className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors"
                            title="Delete session"
                            aria-label={`Delete ${s.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Venue Modal */}
      {venueModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setVenueModalOpen(false)}
          title={editingVenue ? 'Edit Venue Location' : 'Add New Venue Location'}
          maxWidth="md"
        >
          <form onSubmit={handleSaveVenue} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Venue Name
              </label>
              <input
                type="text"
                required
                value={venueForm.name}
                onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Type
                </label>
                <select
                  value={venueForm.type}
                  onChange={(e) => setVenueForm({ ...venueForm, type: e.target.value as VenueType })}
                  className={inputCls}
                >
                  <option value="stage">Stage</option>
                  <option value="booth">Booth / Expo</option>
                  <option value="foodcourt">Food & Drink</option>
                  <option value="restroom">Restroom</option>
                  <option value="helpdesk">Help Desk</option>
                  <option value="firstaid">First Aid</option>
                  <option value="security">Security</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Zone
                </label>
                <select
                  value={venueForm.zoneId}
                  onChange={(e) => setVenueForm({ ...venueForm, zoneId: e.target.value })}
                  className={inputCls}
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Map X (0–100)
                </label>
                <input
                  type="number"
                  min={5}
                  max={95}
                  value={venueForm.x}
                  onChange={(e) => setVenueForm({ ...venueForm, x: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Map Y (0–100)
                </label>
                <input
                  type="number"
                  min={5}
                  max={95}
                  value={venueForm.y}
                  onChange={(e) => setVenueForm({ ...venueForm, y: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAccessible"
                checked={venueForm.isAccessible}
                onChange={(e) => setVenueForm({ ...venueForm, isAccessible: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus-visible:ring-indigo-500 border-slate-300 dark:border-slate-600"
              />
              <label htmlFor="isAccessible" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Step-Free Accessible (Wheelchair Ramp / Elevator Available)
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={2}
                value={venueForm.description}
                onChange={(e) => setVenueForm({ ...venueForm, description: e.target.value })}
                className={inputCls + ' resize-none'}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="secondary" size="sm" onClick={() => setVenueModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Venue
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Session Modal */}
      {sessionModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setSessionModalOpen(false)}
          title={editingSession ? 'Edit Summit Session' : 'Add New Summit Session'}
          maxWidth="md"
        >
          <form onSubmit={handleSaveSession} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Session Title
              </label>
              <input
                type="text"
                required
                value={sessionForm.title}
                onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Speaker Name
                </label>
                <input
                  type="text"
                  required
                  value={sessionForm.speaker}
                  onChange={(e) => setSessionForm({ ...sessionForm, speaker: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Role / Affiliation
                </label>
                <input
                  type="text"
                  value={sessionForm.speakerRole}
                  onChange={(e) => setSessionForm({ ...sessionForm, speakerRole: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Venue Location
              </label>
              <select
                value={sessionForm.venueId}
                onChange={(e) => setSessionForm({ ...sessionForm, venueId: e.target.value })}
                className={inputCls}
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={sessionForm.tags}
                onChange={(e) => setSessionForm({ ...sessionForm, tags: e.target.value })}
                placeholder="AI, Robotics, Accessibility"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={sessionForm.description}
                onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                className={inputCls + ' resize-none'}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="secondary" size="sm" onClick={() => setSessionModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Session
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
