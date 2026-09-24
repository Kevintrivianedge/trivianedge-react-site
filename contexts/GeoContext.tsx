import React, { createContext, useContext, useState, useEffect, startTransition } from 'react';
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
 * /api/geo requests. Lifting state here eliminates the duplicate network call.
 * The fetch result is cached in localStorage for 24 hours (see geoService.ts).
 */
export const GeoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Starts empty on both server and client so hydration matches; the cached
  // or fetched value is applied after mount as a transition, which React can
  // defer until hydration finishes (a plain update here caused React #421).
  const [geoData, setGeoData] = useState<GeoLocationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    const apply = (data: GeoLocationData) => {
      if (cancelled) return;
      startTransition(() => {
        setGeoData(data);
        setIsLoading(false);
      });
    };

    // fetchGeoLocation returns the 24h localStorage cache when it's fresh.
    fetchGeoLocation().then(apply);

    return () => { cancelled = true; };
  }, []);

  return (
    <GeoContext.Provider value={{ geoData, isLoading }}>
      {children}
    </GeoContext.Provider>
  );
};

export const useGeo = (): GeoContextType => useContext(GeoContext);
