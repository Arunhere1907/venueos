/**
 * VenueOS — Minimal Modal Dialog
 * Design: white panel, hairline border, no heavy shadow, clean backdrop
 */
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }[maxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop — very light tint */}
      <div
        className="fixed inset-0 bg-black/30 transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative w-full ${widths} bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden z-10 my-auto animate-scaleIn`}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[#f0f0f0]">
            <div>
              {title && (
                <h3 id="modal-title" className="text-base font-semibold text-[#0a0a0a]">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-[#6b6b6b] mt-0.5 leading-relaxed">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 text-[#9a9a9a] hover:text-[#0a0a0a] hover:bg-[#f7f7f7] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] ml-3 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-5 py-5 max-h-[80vh] overflow-y-auto text-[#0a0a0a]">
          {children}
        </div>
      </div>
    </div>
  );
};
