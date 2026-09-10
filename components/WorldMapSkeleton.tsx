import React from 'react';

const WorldMapSkeleton: React.FC = () => {
  return (
    <div className="relative w-full select-none">
      <div className="relative w-full pb-[65.94%] bg-gradient-to-b from-white/20 to-white/10 dark:from-white/5 dark:to-white/[0.02] rounded-lg animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm text-muted">Loading interactive map...</div>
        </div>
      </div>
      <p className="mt-2 text-[10px] text-muted text-right">Map data © MapSVG (CC BY 4.0)</p>
    </div>
  );
};

export default WorldMapSkeleton;
