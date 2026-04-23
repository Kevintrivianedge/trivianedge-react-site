import React, { useState } from 'react';
import { TalentHub } from '../types';

const project = (lng: number, lat: number): [number, number] => {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return [x, y];
};

const HUB_COORDS: Record<string, [number, number]> = {
  lka: [80.7, 7.9],
  phl: [121.8, 12.9],
  vnm: [108.0, 15.9],
  tur: [35.2, 38.9],
  zaf: [25.0, -29.0],
  cri: [-84.1, 9.9],
};

interface WorldMapSVGProps {
  hubs: TalentHub[];
  onHubClick?: (hub: TalentHub) => void;
}

const WorldMapSVG: React.FC<WorldMapSVGProps> = ({ hubs, onHubClick }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredHub = hubs.find(h => h.id === hoveredId) ?? null;

  return (
    <div className="relative w-full select-none">
      <div className="relative w-full pb-[65.94%]">
        <img
          src="/world-map.svg"
          alt="Interactive world map showing TrivianEdge talent hubs"
          className="absolute inset-0 h-full w-full object-contain invert opacity-55"
          draggable={false}
        />

        {hubs.map((hub) => {
          const coords = HUB_COORDS[hub.id];
          if (!coords) return null;
          const [x, y] = project(coords[0], coords[1]);
          const isHovered = hoveredId === hub.id;

          return (
            <button
              key={hub.id}
              type="button"
              onClick={() => onHubClick?.(hub)}
              onMouseEnter={() => setHoveredId(hub.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(hub.id)}
              onBlur={() => setHoveredId(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-full"
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={`${hub.country} talent hub: ${hub.specialty}`}
            >
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30 bg-cyan-400/10 transition-all duration-300"
                style={{ width: isHovered ? 44 : 32, height: isHovered ? 44 : 32 }}
              />
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 transition-all duration-300"
                style={{ width: isHovered ? 16 : 10, height: isHovered ? 16 : 10 }}
              />
              {isHovered && (
                <span className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20 animate-ping" />
              )}
              <span className="absolute left-1/2 -top-6 -translate-x-1/2 text-sm md:text-base">{hub.flag}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[10px] text-muted/70 text-right">Map data © MapSVG (CC BY 4.0)</p>

      {hoveredHub && (
        <div className="absolute top-4 right-4 glass p-5 rounded-2xl border border-cyan-500/30 max-w-xs pointer-events-none animate-fade-in shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{hoveredHub.flag}</span>
            <div>
              <p className="font-bold text-text text-sm">{hoveredHub.country}</p>
              <p className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest">{hoveredHub.specialty}</p>
            </div>
          </div>
          <p className="text-muted text-xs leading-relaxed line-clamp-3">{hoveredHub.description}</p>
          <p className="mt-3 text-[10px] font-bold text-muted uppercase tracking-widest">{hoveredHub.timeZoneAlignment}</p>
        </div>
      )}
    </div>
  );
};

export default WorldMapSVG;
