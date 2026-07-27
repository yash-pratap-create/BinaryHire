import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-gradient-to-r from-[#c94dff] to-[#7c3aed] text-[#0c0b10] font-semibold shadow-md hover:shadow-lg hover:shadow-[#c94dff]/25 hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-[#1e1a29] hover:bg-[#282337] text-[#e0b3ff] border border-[#2a2733]',
    ghost: 'hover:bg-[#16151c] text-[#8b899a] hover:text-[#f2f1f5]',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30',
    outline: 'border border-[#1f1d27] bg-[#111116] hover:bg-[#16151c] hover:border-[#c94dff] text-[#f2f1f5]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-sm',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
