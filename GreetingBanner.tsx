import React, { useEffect, useState } from 'react';
import { fetchGeoLocation } from '../utils/geoService';
import { getTimeOfDay } from '../utils/getTimeOfDay';
import { getCountryGreeting, getCountryAffectionateName } from '../utils/greetings';
import { fetchTemperature } from '../utils/weatherService';
import { GreetingState, GeoLocationData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import './GreetingBanner.css';

const GreetingBanner: React.FC = () => {
  const { language, isRTL } = useLanguage();
  
  // Initialize state synchronously from cache if available to avoid skeleton flash
  const [geoData, setGeoData] = useState<GeoLocationData | null>(() => {
    if (typeof window !== 'undefined' && sessionStorage) {
        const cached = sessionStorage.getItem('trivian_geo_cache_v1');
        if (cached) {
            try { return JSON.parse(cached); } catch(e) {}
        }
    }
    return null;
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(() => !geoData);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Fetch Location & Timezone (Run once)
  useEffect(() => {
    // If we already have data from cache (optimistic init), we might still want to re-validate 
    // or just rely on cache. For now, if we have data, we skip fetch to save bandwidth/time,
    // assuming session storage is fresh enough for the session.
    if (geoData) {
      if (geoData.latitude && geoData.longitude && temperature === null) {
        fetchTemperature(geoData.latitude, geoData.longitude).then(temp => {
          if (temp !== null) setTemperature(temp);
        });
      }
      return;
    }

    let isMounted = true;

    const initData = async () => {
      try {
        const data = await fetchGeoLocation();
        if (isMounted) {
            setGeoData(data);
            setIsLoading(false);
            if (data.latitude && data.longitude) {
              const temp = await fetchTemperature(data.latitude, data.longitude);
              if (isMounted && temp !== null) setTemperature(temp);
            }
        }
      } catch (err) {
        if (isMounted) {
            // Fallback
            setGeoData({
                country_code: 'US',
                country_name: 'Unknown',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });
            setIsLoading(false);
        }
      }
    };

    initData();

    return () => { isMounted = false; };
  }, [geoData, temperature]);

  useEffect(() => {
    if (!geoData) return;
    
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat(language, {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: geoData.timezone,
        });
        setCurrentTime(formatter.format(new Date()));
      } catch (e) {
        setCurrentTime('');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [geoData, language]);

  // Calculate greeting based on current language and time
  const timeOfDay = geoData ? getTimeOfDay(geoData.timezone) : getTimeOfDay();
  const greeting = getCountryGreeting(geoData?.country_code, language, timeOfDay);
  
  const affectionateName = geoData?.country_name && geoData.country_name !== 'Unknown' 
    ? getCountryAffectionateName(geoData.country_code, geoData.country_name)
    : '';

  const subtextParts = [];
  if (affectionateName) {
    subtextParts.push(`Welcome from ${geoData?.city ? geoData.city + ', ' : ''}${affectionateName}`);
  } else {
    subtextParts.push('Welcome to TrivianEdge');
  }

  if (currentTime) {
    subtextParts.push(`It's currently ${currentTime}`);
  }
  
  if (temperature !== null) {
    subtextParts.push(`and ${Math.round(temperature)}°C`);
  }

  const subtext = geoData ? subtextParts.join(' ') : 'Warming up...';

  return (
    <div 
      id="dynamic-greeting" 
      className={`greeting-container ${isLoading ? 'skeleton' : 'fade-in'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="greeting-content flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div key={language}>
            <h1 className={`greeting-title ${!isLoading ? 'text-animate' : ''}`}>
            {isLoading ? '' : greeting}
            </h1>
            <p className={`greeting-subtext ${!isLoading ? 'text-animate delay-100' : ''}`}>
            {isLoading ? '' : subtext}
            </p>
        </div>
        
        {!isLoading && (
          <div className="flex items-center gap-2 sm:self-center bg-white/5 rounded-full px-4 py-1.5 border border-white/5 backdrop-blur-sm">
             <LanguageSelector variant="banner" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GreetingBanner;