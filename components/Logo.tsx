import React from 'react';

export const LogoIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 320 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 35L75 35L55 5L0 35Z" fill="#60B46D" />
    <path d="M60 5L150 5L150 95L60 5Z" fill="#4DBC9F" />
    <path d="M160 95L160 5L250 5L160 95Z" fill="#46C5B3" />
    <path d="M235 35L310 35L255 5L235 35Z" fill="#40C9C8" />
  </svg>
);

const Logo = ({ onClick, showTagline = true }: { onClick?: () => void; showTagline?: boolean }) => (
  <div className="flex items-center gap-3 group cursor-pointer" onClick={onClick}>
    <div className="relative w-12 h-8 flex items-center justify-center">
      <LogoIcon className="w-full h-full transition-transform duration-500 group-hover:scale-110" />
    </div>
    <div className="flex items-center font-['Space_Grotesk']">
      <span className="text-2xl font-bold tracking-tight text-text">
        Trivian<span className="text-muted font-normal">Edge</span>
      </span>
      {showTagline && (
        <span className="ml-3 text-[10px] md:text-xs font-bold tracking-[0.2em] text-muted uppercase opacity-80 pt-1.5">
          Solutions
        </span>
      )}
    </div>
  </div>
);

export default Logo;
