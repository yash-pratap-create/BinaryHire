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
    <>
      <style>{`
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(2deg); }
        }
        @keyframes subGlow {
          0%, 100% { opacity: 0.85; letter-spacing: 0.18em; }
          50% { opacity: 1; letter-spacing: 0.24em; filter: drop-shadow(0 0 6px rgba(92,225,230,0.8)); }
        }
        .animated-logo-icon {
          animation: logoFloat 3.8s ease-in-out infinite;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animated-logo-icon:hover {
          transform: scale(1.12) rotate(-4deg);
          box-shadow: 0 0 24px rgba(201, 77, 255, 0.6) !important;
        }
        .animated-brand-text {
          background: linear-gradient(90deg, #f2f1f5, #c94dff, #5ce1e6, #f2f1f5);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 4s ease infinite;
        }
        .animated-sub-text {
          animation: subGlow 3.2s ease-in-out infinite;
        }
      `}</style>
      <div className={`flex items-center gap-2.5 ${className} group cursor-pointer`}>
        <div className={`animated-logo-icon ${sizeMap[size]} rounded-xl overflow-hidden p-1 flex items-center justify-center bg-[#0c0b10] border border-[#24212c] shadow-lg shadow-[#c94dff]/20 shrink-0`}>
          <img
            src={logoImg}
            alt="BinaryHire SRMIST Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(201,77,255,0.6)]"
          />
        </div>
        {showText && (
          <div className="flex flex-col leading-none">
            <span
              className={`animated-brand-text ${textSizeMap[size]} font-bold tracking-tight`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              BinaryHire
            </span>
            <span
              className="animated-sub-text text-[9px] font-semibold text-[#c94dff] mt-0.5 uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              SRMIST
            </span>
          </div>
        )}
      </div>
    </>
  );
};
