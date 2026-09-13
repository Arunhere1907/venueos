/**
 * VenueOS — Map Search & Voice Quick-Actions Component
 */
import React, { useState, useEffect } from 'react';
import { useNavigationStore } from '../../stores/navigationStore';
import { VenueType } from '../../types';
import { initVoiceRecognition } from '../../lib/speech';
import { fuzzyMatch } from '../../lib/utils';
import { Search, Mic, MicOff, Accessibility, X, MapPin } from 'lucide-react';

const CATEGORIES: { label: string; value: VenueType | 'all' }[] = [
  { label: 'All Places', value: 'all' },
  { label: 'Stages', value: 'stage' },
  { label: 'Booths & AI', value: 'booth' },
  { label: 'Dining & Coffee', value: 'foodcourt' },
  { label: 'Restrooms', value: 'restroom' },
  { label: 'Help Desks', value: 'helpdesk' },
  { label: 'Medical & First Aid', value: 'firstaid' },
  { label: 'Security HQ', value: 'security' }
];

export const MapSearch: React.FC = () => {
  const {
    venues,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    accessibleOnly,
    setAccessibleOnly,
    selectVenue
  } = useNavigationStore();

  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Suggestions based on search
  const suggestions = searchQuery.trim()
    ? venues.filter(
        v =>
          fuzzyMatch(searchQuery, v.name) ||
          fuzzyMatch(searchQuery, v.type) ||
          (v.description && fuzzyMatch(searchQuery, v.description))
      ).slice(0, 5)
    : [];

  const handleVoiceSearch = () => {
    if (isListening) return;

    setVoiceFeedback('Listening... speak a place or facility (e.g. "restroom", "main stage")');
    setIsListening(true);

    const recognizer = initVoiceRecognition(
      (transcript) => {
        setIsListening(false);
        const cleaned = transcript.toLowerCase();
        setVoiceFeedback(`Heard: "${transcript}"`);
        setSearchQuery(transcript);

        // Voice smart intent mapping:
        if (cleaned.includes('restroom') || cleaned.includes('toilet') || cleaned.includes('bathroom')) {
          setTypeFilter('restroom');
        } else if (cleaned.includes('food') || cleaned.includes('coffee') || cleaned.includes('eat')) {
          setTypeFilter('foodcourt');
        } else if (cleaned.includes('medical') || cleaned.includes('first aid') || cleaned.includes('doctor')) {
          setTypeFilter('firstaid');
        } else if (cleaned.includes('help') || cleaned.includes('info')) {
          setTypeFilter('helpdesk');
        } else if (cleaned.includes('stage') || cleaned.includes('keynote')) {
          setTypeFilter('stage');
        }

        // Auto select first match if found
        const match = venues.find(
          v =>
            fuzzyMatch(transcript, v.name) ||
            fuzzyMatch(transcript, v.type)
        );
        if (match) {
          selectVenue(match.id);
        }

        setTimeout(() => setVoiceFeedback(''), 4000);
      },
      () => {
        setIsListening(false);
      },
      (err) => {
        setIsListening(false);
        setVoiceFeedback(`Voice input: ${err}`);
        setTimeout(() => setVoiceFeedback(''), 4000);
      }
    );

    if (!recognizer.isSupported) {
      setIsListening(false);
      setVoiceFeedback('Voice recognition not available in this browser. Try typing instead.');
      setTimeout(() => setVoiceFeedback(''), 4000);
      return;
    }

    recognizer.start();
  };

  return (
    <div className="w-full space-y-3">
      {/* Top Search Input Row */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search stages, booths, restrooms, food, or help desks..."
            className="w-full pl-12 pr-24 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsDropdownOpen(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Voice Search Button */}
            <button
              onClick={handleVoiceSearch}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
              title="Voice Search: Click and speak a place name or category"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Voice Feedback Notification */}
        {voiceFeedback && (
          <div className="mt-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 animate-fadeIn">
            {voiceFeedback}
          </div>
        )}

        {/* Autocomplete Dropdown */}
        {isDropdownOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-30 overflow-hidden py-1">
            {suggestions.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  selectVenue(item.id);
                  setSearchQuery(item.name);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.type} • Floor {item.floor || 1}
                    </div>
                  </div>
                </div>
                {item.isAccessible && (
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Step-free
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Chips & Accessible Route Toggle */}
      <div className="w-full min-w-0 flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 shrink-0">
          {CATEGORIES.map((cat) => {
            const isSelected = typeFilter === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setTypeFilter(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Accessible Routes Toggle */}
        <button
          onClick={() => setAccessibleOnly(!accessibleOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
            accessibleOnly
              ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
          title="Filter and route step-free accessible pathways only"
        >
          <Accessibility className="w-4 h-4" />
          <span>Step-Free Only</span>
        </button>
      </div>
    </div>
  );
};
