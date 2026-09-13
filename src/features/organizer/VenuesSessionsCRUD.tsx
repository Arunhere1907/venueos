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

  /* shared form input style */
  const inp = 'w-full px-3 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg text-xs text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]';
  const lbl = 'block text-[11px] font-semibold uppercase tracking-wider text-[#6b6b6b] mb-1';

  return (
    <div className="space-y-5">

      {/* Header + tab switcher */}
      <div className="bg-white rounded-xl border border-[#e8e8e8] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-[#0a0a0a]">Venues &amp; Event Programming</h3>
          <p className="text-xs text-[#6b6b6b] mt-0.5">
            Configure map coordinates, accessibility, speaker details, and room capacities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-[#e8e8e8] rounded-lg overflow-hidden text-xs font-medium">
            {(['venues', 'sessions'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 transition-colors focus:outline-none ${
                  activeTab === t
                    ? 'bg-[#0a0a0a] text-white'
                    : 'bg-white text-[#6b6b6b] hover:bg-[#f7f7f7]'
                }`}
              >
                {t === 'venues' ? `Venues (${venues.length})` : `Sessions (${sessions.length})`}
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={activeTab === 'venues' ? handleOpenAddVenue : handleOpenAddSession}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add {activeTab === 'venues' ? 'Venue' : 'Session'}
          </Button>
        </div>
      </div>

      {/* Venues table */}
      {activeTab === 'venues' && (
        <div className="bg-white rounded-xl border border-[#e8e8e8] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f7f7] border-b border-[#e8e8e8]">
                <tr>
                  {['Venue', 'Type', 'Zone', 'Coords', 'Access', 'Check-ins', ''].map(h => (
                    <th key={h} className={`py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b6b6b] ${h === '' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {venues.map(v => {
                  const typeInfo = getVenueTypeInfo(v.type);
                  const zone = zones.find(z => z.id === v.zoneId);
                  return (
                    <tr key={v.id} className="hover:bg-[#f7f7f7] transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-[#0a0a0a]">{v.name}</p>
                        <p className="text-[11px] text-[#9a9a9a] line-clamp-1">{v.description}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${typeInfo.badgeBg}`}>
                          {v.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#3a3a3a]">{zone?.name || v.zoneId}</td>
                      <td className="py-3 px-4 font-mono text-[#9a9a9a]">({v.x},{v.y})</td>
                      <td className="py-3 px-4">
                        {v.isAccessible
                          ? <span className="flex items-center gap-1 text-[#16a34a] font-medium"><Accessibility className="w-3.5 h-3.5" />Step-Free</span>
                          : <span className="text-[#9a9a9a]">Standard</span>
                        }
                      </td>
                      <td className="py-3 px-4 font-medium text-[#4f46e5]">{v.checkInCount || 0}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button onClick={() => handleOpenEditVenue(v)} className="p-1.5 text-[#9a9a9a] hover:text-[#4f46e5] hover:bg-[#f0f0ff] rounded-lg transition-colors" title="Edit">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirm({ id: v.id, name: v.name, type: 'venue' })} className="p-1.5 text-[#9a9a9a] hover:text-[#dc2626] hover:bg-[#fff5f5] rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Sessions table */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-xl border border-[#e8e8e8] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f7f7] border-b border-[#e8e8e8]">
                <tr>
                  {['Session', 'Speaker', 'Room', 'Time', 'Tags', ''].map(h => (
                    <th key={h} className={`py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b6b6b] ${h === '' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {sessions.map(s => (
                  <tr key={s.id} className="hover:bg-[#f7f7f7] transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-medium text-[#0a0a0a]">{s.title}</p>
                      <p className="text-[11px] text-[#9a9a9a] line-clamp-1">{s.description}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#0a0a0a]">{s.speaker}</p>
                      <p className="text-[10px] text-[#9a9a9a]">{s.speakerRole}</p>
                    </td>
                    <td className="py-3 px-4 text-[#3a3a3a]">{s.roomName}</td>
                    <td className="py-3 px-4 font-medium text-[#4f46e5] whitespace-nowrap">{formatTimeRange(s.startTime, s.endTime)}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {s.tags.map(t => (
                          <span key={t} className="px-1.5 py-0.5 bg-[#f0f0f0] text-[#3a3a3a] text-[10px] rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => handleOpenEditSession(s)} className="p-1.5 text-[#9a9a9a] hover:text-[#4f46e5] hover:bg-[#f0f0ff] rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteConfirm({ id: s.id, name: s.title, type: 'session' })} className="p-1.5 text-[#9a9a9a] hover:text-[#dc2626] hover:bg-[#fff5f5] rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Venue Modal */}
      {venueModalOpen && (
        <Modal isOpen onClose={() => setVenueModalOpen(false)} title={editingVenue ? 'Edit Venue' : 'Add Venue'} maxWidth="md">
          <form onSubmit={handleSaveVenue} className="space-y-3 text-xs">
            <div><label className={lbl}>Venue Name</label>
              <input type="text" required value={venueForm.name} onChange={e => setVenueForm({ ...venueForm, name: e.target.value })} className={inp} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className={lbl}>Type</label>
                <select value={venueForm.type} onChange={e => setVenueForm({ ...venueForm, type: e.target.value as VenueType })} className={inp}>
                  {['stage','booth','foodcourt','restroom','helpdesk','firstaid','security'].map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div><label className={lbl}>Zone</label>
                <select value={venueForm.zoneId} onChange={e => setVenueForm({ ...venueForm, zoneId: e.target.value })} className={inp}>
                  {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className={lbl}>Map X (0–100)</label>
                <input type="number" min={5} max={95} value={venueForm.x} onChange={e => setVenueForm({ ...venueForm, x: Number(e.target.value) })} className={inp} />
              </div>
              <div><label className={lbl}>Map Y (0–100)</label>
                <input type="number" min={5} max={95} value={venueForm.y} onChange={e => setVenueForm({ ...venueForm, y: Number(e.target.value) })} className={inp} />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="isAccessible" checked={venueForm.isAccessible}
                onChange={e => setVenueForm({ ...venueForm, isAccessible: e.target.checked })}
                className="w-4 h-4 accent-[#4f46e5]" />
              <span className="text-xs font-medium text-[#3a3a3a]">Step-Free Accessible</span>
            </label>
            <div><label className={lbl}>Description</label>
              <textarea rows={2} value={venueForm.description} onChange={e => setVenueForm({ ...venueForm, description: e.target.value })} className={inp + ' resize-none'} />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#f0f0f0]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setVenueModalOpen(false)}>Cancel</Button>
              <Button variant="primary" size="sm" type="submit">Save Venue</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Session Modal */}
      {sessionModalOpen && (
        <Modal isOpen onClose={() => setSessionModalOpen(false)} title={editingSession ? 'Edit Session' : 'Add Session'} maxWidth="md">
          <form onSubmit={handleSaveSession} className="space-y-3 text-xs">
            <div><label className={lbl}>Session Title</label>
              <input type="text" required value={sessionForm.title} onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })} className={inp} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className={lbl}>Speaker</label>
                <input type="text" required value={sessionForm.speaker} onChange={e => setSessionForm({ ...sessionForm, speaker: e.target.value })} className={inp} />
              </div>
              <div><label className={lbl}>Speaker Role</label>
                <input type="text" value={sessionForm.speakerRole} onChange={e => setSessionForm({ ...sessionForm, speakerRole: e.target.value })} className={inp} />
              </div>
            </div>
            <div><label className={lbl}>Venue</label>
              <select value={sessionForm.venueId} onChange={e => setSessionForm({ ...sessionForm, venueId: e.target.value })} className={inp}>
                {venues.map(v => <option key={v.id} value={v.id}>{v.name} ({v.type})</option>)}
              </select>
            </div>
            <div><label className={lbl}>Tags (comma-separated)</label>
              <input type="text" value={sessionForm.tags} onChange={e => setSessionForm({ ...sessionForm, tags: e.target.value })} placeholder="AI, Robotics" className={inp} />
            </div>
            <div><label className={lbl}>Description</label>
              <textarea rows={3} value={sessionForm.description} onChange={e => setSessionForm({ ...sessionForm, description: e.target.value })} className={inp + ' resize-none'} />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#f0f0f0]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setSessionModalOpen(false)}>Cancel</Button>
              <Button variant="primary" size="sm" type="submit">Save Session</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
