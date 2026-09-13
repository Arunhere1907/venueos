/**
 * VenueOS — AI Event Concierge & Intelligent Chat Assistant
 */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigationStore } from '../../stores/navigationStore';
import { useScheduleStore } from '../../stores/scheduleStore';
import { useCrowdStore } from '../../stores/crowdStore';
import { ChatMessage } from '../../types';
import { Button } from '../../components/Button';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  Clock,
  Navigation
} from 'lucide-react';

interface AIConciergeChatProps {
  onNavigateToVenue?: (venueId: string) => void;
}

export const AIConciergeChat: React.FC<AIConciergeChatProps> = ({ onNavigateToVenue }) => {
  const { venues, routeToVenue } = useNavigationStore();
  const { sessions } = useScheduleStore();
  const { zones } = useCrowdStore();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: "Hello! I'm your VenueOS Smart Concierge. You can ask me about restrooms, upcoming sessions, food courts, accessibility, or crowd levels.",
      timestamp: new Date().toISOString()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const QUICK_QUESTIONS = [
    'Where is the nearest restroom?',
    'What AI sessions are scheduled?',
    'Where can I get coffee or food?',
    'Where is the emergency medical station?'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // Process intelligent answer
    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = '';
      let actions: ChatMessage['actions'] = [];

      if (q.includes('restroom') || q.includes('toilet') || q.includes('bathroom')) {
        const restroom = venues.find(v => v.type === 'restroom');
        reply = `The nearest accessible restrooms are ${restroom?.name || 'North Restrooms'} on Floor 1. All-gender and family facilities with emergency call buttons are available.`;
        if (restroom) {
          actions.push({ label: `Route to ${restroom.name}`, targetVenueId: restroom.id });
        }
      } else if (q.includes('ai') || q.includes('gemini') || q.includes('agent') || q.includes('model')) {
        const aiSessions = sessions.filter(s => s.tags.includes('AI'));
        const titles = aiSessions.map(s => `"${s.title}"`).join(', ');
        reply = `We have ${aiSessions.length} AI sessions scheduled, including ${titles}. You can also visit the Gemini & AI Innovation Pavilion in East Expo Hall!`;
        const aiBooth = venues.find(v => v.id === 'venue-booth-ai');
        if (aiBooth) {
          actions.push({ label: 'Route to AI Pavilion', targetVenueId: aiBooth.id });
        }
      } else if (q.includes('coffee') || q.includes('food') || q.includes('lunch') || q.includes('eat') || q.includes('drink')) {
        reply = 'You can find Artisan Food Plaza & Terrace in the South Promenade, or Central Espresso Bar in the North Atrium.';
        const foodVenue = venues.find(v => v.type === 'foodcourt');
        if (foodVenue) {
          actions.push({ label: 'Navigate to Food Plaza', targetVenueId: foodVenue.id });
        }
      } else if (q.includes('medical') || q.includes('doctor') || q.includes('first aid') || q.includes('emergency') || q.includes('hurt')) {
        reply = 'The Primary Emergency Medical Station is staffed 24/7 in the North Atrium. You can also tap the red SOS button at any time to alert dispatchers.';
        const aidVenue = venues.find(v => v.type === 'firstaid');
        if (aidVenue) {
          actions.push({ label: 'Route to Medical Station', targetVenueId: aidVenue.id });
        }
      } else if (q.includes('crowd') || q.includes('busy') || q.includes('line')) {
        const crowded = zones.filter(z => z.crowdLevel === 'high');
        if (crowded.length > 0) {
          reply = `${crowded.map(z => z.name).join(', ')} currently has high foot-traffic. We suggest visiting South Promenade or West Conference Wing for quieter seating.`;
        } else {
          reply = 'Crowd density is currently comfortable across all zones with no major chokepoints.';
        }
      } else if (q.includes('wheelchair') || q.includes('access') || q.includes('accessible') || q.includes('asl')) {
        reply = 'VenueOS has universal accessibility support! All stages feature wheelchair ramps, hearing loops, and step-free navigation via North Elevators.';
        const infoDesk = venues.find(v => v.type === 'helpdesk');
        if (infoDesk) {
          actions.push({ label: 'Route to Accessibility Desk', targetVenueId: infoDesk.id });
        }
      } else {
        reply = `I found information related to "${query}" in our event directory. Check our Venue Map or Schedule tabs, or visit the Central Information Desk in North Atrium for assistance.`;
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toISOString(),
        actions
      };

      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const handleActionClick = (targetVenueId?: string) => {
    if (!targetVenueId) return;
    routeToVenue(targetVenueId);
    if (onNavigateToVenue) {
      onNavigateToVenue(targetVenueId);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Event Concierge Chatbot"
        className="fixed bottom-24 right-6 z-30 p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl hover:shadow-indigo-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 border border-indigo-400/30"
      >
        <Sparkles className="w-5 h-5 text-indigo-200" />
        <span className="text-xs font-bold hidden sm:inline">AI Concierge</span>
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:bottom-24 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-8rem)] sm:max-h-[560px] animate-slideUp">
          {/* Top Bar */}
          <div className="px-5 py-4 bg-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">VenueOS Concierge</h3>
                <span className="text-[10px] text-indigo-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Instant Event Intelligence
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                  } space-y-2`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {/* Actions inside message */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 space-y-1">
                      {m.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act.targetVenueId)}
                          className="w-full text-left font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-between"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about the venue..."
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
