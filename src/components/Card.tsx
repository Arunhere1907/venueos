/**
 * VenueOS — Minimal Card & Badge Components
 * Design: white background, single hairline border, no shadow
 */
import React from 'react';

/* ─── Badge ──────────────────────────────────────────────── */
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeClass = size === 'sm'
    ? 'text-[10px] px-1.5 py-0.5'
    : 'text-[11px] px-2 py-0.5';

  const styles: Record<string, string> = {
    neutral: 'bg-[#f0f0f0] text-[#3a3a3a] border-[#e8e8e8]',
    success: 'bg-[#f0faf4] text-[#16a34a] border-[#bbf7d0]',
    warning: 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]',
    danger:  'bg-[#fff5f5] text-[#dc2626] border-[#fecaca]',
    info:    'bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]',
    accent:  'bg-[#f0f0ff] text-[#4f46e5] border-[#c7d2fe]',
  };

  const dotColors: Record<string, string> = {
    neutral: 'bg-[#9a9a9a]',
    success: 'bg-[#16a34a]',
    warning: 'bg-[#b45309]',
    danger:  'bg-[#dc2626]',
    info:    'bg-[#0369a1]',
    accent:  'bg-[#4f46e5]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md border whitespace-nowrap ${sizeClass} ${styles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

/* ─── Card ───────────────────────────────────────────────── */
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  selected?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  selected = false,
  padding = 'md',
}) => {
  const pad = {
    none: 'p-0',
    sm:   'p-3',
    md:   'p-4 sm:p-5',
    lg:   'p-5 sm:p-6',
  }[padding];

  const interactive = (onClick || hoverable)
    ? 'cursor-pointer hover:border-[#d4d4d4] transition-colors duration-100'
    : '';

  const border = selected
    ? 'border-[#4f46e5]'
    : 'border-[#e8e8e8]';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border ${border} ${pad} ${interactive} ${className}`}
    >
      {children}
    </div>
  );
};
