import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchGeoLocation } from '../utils/geoService';
import { GeoLocationData } from '../types';

interface GeoContextType {
  geoData: GeoLocationData | null;
  isLoading: boolean;
}

const GeoContext = createContext<GeoContextType>({ geoData: null, isLoading: true });

/**
 * GeoProvider — fetches geolocation once and shares it across all consumers.
 *
 * Both GreetingBanner and ChatSidebar previously issued independent
 * ipapi.co requests. Lifting state here eliminates the duplicate network call.
 * The fetch result is cached in localStorage for 24 hours (see geoService.ts).
 */
export const GeoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [geoData, setGeoData] = useState<GeoLocationData | null>(() => {
    if (typeof window === 'undefined') return null;
    // Read from the cache that geoService writes so there is no flash on re-visit
    const CACHE_KEY = 'trivian_geo_cache_v2';
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { data: GeoLocationData; expiresAt: number };
        if (Date.now() < parsed.expiresAt) return parsed.data;
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(!geoData);

  useEffect(() => {
    if (geoData) return; // already resolved from cache
    let cancelled = false;

    fetchGeoLocation().then((data) => {
      if (!cancelled) {
        setGeoData(data);
        setIsLoading(false);
      }
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once — geoData is initialised from localStorage

  return (
    <GeoContext.Provider value={{ geoData, isLoading }}>
      {children}
    </GeoContext.Provider>
  );
};

export const useGeo = (): GeoContextType => useContext(GeoContext);
