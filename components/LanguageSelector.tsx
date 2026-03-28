import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGE_NAMES } from '../utils/countryLanguageMap';
import { SupportedLanguage } from '../types';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'navbar' | 'banner';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = "", variant = 'navbar' }) => {
  const { language, setLanguage } = useLanguage();

  const textColor = variant === 'banner' ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-cyan-400';

  return (
    <div className={`relative flex items-center gap-2 group ${className}`}>
      <Globe className={`w-4 h-4 ${textColor} transition-colors`} />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
        className={`appearance-none bg-transparent text-xs font-bold uppercase tracking-widest ${textColor} transition-colors cursor-pointer outline-none border-none py-1 pr-4 focus:ring-0`}
        style={{ backgroundImage: 'none' }}
        aria-label="Select Language"
      >
        {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
          <option key={code} value={code} className="bg-[#020203] text-gray-400">
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
