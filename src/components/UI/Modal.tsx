import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      {/* Modal Container */}
      <div
        className={clsx(
          'relative w-full rounded-2xl shadow-2xl animate-slide-up overflow-hidden',
          sizes[size]
        )}
        style={{ background: '#111116', border: '1px solid #1f1d27' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#1a1820]">
          <h2
            id="modal-title"
            className="text-base font-semibold text-[#f2f1f5]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-lg p-1.5 text-[#8b899a] hover:text-[#f2f1f5]">
            <X size={18} />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] text-[#f2f1f5]">
          {children}
        </div>
      </div>
    </div>
  );
};
