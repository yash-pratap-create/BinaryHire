import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  colorIndex?: number;
}

const COLORS = [
  'bg-brand-600 text-white',
  'bg-purple-600 text-white',
  'bg-emerald-600 text-white',
  'bg-amber-500 text-white',
  'bg-rose-600 text-white',
  'bg-cyan-600 text-white',
];

export const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md', className, colorIndex }) => {
  const colorClass = COLORS[(colorIndex ?? initials.charCodeAt(0)) % COLORS.length];
  const sizes = {
    sm:  'w-7 h-7 text-xs',
    md:  'w-9 h-9 text-sm',
    lg:  'w-12 h-12 text-base',
    xl:  'w-16 h-16 text-xl',
  };
  return (
    <div className={clsx(
      'rounded-full flex items-center justify-center font-semibold flex-shrink-0',
      colorClass,
      sizes[size],
      className
    )}>
      {initials.slice(0, 2)}
    </div>
  );
};
