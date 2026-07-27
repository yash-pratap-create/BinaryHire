import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, leftIcon, className, id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-[#a8a6b3]">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6f6d7a]">{leftIcon}</div>
        )}
        <input
          id={inputId}
          className={clsx(
            'w-full rounded-xl border text-sm text-[#f2f1f5] placeholder:text-[#6f6d7a]',
            'bg-[#111116] border-[#24212c]',
            'transition-all duration-200',
            'focus:outline-none focus:border-[#c94dff] focus:ring-2 focus:ring-[#c94dff]/20',
            error ? 'border-red-500/60 focus:ring-red-500/20' : '',
            leftIcon ? 'pl-10 pr-4 py-2.5' : 'px-3.5 py-2.5',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
  children?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, error, options, children, className, id, ...props }) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-[#a8a6b3]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'w-full rounded-xl border text-sm text-[#f2f1f5]',
          'bg-[#111116] border-[#24212c]',
          'px-3.5 py-2.5 transition-all duration-200 cursor-pointer',
          'focus:outline-none focus:border-[#c94dff] focus:ring-2 focus:ring-[#c94dff]/20',
          error ? 'border-red-500/60 focus:ring-red-500/20' : '',
          className
        )}
        {...props}
      >
        {children
          ? children
          : options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#111116] text-[#f2f1f5]">
                {opt.label}
              </option>
            ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, id, ...props }) => {
  const taId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={taId} className="text-xs font-medium text-[#a8a6b3]">
          {label}
        </label>
      )}
      <textarea
        id={taId}
        rows={3}
        className={clsx(
          'w-full rounded-xl border text-sm text-[#f2f1f5] placeholder:text-[#6f6d7a]',
          'bg-[#111116] border-[#24212c]',
          'px-3.5 py-2.5 resize-none transition-all duration-200',
          'focus:outline-none focus:border-[#c94dff] focus:ring-2 focus:ring-[#c94dff]/20',
          error ? 'border-red-500/60 focus:ring-red-500/20' : '',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
