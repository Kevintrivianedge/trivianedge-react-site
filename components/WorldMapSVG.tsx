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
        <div className="absolute top-4 right-4 bg-[#0a0a0f]/95 backdrop-blur-xl p-5 rounded-2xl border border-cyan-500/20 max-w-[220px] pointer-events-none shadow-2xl shadow-cyan-900/30">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl leading-none">{hoveredHub.flag}</span>
            <div>
              <p className="font-bold text-white text-sm leading-tight">{hoveredHub.country}</p>
              <p className="text-cyan-400 text-[9px] font-mono uppercase tracking-widest mt-0.5">{hoveredHub.specialty}</p>
            </div>
          </div>
          <p className="text-[#8a8a9e] text-xs leading-relaxed line-clamp-2 mb-3">{hoveredHub.description}</p>
          <div className="flex items-center gap-1.5 pt-3 border-t border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <p className="text-[9px] font-mono text-[#8a8a9e] uppercase tracking-widest truncate">{hoveredHub.timeZoneAlignment}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMapSVG;
