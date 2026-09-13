/**
 * VenueOS — Buddy Finder & Peer Location Sharing
 */
import React, { useState } from 'react';
import { useAttendeeStore } from '../../stores/attendeeStore';
import { useToastStore } from '../../stores/toastStore';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import {
  Users,
  Share2,
  Copy,
  Check,
  MapPin,
  UserPlus,
  ShieldCheck,
  UserX
} from 'lucide-react';

interface BuddyFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuddyFinderModal: React.FC<BuddyFinderModalProps> = ({ isOpen, onClose }) => {
  const { profile, connectBuddy, disconnectBuddy } = useAttendeeStore();
  const { addToast } = useToastStore();
  const [inputCode, setInputCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const myCode = profile.buddyCode || 'VOS-7821';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(myCode);
    setCopied(true);
    addToast('Invite code copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const ok = connectBuddy(inputCode);
    if (ok) {
      setInputCode('');
      setErrorMsg('');
      addToast('Buddy paired! Their live pin is visible on the venue map.', 'success');
    } else {
      setErrorMsg('Invalid code format. Codes look like "VOS-3199".');
      addToast('Invalid buddy code format. Example: "VOS-3199"', 'error');
    }
  };

  const handleDisconnect = () => {
    disconnectBuddy();
    addToast('Buddy location sharing disconnected.', 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buddy Finder (Opt-In Location)"
      description="Privately share your live venue map position with a friend or colleague."
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Your Unique Sharing Code */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-lg space-y-2">
          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
            Your Personal Invite Code
          </span>
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900">
            <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {myCode}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied' : 'Copy Code'}
            </Button>
          </div>
          <p className="text-[11px] text-slate-500">
            Share this 4-digit code with your buddy so they can locate you on the map.
          </p>
        </div>

        {/* Currently Connected Buddy Status */}
        {profile.connectedBuddy ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  {profile.connectedBuddy.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {profile.connectedBuddy.name}
                  </h4>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Visible on Venue Map ({profile.connectedBuddy.lastSeen})
                  </span>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                title="Disconnect buddy"
              >
                <UserX className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Your buddy's pink avatar marker is currently rendered on your venue map.
            </p>
          </div>
        ) : (
          /* Pair with Buddy Input */
          <form onSubmit={handleConnect} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Pair with Friend's Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="e.g. VOS-3199"
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm uppercase font-mono tracking-wider text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Connect
              </Button>
            </div>
            {errorMsg && <p className="text-xs text-rose-600">{errorMsg}</p>}
          </form>
        )}

        {/* Privacy Note */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Location sharing is peer-to-peer scoped strictly between you and your buddy. No public broadcasting. You can stop sharing at any time.
          </span>
        </div>
      </div>
    </Modal>
  );
};
