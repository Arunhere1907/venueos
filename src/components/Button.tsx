/**
 * VenueOS — Minimal Button Component
 * Design: flat, no shadows, hairline borders, single accent
 */
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium transition-colors duration-100 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2   gap-2   min-h-[38px]',
    lg: 'text-sm px-5 py-2.5 gap-2   min-h-[44px]',
  }[size];

  const variants = {
    primary:
      'bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white border border-[#0a0a0a]',
    secondary:
      'bg-[#f7f7f7] hover:bg-[#f0f0f0] text-[#0a0a0a] border border-[#e8e8e8]',
    danger:
      'bg-white hover:bg-[#fff5f5] text-[#dc2626] border border-[#dc2626]/40 hover:border-[#dc2626]/70',
    warning:
      'bg-white hover:bg-[#fffbeb] text-[#b45309] border border-[#b45309]/40 hover:border-[#b45309]/70',
    ghost:
      'bg-transparent hover:bg-[#f7f7f7] text-[#3a3a3a] border border-transparent',
    outline:
      'bg-white hover:bg-[#f7f7f7] text-[#0a0a0a] border border-[#e8e8e8] hover:border-[#d4d4d4]',
  }[variant];

  return (
    <button
      className={`${base} ${sizes} ${variants} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {leftIcon  && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
    </button>
  );
};
