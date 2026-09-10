import React, { Suspense, useEffect, useRef, useState } from 'react';
import { TalentHub } from '../types';
import WorldMapSkeleton from './WorldMapSkeleton';

const WorldMapSVG = React.lazy(() => import('./WorldMapSVG'));

interface WorldMapLazyProps {
  hubs: TalentHub[];
  onHubClick?: (hub: TalentHub) => void;
}

const WorldMapLazy: React.FC<WorldMapLazyProps> = ({ hubs, onHubClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // If map is already visible or very close, load it immediately
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight + 500) {
        setShouldLoad(true);
        return;
      }
    }

    // Otherwise, set up intersection observer to load when user scrolls near
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '500px', // Start loading 500px before entering viewport
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <Suspense fallback={<WorldMapSkeleton />}>
        {shouldLoad ? (
          <WorldMapSVG hubs={hubs} onHubClick={onHubClick} />
        ) : (
          <WorldMapSkeleton />
        )}
      </Suspense>
    </div>
  );
};

export default WorldMapLazy;
