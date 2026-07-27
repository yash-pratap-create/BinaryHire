import React from 'react';
import logoImg from '../../assets/file.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showText = true }) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${sizeMap[size]} rounded-xl overflow-hidden p-1 flex items-center justify-center bg-[#0c0b10] border border-[#24212c] shadow-lg shadow-[#c94dff]/20 shrink-0`}>
        <img
          src={logoImg}
          alt="BinaryHire SRMIST Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(201,77,255,0.6)]"
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`${textSizeMap[size]} font-bold tracking-tight text-[#f2f1f5]`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            BinaryHire
          </span>
          <span
            className="text-[9px] font-semibold tracking-widest text-[#c94dff] mt-0.5 uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            SRMIST
          </span>
        </div>
      )}
    </div>
  );
};
