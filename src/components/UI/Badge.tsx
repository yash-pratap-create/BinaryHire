import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'default' }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'outline' && 'border border-current bg-transparent',
        className
      )}
    >
      {children}
    </span>
  );
};
