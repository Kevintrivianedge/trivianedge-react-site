import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGE_NAMES } from '../utils/countryLanguageMap';
import { SupportedLanguage } from '../types';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'navbar' | 'banner';
}

const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸',
  ar: '🇦🇪',
  si: '🇱🇰',
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = "", variant = 'navbar' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  const textColor = variant === 'banner' ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-cyan-400';
  const dropdownBg = 'bg-[#0a0a0f] border border-[rgba(255,255,255,0.08)]';

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Move focus to first option when dropdown opens
  useEffect(() => {
    if (isOpen) {
      firstOptionRef.current?.focus();
    }
  }, [isOpen]);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const languageEntries = Object.entries(LANGUAGE_NAMES) as [SupportedLanguage, string][];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(o => !o)}
        className={`flex items-center gap-1.5 ${textColor} transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 rounded-md px-1 py-1`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm">{LANGUAGE_FLAGS[language]}</span>
        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">{LANGUAGE_NAMES[language]}</span>
        <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Language options"
          className={`absolute right-0 mt-2 w-44 ${dropdownBg} rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-[150] backdrop-blur-xl`}
        >
          {languageEntries.map(([code, name], idx) => (
            <button
              key={code}
              ref={idx === 0 ? firstOptionRef : undefined}
              role="option"
              aria-selected={code === language}
              type="button"
              onClick={() => handleSelect(code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                code === language
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-base leading-none">{LANGUAGE_FLAGS[code]}</span>
              <span className="flex-1 font-medium">{name}</span>
              {code === language && <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
